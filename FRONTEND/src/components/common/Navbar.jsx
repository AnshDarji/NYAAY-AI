import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) =>
    `text-sm font-medium tracking-tight transition-colors duration-200 font-sans ${
      isActive(path)
        ? 'text-[#111111] font-semibold'
        : 'text-[#6B6B6B] hover:text-[#111111]'
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/60 bg-[#F7F7F5]/80 backdrop-blur-md transition-all">
      <div className="max-w-[1280px] mx-auto px-8 flex justify-between items-center h-[72px]">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="text-lg font-bold tracking-tighter text-zinc-900 text-[20px] font-sans flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[24px] text-zinc-800">gavel</span>
            NYAAY AI
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkStyle('/')}>
              Home
            </Link>
            {currentUser && (
              <>
                <Link to="/dashboard" className={navLinkStyle('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/know-your-kanoon" className={navLinkStyle('/know-your-kanoon')}>
                  Kanoon Q&A
                </Link>
                <Link to="/upload-chat" className={navLinkStyle('/upload-chat')}>
                  Doc Chat
                </Link>
                <Link to="/dochub" className={navLinkStyle('/dochub')}>
                  DocHub
                </Link>
                <Link to="/counter-arguments" className={navLinkStyle('/counter-arguments')}>
                  Rebuttals
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User / CTA Section */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs font-semibold text-[#6B6B6B] bg-[#F3F2EF] px-3 py-1.5 rounded-full border border-[#E7E7E4]">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#111111] text-white hover:bg-zinc-800 px-4 py-2 rounded-full font-medium transition-all text-[13px]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#111111] text-white hover:bg-zinc-800 px-4 py-2 rounded-full font-medium transition-all text-[13px]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
