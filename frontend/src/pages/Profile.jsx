import React, { useState, useEffect, useContext } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    notifications: { email: true, push: true },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        try {
          const ref = doc(db, 'users', user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setFormData(prev => ({
              ...prev,
              name: snap.data().name || user.name || '',
              email: snap.data().email || user.email || '',
              bio: snap.data().bio || '',
              notifications: snap.data().notifications || { email: true, push: true },
            }));
            console.log('Profile loaded:', snap.data());
          } else {
            // Use AuthContext user as fallback and create Firestore doc
            const defaultData = {
              name: user.name || '',
              email: user.email || '',
              bio: '',
              notifications: { email: true, push: true },
            };
            setFormData(defaultData);
            await setDoc(ref, defaultData);
            console.log('New profile created:', defaultData);
          }
        } catch (err) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: '',
            notifications: { email: true, push: true },
          });
        }
        setLoading(false);
      };
      fetchData();
    } else if (user === null) {
      setLoading(false); // Prevent infinite loading if no user
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, formData, { merge: true });
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <p className="text-center">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900">Profile Settings</h2>
        <p className="text-neutral-600">Manage your account settings and preferences.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Profile Picture</h3>
              <p className="text-sm text-neutral-500">Click the camera icon to update your photo</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={
                formData.email ||
                user?.email ||
                (user?.providerData && user.providerData[0]?.email) ||
                ''
              }
              readOnly
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-neutral-700">Email Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-neutral-700">Push Notifications</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
