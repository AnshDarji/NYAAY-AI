import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Scale, 
  FileText, 
  ShieldAlert, 
  Gavel, 
  Landmark, 
  Target,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SECTION_ICONS = {
  executive_summary: <Target className="w-5 h-5 text-[#111111]" />,
  chronological_timeline: <FileText className="w-5 h-5 text-[#6B6B6B]" />,
  primary_legal_issues: <Scale className="w-5 h-5 text-red-600" />,
  applicable_statutes: <Landmark className="w-5 h-5 text-blue-700" />,
  judicial_precedents: <Gavel className="w-5 h-5 text-indigo-700" />,
  arguments_for: <ShieldAlert className="w-5 h-5 text-emerald-700" />,
  arguments_against: <ShieldAlert className="w-5 h-5 text-amber-700" />,
  evidence_analysis: <FileText className="w-5 h-5 text-slate-700" />,
  risk_assessment: <AlertCircle className="w-5 h-5 text-yellow-700" />,
  litigation_strategy: <Target className="w-5 h-5 text-indigo-700" />,
  confidence_summary: <Scale className="w-5 h-5 text-emerald-700" />,
  cross_module_links: <ArrowRight className="w-5 h-5 text-[#111111]" />
};

const SECTION_TITLES = {
  executive_summary: "Executive Summary",
  chronological_timeline: "Chronological Timeline",
  primary_legal_issues: "Primary Legal Issues",
  applicable_statutes: "Applicable Statutes",
  judicial_precedents: "Judicial Precedents",
  arguments_for: "Arguments in Favor",
  arguments_against: "Arguments Against",
  evidence_analysis: "Evidence Analysis",
  risk_assessment: "Risk Assessment",
  litigation_strategy: "Litigation Strategy",
  confidence_summary: "Confidence Summary",
  cross_module_links: "Next Steps (NYAAY Modules)"
};

const renderNestedContent = (content) => {
  if (content === null || content === undefined) return null;
  
  if (typeof content === 'string') {
    return (
      <div className="prose max-w-none text-[13px] text-[#6B6B6B] leading-[1.6] prose-p:my-2 prose-headings:font-semibold prose-headings:text-[#111111] prose-headings:mb-2 prose-a:text-[#111111] hover:prose-a:text-zinc-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  if (Array.isArray(content)) {
    // If array of pure strings, render as bullet list
    if (content.every(item => typeof item === 'string')) {
      return (
        <ul className="list-disc pl-4 space-y-1 text-[13px] text-[#6B6B6B] leading-[1.6]">
          {content.map((item, idx) => (
            <li key={idx}><ReactMarkdown>{item}</ReactMarkdown></li>
          ))}
        </ul>
      );
    }
    
    // Array of objects (e.g. statutes, cases, arguments) -> render each as a card
    return (
      <div className="space-y-3">
        {content.map((item, idx) => (
          <div key={idx} className="bg-white/60 rounded-xl p-4 border border-[#E7E7E4]/60 shadow-sm backdrop-blur-sm">
            {Object.entries(item).map(([key, val]) => (
              <div key={key} className="mb-3 last:mb-0">
                <h5 className="text-[11px] font-bold text-[#111111] uppercase tracking-widest mb-1 block">
                  {key.replace(/_/g, ' ')}
                </h5>
                <div className="text-[#6B6B6B] text-[13px] leading-[1.6]">
                  {typeof val === 'string' ? <ReactMarkdown>{val}</ReactMarkdown> : renderNestedContent(val)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === 'object') {
    // Object (e.g. risk assessment, evidence, strategy) -> render as inline sections
    return (
      <div className="space-y-3">
        {Object.entries(content).map(([key, val]) => (
          <div key={key} className="bg-white/60 rounded-xl p-3 border border-[#E7E7E4]/60 backdrop-blur-sm">
            <h5 className="text-[11px] font-bold text-[#111111] uppercase tracking-widest mb-1.5 block">
              {key.replace(/_/g, ' ')}
            </h5>
            <div className="text-[#6B6B6B] text-[13px] leading-[1.6]">
               {typeof val === 'string' ? <ReactMarkdown>{val}</ReactMarkdown> : renderNestedContent(val)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const AnalysisCard = ({ title, icon, content, isCrossModule = false, className = "", defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!content) return null;

  const contentRenderer = () => {
    if (!isOpen) return null;

    if (isCrossModule) {
      return (
        <div className="space-y-6 mt-4">
          <p className="text-[#6B6B6B] text-sm">{content}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/know-your-kanoon" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors border border-[#111111]">
              <Scale className="w-4 h-4" />
              Open Kanoon Q&A
            </Link>
            <Link to="/dochub" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F3F2EF] text-[#111111] rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors border border-[#E7E7E4]">
              <FileText className="w-4 h-4" />
              Draft Legal Notice
            </Link>
            <Link to="/upload-chat" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F3F2EF] text-[#111111] rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors border border-[#E7E7E4]">
              <MessageSquare className="w-4 h-4" />
              Chat with Documents
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        {renderNestedContent(content)}
      </div>
    );
  };

  const defaultBg = className.includes('bg-') ? '' : 'bg-[#FCFCFB]';
  const defaultBorder = className.includes('border-') && !className.match(/border-[xytrbl]-/) ? '' : 'border-[#E7E7E4]';

  return (
    <div className={`${defaultBg} rounded-[1.25rem] px-5 py-3.5 border ${defaultBorder} flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300 w-full ${className}`}>
      <div 
        className={`flex items-center justify-between z-10 cursor-pointer ${isOpen ? 'mb-3 pb-2 border-b border-[#E7E7E4]/50' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/80 rounded-lg border border-[#E7E7E4] shadow-sm backdrop-blur-sm">
            {icon ? React.cloneElement(icon, { className: 'w-4 h-4 text-[#111111]' }) : <FileText className="w-4 h-4 text-[#111111]" />}
          </div>
          <h4 className="font-bold text-[14px] text-[#111111] tracking-tight select-none">{title}</h4>
        </div>
        <div className="p-1 text-[#6B6B6B] hover:text-[#111111] transition-colors rounded-full hover:bg-black/5">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      <div className={`z-10 flex-1 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {contentRenderer()}
      </div>
    </div>
  );
};

const LegalAnalysisRenderer = ({ content }) => {
  const parsedData = useMemo(() => {
    try {
      const data = JSON.parse(content);
      if (typeof data === 'object' && data !== null) {
        return data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [content]);

  if (!parsedData) {
    return (
      <div className="prose prose-sm max-w-none bg-[#FCFCFB] p-8 rounded-3xl border border-[#E7E7E4]">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Top Row: Executive Summary (Full Width, Open by default) */}
      {parsedData.executive_summary && (
        <AnalysisCard 
          title={SECTION_TITLES.executive_summary}
          icon={SECTION_ICONS.executive_summary}
          content={parsedData.executive_summary}
          defaultOpen={true}
        />
      )}

      {/* Primary Legal Issues (Full Width, Open by default) */}
      {parsedData.primary_legal_issues && (
        <AnalysisCard 
          title={SECTION_TITLES.primary_legal_issues}
          icon={SECTION_ICONS.primary_legal_issues}
          content={parsedData.primary_legal_issues}
          defaultOpen={true}
        />
      )}

      {/* Render all other sections vertically (Collapsed by default) */}
      {Object.keys(SECTION_TITLES).map(key => {
        if (key === 'executive_summary' || key === 'primary_legal_issues' || key === 'cross_module_links') return null;
        if (!parsedData[key]) return null;
        
        // Give all accordion panels a uniform light greyish color
        let accentClass = "bg-[#F8F8F7] border-[#E7E7E4]";

        return (
          <AnalysisCard 
            key={key}
            title={SECTION_TITLES[key]}
            icon={SECTION_ICONS[key] || <FileText className="w-5 h-5 text-[#6B6B6B]" />}
            content={parsedData[key]}
            className={accentClass}
            defaultOpen={false}
          />
        );
      })}

      {/* Catch-all for extra keys */}
      {Object.keys(parsedData).map(key => {
        if (SECTION_TITLES[key]) return null;
        return (
          <AnalysisCard 
            key={key}
            title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            content={parsedData[key]}
            defaultOpen={false}
          />
        );
      })}

      {/* Bottom Row: Next Steps (Full Width, Open by default) */}
      {parsedData.cross_module_links && (
        <AnalysisCard 
          title={SECTION_TITLES.cross_module_links}
          icon={SECTION_ICONS.cross_module_links}
          content={parsedData.cross_module_links}
          isCrossModule={true}
          defaultOpen={true}
        />
      )}
    </div>
  );
};

export default LegalAnalysisRenderer;
