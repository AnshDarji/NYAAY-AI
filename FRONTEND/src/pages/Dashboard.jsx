import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();

  // Helper to format role name for display
  const getRoleDisplayName = (role) => {
    if (!role) return '';
    if (role === 'citizen') return 'Citizen';
    if (role === 'student') return 'Law Student';
    if (role === 'lawyer') return 'Legal Professional';
    return role;
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'lawyer') return 'bg-amber-500/10 text-amber-800 border-amber-500/20';
    if (role === 'student') return 'bg-blue-500/10 text-blue-800 border-blue-500/20';
    return 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20';
  };

  const features = [
    {
      title: 'Know Your Kanoon',
      description: 'Interact with Indian statutes, codes, and precedents using our grounded Q&A intelligence agent.',
      icon: 'gavel',
      path: '/know-your-kanoon',
      gradient: 'from-emerald-500/5 to-teal-500/5',
    },
    {
      title: 'Upload & Chat',
      description: 'Upload legal case documents or contracts to synthesize key clauses and identify liabilities.',
      icon: 'upload_file',
      path: '/upload-chat',
      gradient: 'from-blue-500/5 to-indigo-500/5',
    },
    {
      title: 'DocHub Templates',
      description: 'Generate legally structured notices, affidavits, and rental contracts using interactive forms.',
      icon: 'edit_document',
      path: '/dochub',
      gradient: 'from-indigo-500/5 to-purple-500/5',
    },
    {
      title: 'Counter Arguments',
      description: 'Generate strategic rebuttals and counterpoints against opposing case claims.',
      icon: 'balance',
      path: '/counter-arguments',
      gradient: 'from-amber-500/5 to-orange-500/5',
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-10 text-left">
        {/* Welcome Banner */}
        <section className="bg-[#F3F2EF] rounded-3xl p-8 md:p-10 border border-[#E7E7E4] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-emerald-300 to-teal-200 blur-3xl absolute -left-10"></div>
          </div>
          
          <div className="z-10 flex flex-col gap-2">
            <span className={`self-start px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getRoleBadgeColor(userProfile?.role)}`}>
              {getRoleDisplayName(userProfile?.role)}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#111111] mt-2">
              Welcome back, {userProfile?.name || currentUser?.displayName || 'User'}
            </h1>
            <p className="text-sm text-[#6B6B6B] max-w-md">
              Access your workspace below. Your grounded legal model version v2.0 is verified and online.
            </p>
          </div>

          <div className="z-10 flex gap-3">
            <Link to="/know-your-kanoon">
              <Button variant="primary" className="py-2.5 px-5 text-xs">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Start Chat
              </Button>
            </Link>
          </div>
        </section>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main workspace (Features Cards) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-[0.2em]">
              Your Legal Workspaces
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <Link to={feature.path} key={idx}>
                  <Card className="h-[240px] justify-between p-6 hover:scale-[1.01] bg-[#FCFCFB]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`}></div>
                    <div className="flex justify-between items-start z-10">
                      <span className="material-symbols-outlined text-[28px] text-[#111111]">
                        {feature.icon}
                      </span>
                      <span className="material-symbols-outlined text-[#6B6B6B] text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                    <div className="z-10 text-left">
                      <h4 className="text-base font-bold tracking-tight text-[#111111] mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Account details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-[0.2em]">
              Account Profile
            </h2>
            <Card className="p-6 justify-start text-left gap-4 bg-[#FCFCFB]" hoverEffect={false}>
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200">
                  <span className="material-symbols-outlined text-[#111111]">person</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-[#111111]">
                    {userProfile?.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B6B6B]">
                    {currentUser?.uid}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Email</span>
                  <span className="text-xs font-medium text-[#111111] truncate">{userProfile?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Role Setting</span>
                  <span className="text-xs font-medium text-[#111111]">{getRoleDisplayName(userProfile?.role)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Joined</span>
                  <span className="text-xs font-medium text-[#111111]">{formatDate(userProfile?.created_at)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">Last Sync</span>
                  <span className="text-xs font-medium text-[#111111]">{formatDate(userProfile?.last_login)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
