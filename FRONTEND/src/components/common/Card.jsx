import React from 'react';

export default function Card({ children, className = '', hoverEffect = true, ...props }) {
  return (
    <div
      className={`bg-surface rounded-card border border-border p-6 relative flex flex-col justify-between shadow-card ${
        hoverEffect ? 'group hover:shadow-dropdown hover:border-border-hover transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
