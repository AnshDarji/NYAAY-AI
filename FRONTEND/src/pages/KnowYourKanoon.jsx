import React from 'react';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

export default function KnowYourKanoon() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto mt-4">
        {/* Breadcrumb */}
        <Link to="/dashboard" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Dashboard
        </Link>

        {/* Header */}
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
            Sprint 2 Feature Lock
          </span>
          <h1 className="text-3xl font-semibold tracking-tighter mt-4">Know Your Kanoon</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Indian statutes and case law conversational grounding assistant.
          </p>
        </div>

        {/* Lock Card */}
        <Card className="p-10 flex flex-col items-center text-center gap-6 justify-center bg-[#FCFCFB] h-[360px]" hoverEffect={false}>
          <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-[#111111]">lock</span>
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <h3 className="text-lg font-bold tracking-tight">Feature Locked for Sprint 2</h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              The conversational legal Q&A model and retrieval-augmented generation (RAG) backend integrations will be enabled in Sprint 2.
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="px-6 py-2.5 text-xs">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
}
