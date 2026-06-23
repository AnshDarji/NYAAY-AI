import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageContainer({ children, className = '' }) {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] flex flex-col font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main className={`flex-grow pt-[140px] pb-20 max-w-[1280px] w-full mx-auto px-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
