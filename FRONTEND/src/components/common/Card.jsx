import React from 'react';

export default function Card({ children, className = '', hoverEffect = true, ...props }) {
  return (
    <div
      className={`bg-[#FCFCFB] rounded-2xl border border-[#E7E7E4] p-6 relative overflow-hidden flex flex-col justify-between ${
        hoverEffect ? 'group hover:shadow-sm hover:border-zinc-300 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
