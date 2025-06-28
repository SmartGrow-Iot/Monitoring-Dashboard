import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User, Save, Lock } from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [account, setAccount] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  // State for change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        try {
          const ref = doc(db, 'users', user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setAccount({
              name: snap.data().name || user.name || '',
              email: snap.data().email || user.email || '',
            });
            console.log('Account settings loaded:', snap.data());
          } else {
            // Use AuthContext user as fallback and create Firestore doc
            const defaultData = {
              name: user.name || '',
              email: user.email || '',
            };
            setAccount(defaultData);
            await setDoc(ref, defaultData);
            console.log('New account settings created:', defaultData);
          }
        } catch (err) {
          setAccount({
            name: user.name || '',
            email: user.email || '',
          });
        }
        setLoading(false);
      };
      fetchData();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const saveAccountSettings = async () => {
    if (user?.uid) {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, {
        name: account.name,
        email: account.email
      }, { merge: true });
      alert('Account settings saved!');
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      alert('Please enter a new password.');
      return;
    }
    if (!confirmPassword) {
      alert('Please confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    try {
      const userAuth = auth.currentUser;
      if (!userAuth) throw new Error('User not authenticated.');
      const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);
      await reauthenticateWithCredential(userAuth, credential);
      await updatePassword(userAuth, newPassword);
      alert('Password updated successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert('Failed to update password: ' + (err.message || err));
    }
    setPasswordLoading(false);
  };

  if (loading) {
    return <p className="text-center">Loading settings...</p>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold text-neutral-900">Settings</h2>

      {/* Account Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Account Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Display Name
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                value={account.name}
                onChange={e => setAccount({ ...account, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                value={account.email}
                onChange={e => setAccount({ ...account, email: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              className="btn btn-outline text-sm flex items-center gap-2"
              onClick={() => setShowPasswordModal(true)}
            >
              <Lock size={16} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={saveAccountSettings}
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <label className="block text-sm mb-1">Current Password</label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md pr-10"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 transform -translate-y-1/2 text-neutral-400"
                  tabIndex={-1}
                  onClick={() => setShowCurrentPassword(v => !v)}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm mb-1">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md pr-10"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 transform -translate-y-1/2 text-neutral-400"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword(v => !v)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm mb-1">Confirm New Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md pr-10"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 transform -translate-y-1/2 text-neutral-400"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(v => !v)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

