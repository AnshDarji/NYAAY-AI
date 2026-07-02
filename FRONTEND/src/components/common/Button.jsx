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
  const baseStyle = 'px-5 py-2.5 rounded-button font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    outline: 'bg-transparent border border-border text-text-primary hover:bg-secondary hover:border-border-hover',
    secondary: 'bg-secondary text-text-primary hover:bg-secondary-hover',
    danger: 'bg-error text-white hover:bg-red-600 shadow-sm',
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
