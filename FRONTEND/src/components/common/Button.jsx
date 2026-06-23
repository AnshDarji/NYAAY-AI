import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) {
  const baseStyle = 'px-6 py-3 rounded-full font-medium tracking-tight text-sm transition-all focus:outline-none flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#111111] text-white hover:bg-zinc-800',
    outline: 'bg-transparent border border-zinc-300 text-[#111111] hover:bg-zinc-100 hover:border-zinc-400',
    secondary: 'bg-[#F3F2EF] text-[#111111] hover:bg-zinc-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
