import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, ChevronRight } from 'lucide-react';

const UploadChatRenderer = ({ content }) => {
  let parsed = null;
  try {
    parsed = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (e) {
    return (
      <div className="prose prose-slate max-w-none text-slate-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  if (!parsed || !parsed.answer) return null;

  return (
    <div className="space-y-4">
      {/* Answer */}
      <div>
        <div className="prose prose-sm md:prose-base prose-slate max-w-none text-slate-700">
          <ReactMarkdown>{parsed.answer}</ReactMarkdown>
        </div>
      </div>
      
      {/* Summary Reference */}
      {parsed.summary && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3">
            <FileText className="text-primary-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h5 className="text-sm font-semibold text-slate-800 mb-1">Context Reference</h5>
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed">
                <ReactMarkdown>{parsed.summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadChatRenderer;
