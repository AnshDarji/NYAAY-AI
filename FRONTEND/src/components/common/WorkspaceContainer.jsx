import React from 'react';
import Navbar from './Navbar';

export default function WorkspaceContainer({ children, className = '' }) {
  return (
    <div className={`h-screen w-screen overflow-hidden bg-background text-primary flex flex-col font-sans antialiased ${className}`}>
      <Navbar fullWidth={true} />
      {/* 
        h-[72px] is the height of the Navbar.
        We subtract it from the total height.
      */}
      <main className="flex-1 w-full flex overflow-hidden pt-[72px]">
        {children}
      </main>
    </div>
  );
}
