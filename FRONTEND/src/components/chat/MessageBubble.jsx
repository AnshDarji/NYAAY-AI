import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';

const MessageBubble = ({ message, renderContent }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full py-6 px-4 md:px-8 ${isUser ? 'justify-end' : 'justify-start bg-surface border-y border-border'}`}>
      <div className={`flex gap-4 max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row w-full mx-auto'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-text-secondary border border-border">
              <User size={16} />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
              <Sparkles size={16} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="font-semibold text-sm mb-2 text-text-primary">
            {isUser ? 'You' : 'NYAAY AI'}
          </div>
          <div className={`text-[15px] leading-relaxed ${isUser ? 'bg-secondary text-text-primary px-5 py-3 rounded-3xl rounded-tr-sm inline-block max-w-[90%]' : 'text-text-primary w-full'}`}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              // Use the provided renderContent prop if available, otherwise just render markdown
              renderContent ? renderContent(message.content) : (
                <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
