import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function RoleSelection() {
  const { currentUser, userProfile, syncProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  // Safeguard: Redirect to /login if no authenticated user is present
  if (!loading && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Safeguard: Redirect to /dashboard if profile is already configured with a role
  if (!loading && userProfile && userProfile.role) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleConfirm = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }

    setSyncing(true);
    setError('');
    try {
      // call syncProfile from context (uses POST /api/auth/sync)
      await syncProfile(selectedRole);
      // Success -> navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to sync user role:', err);
      setError('Database synchronization failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      icon: 'person',
      description: 'Navigate daily legal disputes, rental issues, consumer complaints, and translate complex legal clauses into plain language.',
      color: 'from-emerald-500/10 to-teal-500/10',
    },
    {
      id: 'student',
      name: 'Law Student',
      icon: 'school',
      description: 'Conduct academic case studies, explore constitutional clauses, read landmark Supreme Court judgments, and synthesize legal briefs.',
      color: 'from-blue-500/10 to-indigo-500/10',
    },
    {
      id: 'lawyer',
      name: 'Legal Professional',
      icon: 'work',
      description: 'Optimize courtroom drafting, extract contractual risk points, construct counter-arguments, and research precedents.',
      color: 'from-amber-500/10 to-orange-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-[#6B6B6B]">Loading secure credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-[#111111] antialiased">
      <div className="max-w-4xl w-full flex flex-col gap-10">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
            Account Provisioning
          </span>
          <h1 className="text-3xl font-semibold tracking-tighter mt-2">Choose Your Legal Canvas</h1>
          <p className="text-sm text-[#6B6B6B] max-w-md">
            Select a role below to configure your workspaces, templates, and models. This setting can be adjusted later in your Profile.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <Card
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`cursor-pointer h-[320px] justify-between p-8 text-left transition-all duration-300 relative border ${
                  isSelected 
                    ? 'border-[#111111] ring-1 ring-[#111111] bg-white scale-[1.02]' 
                    : 'border-[#E7E7E4] bg-[#FCFCFB] hover:border-zinc-300'
                }`}
                hoverEffect={!isSelected}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-40`}></div>
                
                {/* Icon & Checked Indicator */}
                <div className="flex justify-between items-start z-10">
                  <span className="material-symbols-outlined text-[32px] text-[#111111]">
                    {role.icon}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-emerald-600 font-bold text-2xl">
                      check_circle
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="z-10 mt-auto">
                  <h3 className="text-lg font-bold tracking-tight text-[#111111] mb-2">
                    {role.name}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-md mx-auto w-full bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleConfirm}
            loading={syncing}
            disabled={!selectedRole}
            className="px-10 py-3.5 text-sm"
          >
            Confirm &amp; Sync Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
