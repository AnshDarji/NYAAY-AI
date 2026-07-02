import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const CollapsiblePrompt = ({ text, maxLength = 350 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{text}</p>;
  }

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap w-full">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-xs font-medium text-white/80 hover:text-white bg-surface/10 hover:bg-surface/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all self-end"
      >
        {isExpanded ? (
          <><span>Show less</span><ChevronRight className="w-3.5 h-3.5 -rotate-90" /></>
        ) : (
          <><span>Show more</span><ChevronRight className="w-3.5 h-3.5 rotate-90" /></>
        )}
      </button>
    </div>
  );
};

export default CollapsiblePrompt;
