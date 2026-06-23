import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-[#F7F7F5] mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <span className="text-lg font-bold tracking-tighter text-zinc-900 text-[20px] font-sans flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-zinc-800">gavel</span>
            NYAAY AI
          </span>
          <span className="text-xs text-[#6B6B6B] font-sans">
            © {currentYear} NYAAY AI. Engineered for precision in Indian Law.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors font-sans">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors font-sans">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors font-sans">
            GitHub
          </a>
          <a href="#" className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors font-sans">
            Disclaimer
          </a>
        </div>
      </div>
    </footer>
  );
}
