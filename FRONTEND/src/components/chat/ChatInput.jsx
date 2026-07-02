import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ value, onChange, onSubmit, isLoading, placeholder = "Message NYAAY AI..." }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <div className="relative flex items-end shadow-sm border border-border bg-surface rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full max-h-[200px] py-4 pl-4 pr-12 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none resize-none scrollbar-thin scrollbar-thumb-border"
        />
        <div className="absolute right-2 bottom-2">
          <button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              value.trim() && !isLoading 
                ? 'bg-primary text-white hover:bg-primary-hover shadow-md' 
                : 'bg-secondary text-text-secondary cursor-not-allowed border border-border'
            }`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-[11px] text-text-secondary">
          NYAAY AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
