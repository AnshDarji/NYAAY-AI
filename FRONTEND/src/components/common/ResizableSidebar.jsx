import React, { useState, useEffect, useRef } from 'react';

const ResizableSidebar = ({ children, minWidth = 200, maxWidth = 600, defaultWidth = 288, className = "" }) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleWindowResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || isMobile) return;
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    if (isResizing && !isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMobile, minWidth, maxWidth]);

  return (
    <div 
      ref={sidebarRef}
      style={isMobile ? { width: '100%' } : { width: `${width}px` }} 
      className={`shrink-0 flex flex-col relative transition-none ${className}`}
    >
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        {children}
      </div>
      
      {/* Drag handle (resizer) - Hidden on mobile */}
      {!isMobile && (
        <div 
          className="absolute -right-3 top-0 bottom-0 w-6 cursor-col-resize flex justify-center z-40 group"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className={`w-1 h-full rounded-full transition-colors duration-200 ${isResizing ? 'bg-[#111111]' : 'bg-[#E7E7E4] group-hover:bg-[#111111]/30'}`} />
        </div>
      )}
    </div>
  );
};

export default ResizableSidebar;
