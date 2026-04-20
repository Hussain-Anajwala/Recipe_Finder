import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login, token } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleProfileSave = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      const { data } = await axios.put('/api/auth/profile', form);
      login(token, data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-headline text-2xl text-primary">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="font-headline text-3xl text-on-surface">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="font-technical text-xs text-on-surface-variant">@{user?.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant mb-6">
          {['profile', 'password'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t === 'profile' ? 'Profile Details' : 'Change Password'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 p-3 bg-error-container border border-error/20 rounded text-on-error-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-3 bg-secondary-container/50 border border-secondary/20 rounded text-on-secondary-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>check_circle</span>
            {success}
          </div>
        )}

        {tab === 'profile' && (
          <form onSubmit={handleProfileSave} className="bg-surface-container-low border border-outline-variant rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['firstName', 'lastName'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-on-surface mb-1.5 capitalize">
                    {field === 'firstName' ? 'First Name' : 'Last Name'}
                  </label>
                  <input name={field} type="text" required value={form[field]} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Username</label>
              <input type="text" value={user?.username || ''} disabled
                className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded text-on-surface-variant text-sm opacity-60 cursor-not-allowed" />
              <p className="font-technical text-xs text-on-surface-variant mt-1">Username cannot be changed.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Saving…</> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={handlePasswordChange} className="bg-surface-container-low border border-outline-variant rounded-lg p-6 space-y-4">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
              <div key={field}>
                <label className="block text-sm font-medium text-on-surface mb-1.5">
                  {['Current Password', 'New Password', 'Confirm New Password'][i]}
                </label>
                <input name={field} type="password" required value={pwForm[field]} onChange={handlePwChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="••••••••" />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Updating…</> : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
