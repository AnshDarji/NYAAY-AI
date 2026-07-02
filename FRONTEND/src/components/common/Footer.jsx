import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-surface mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <span className="text-lg font-bold tracking-tight text-text-primary text-[20px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-text-primary">gavel</span>
            NYAAY AI
          </span>
          <span className="text-xs text-text-secondary">
            © {currentYear} NYAAY AI. Engineered for precision in Indian Law.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            GitHub
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Disclaimer
          </a>
        </div>
      </div>
    </footer>
  );
}
