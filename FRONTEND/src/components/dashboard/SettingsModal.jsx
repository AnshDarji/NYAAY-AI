import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

export default function SettingsModal({ isOpen, onClose }) {
  const { userProfile, currentUser, changePassword, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState({ name: '', role: 'citizen' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProfileForm({ 
        name: userProfile?.name || currentUser?.displayName || '',
        role: userProfile?.role || 'citizen'
      });
      setProfileSuccess('');
      setProfileError('');
      setPasswordSuccess('');
      setPasswordError('');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    }
  }, [isOpen, userProfile, currentUser]);

  if (!isOpen) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    if (!profileForm.name.trim()) {
      return setProfileError('Name cannot be empty.');
    }

    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(profileForm.name.trim(), profileForm.role);
      setProfileSuccess('Profile updated successfully!');
    } catch (error) {
      setProfileError(error.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError('Passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordError('Password must be at least 6 characters');
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordForm.newPassword);
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password. You may need to sign in again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-surface rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#F9F9F8] border-b md:border-b-0 md:border-r border-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold tracking-tight text-primary">Settings</h2>
            <button onClick={onClose} className="md:hidden text-text-secondary hover:text-primary">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:bg-secondary hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${activeTab === tab.id ? 'text-white' : 'text-text-secondary'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border text-text-secondary hover:bg-[#F9F9F8] hover:text-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-semibold tracking-tight text-primary mb-6">Profile Details</h3>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl uppercase shadow-inner">
                    {userProfile?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary">{userProfile?.name || currentUser?.displayName || 'User'}</div>
                    <div className="text-xs text-text-secondary">{currentUser?.email}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={profileForm.name} 
                    onChange={(e) => setProfileForm({ name: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    disabled 
                    value={currentUser?.email || ''} 
                    className="w-full bg-[#F9F9F8] border border-border rounded-xl px-4 py-2.5 text-sm text-primary cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Account Role</label>
                  <select 
                    value={profileForm.role}
                    onChange={(e) => setProfileForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow appearance-none cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="student">Law Student</option>
                    <option value="lawyer">Legal Professional</option>
                  </select>
                </div>

                {profileError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {profileSuccess}
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={
                      isUpdatingProfile || 
                      (profileForm.name === (userProfile?.name || currentUser?.displayName) && 
                       profileForm.role === (userProfile?.role || 'citizen'))
                    }
                    className="w-full md:w-auto"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-semibold tracking-tight text-primary mb-6">Change Password</h3>
              
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {passwordSuccess}
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isChangingPassword}
                    className="w-full md:w-auto"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-semibold tracking-tight text-primary mb-6">Appearance</h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <button className="flex flex-col gap-3 p-4 rounded-2xl border-2 border-primary bg-surface items-center">
                  <div className="w-16 h-12 rounded bg-zinc-100 border border-zinc-200 flex flex-col overflow-hidden shadow-sm">
                     <div className="h-3 bg-zinc-200"></div>
                     <div className="flex-1 flex p-1 gap-1">
                        <div className="w-4 bg-surface rounded-sm"></div>
                        <div className="flex-1 bg-surface rounded-sm"></div>
                     </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">Light Mode</span>
                </button>
                
                <button className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface hover:bg-[#F9F9F8] items-center transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
                  <div className="w-16 h-12 rounded bg-zinc-900 border border-zinc-700 flex flex-col overflow-hidden shadow-sm">
                     <div className="h-3 bg-primary-hover"></div>
                     <div className="flex-1 flex p-1 gap-1">
                        <div className="w-4 bg-primary rounded-sm"></div>
                        <div className="flex-1 bg-primary rounded-sm"></div>
                     </div>
                  </div>
                  <span className="text-sm font-semibold text-text-secondary">Dark Mode</span>
                </button>
              </div>
              <p className="text-xs text-text-secondary mt-4 italic">Dark mode is currently under development for Auralis v2.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
