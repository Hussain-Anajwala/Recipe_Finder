import React, { useState, useEffect } from 'react';

import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchProfile = async () => {
    try {
      const response = await API.get('/api/auth/profile', getAuthConfig());
      setProfileData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        username: response.data.username
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile context');
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/api/auth/profile', profileData, getAuthConfig());
      toast.success('Author profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('New passwords missmatch!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long');
      return;
    }
    try {
      await API.put(
        '/api/auth/change-password',
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        getAuthConfig()
      );
      toast.success('Password amended successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen bg-surface">
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-50 z-[0]"></div>
      
      <div className="max-w-[1000px] mx-auto relative z-10">
        <div className="mb-16 text-center lg:text-left border-b border-outline-variant/20 pb-8">
          <span className="font-label text-xs tracking-[0.2em] text-primary mb-2 block font-medium uppercase">Author Identity</span>
          <h1 className="text-5xl md:text-6xl font-headline text-on-surface leading-tight tracking-tight">Your Profile</h1>
          <p className="mt-4 text-on-surface-variant font-body max-w-xl leading-relaxed mx-auto lg:mx-0">Manage your public persona, update your contact details, and secure your account credentials within the Savour community.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Profile Information */}
          <div className="lg:col-span-7 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(88,65,60,0.08)] p-8 md:p-12 border border-outline-variant/10 relative">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-3xl text-primary font-light">tune</span>
              <h2 className="font-headline text-3xl text-on-surface italic">Personal Details</h2>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3 text-on-surface-variant">First Name</label>
                  <input
                    type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} required
                    className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3 text-on-surface-variant">Last Name</label>
                  <input
                    type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} required
                    className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3 text-on-surface-variant">Pen Name (Username)</label>
                <div className="flex items-center border-b border-outline/50 bg-surface-container-low/50 py-3 px-4">
                  <span className="material-symbols-outlined text-outline-variant mr-3 select-none text-sm">lock</span>
                  <input
                    type="text" value={profileData.username} disabled
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 font-body text-on-surface-variant cursor-not-allowed italic"
                  />
                </div>
                <p className="text-[10px] text-outline italic mt-2">Your pen name is permanently assigned acting as your signature.</p>
              </div>

              <div>
                <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3 text-on-surface-variant">Email Contact</label>
                <input
                  type="email" name="email" value={profileData.email} onChange={handleProfileChange} required
                  className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-primary text-on-primary flex justify-center items-center gap-2 py-5 px-8 font-label text-sm tracking-[0.15em] font-bold uppercase transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20">
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="lg:col-span-5 bg-surface-container-low p-8 md:p-10 border border-outline-variant/20 relative rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-xl text-on-surface-variant">shield_lock</span>
              <h2 className="font-headline text-2xl text-on-surface">Security Framework</h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-2 text-on-surface-variant">Current Authentication</label>
                <input
                  type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required
                  className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-technical text-sm placeholder:text-surface-variant tracking-wider"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-2 text-on-surface-variant">New Security Passphrase</label>
                <input
                  type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6"
                  className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-technical text-sm placeholder:text-surface-variant tracking-wider"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-2 text-on-surface-variant">Confirm Passphrase</label>
                <input
                  type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6"
                  className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-technical text-sm placeholder:text-surface-variant tracking-wider"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-on-surface text-surface flex justify-center items-center gap-2 py-4 px-6 font-label text-xs tracking-[0.15em] font-bold uppercase transition-all hover:bg-outline active:scale-[0.98]">
                  Update Security
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Profile;
