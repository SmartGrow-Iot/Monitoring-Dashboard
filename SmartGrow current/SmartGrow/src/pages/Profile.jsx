import React, { useState, useContext } from 'react';
import { User, Mail, Camera, Save } from 'lucide-react';
import { AuthContext } from '../App';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    notifications: user?.notifications || {
      email: true,
      push: true
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ ...user, ...formData });
  };

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
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, email: e.target.checked }
                  })}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-neutral-700">Email Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, push: e.target.checked }
                  })}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-neutral-700">Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
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
