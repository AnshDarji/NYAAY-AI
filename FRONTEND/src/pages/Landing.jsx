import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <PageContainer>
      {/* HERO SECTION */}
      <section className="mb-24 mt-16 md:mt-24 max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h1 className="font-sans text-[60px] md:text-[84px] font-semibold tracking-[-0.04em] text-primary leading-[1.05]">
              Indian Law,<br/>translated for everyone.
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link to={currentUser ? "/dashboard" : "/signup"} className="bg-primary text-white hover:bg-primary-hover px-8 py-4 rounded-full text-base font-medium transition-all shadow-sm">
                {currentUser ? "Go to Dashboard" : "Sign up"}
              </Link>
              <a href="#workspace" className="bg-transparent border border-border text-primary hover:bg-secondary px-8 py-4 rounded-full text-base font-medium transition-all">
                See How It Works
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex justify-end">
            <p className="font-sans text-[18px] text-text-secondary leading-[1.6] max-w-sm text-left lg:text-right pt-4 tracking-[-0.01em]">
              Research Indian law, analyze legal disputes, generate advocate-grade legal reasoning, and draft filing-ready legal documents—all through one intelligent workspace built specifically for the Indian legal ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* HERO PRODUCT PANEL (Inspired by Screenshot 1) */}
      <section id="workspace" className="max-w-[1280px] mx-auto mb-[180px] px-4 md:px-8">
        <div className="bg-secondary rounded-[2rem] p-6 md:p-8 flex flex-col relative overflow-hidden border border-border min-h-[600px] justify-between">
          {/* Top Tabs */}
          <div className="flex flex-wrap gap-4 justify-between items-center z-10">
            <div className="flex bg-secondary p-1 rounded-full border border-border shadow-sm">
              <button className="px-4 py-2 bg-surface text-primary rounded-full text-sm font-medium shadow-sm">NYAAY Workspace</button>
              <button className="px-4 py-2 text-text-secondary rounded-full text-sm font-medium hover:text-primary transition-colors hidden sm:block">Know Your Kanoon</button>
              <button className="px-4 py-2 text-text-secondary rounded-full text-sm font-medium hover:text-primary transition-colors hidden sm:block">DocHub</button>
            </div>
            <div className="bg-secondary px-4 py-2 rounded-full border border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-primary">BNS & BNSS Active</span>
            </div>
          </div>

          {/* Center Orbs (Beautiful Gradients) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
            <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-200 to-teal-100 blur-[80px] absolute -ml-40"></div>
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-sky-200 to-indigo-200 blur-[80px] absolute"></div>
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-amber-100 to-orange-100 blur-[80px] absolute ml-40 mt-20"></div>
          </div>

          {/* Glassmorphic App Mockup floating over the gradient */}
          <div className="z-10 self-center my-auto w-full max-w-5xl flex flex-col md:flex-row gap-6 items-center justify-center mt-12 mb-12">
              {/* Chat Interface */}
              <div className="bg-surface/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl w-full md:w-1/2 flex flex-col gap-4 relative">
                 <div className="absolute -top-4 -left-4 bg-surface px-4 py-2 rounded-full shadow-sm border border-border text-xs font-semibold text-primary">
                    Legal Reasoning Agent
                 </div>
                 <div className="self-end bg-surface text-primary text-sm p-4 rounded-2xl rounded-tr-sm max-w-[85%] border border-border mt-4 shadow-sm font-medium">
                    The tenant hasn't paid rent for 3 months in Delhi. What are my legal options?
                 </div>
                 <div className="self-start bg-primary border border-primary-hover text-white text-sm p-4 rounded-2xl rounded-tl-sm w-[90%] shadow-lg mt-2">
                    <div className="font-semibold mb-3 text-emerald-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">balance</span> Analyzing Precedents
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-2 w-full bg-primary-hover rounded-full"></div>
                      <div className="h-2 w-full bg-primary-hover rounded-full"></div>
                      <div className="h-2 w-4/5 bg-primary-hover rounded-full"></div>
                    </div>
                 </div>
              </div>

              {/* Document/AST Interface */}
              <div className="bg-surface/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl w-full md:w-1/2 flex flex-col gap-4 h-full relative mt-8 md:mt-0">
                  <div className="absolute -top-4 -right-4 bg-surface px-4 py-2 rounded-full shadow-sm border border-border text-xs font-semibold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span> Grounded Output
                 </div>
                 <div className="bg-surface border border-border rounded-xl p-4 mt-4 relative overflow-hidden shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                    <span className="text-[10px] font-bold text-text-secondary mb-1 block tracking-wider uppercase">Statutory Basis</span>
                    <div className="text-sm font-semibold text-primary mb-2">Delhi Rent Control Act, 1958</div>
                    <div className="text-xs text-text-secondary leading-relaxed">Section 14(1)(a) provides for eviction on the ground of non-payment of rent.</div>
                 </div>
                 <div className="bg-surface border border-border rounded-xl p-4 relative overflow-hidden shadow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                    <span className="text-[10px] font-bold text-text-secondary mb-1 block tracking-wider uppercase">Required Action</span>
                    <div className="text-sm font-semibold text-primary mb-3">Draft Eviction Notice</div>
                    <button className="bg-primary text-white text-xs px-4 py-3 rounded-lg font-medium w-full flex justify-between items-center hover:bg-primary-hover transition-colors">
                       Generate Legal Notice <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                 </div>
              </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex justify-between items-center z-10 bg-surface/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex gap-6 overflow-x-auto no-scrollbar items-center">
              <span className="text-sm font-semibold text-primary whitespace-nowrap hidden md:block">End-to-End Pipeline</span>
              <span className="text-sm font-medium text-text-secondary flex items-center gap-1 whitespace-nowrap">Issue <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
              <span className="text-sm font-medium text-text-secondary flex items-center gap-1 whitespace-nowrap">Facts <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
              <span className="text-sm font-medium text-text-secondary flex items-center gap-1 whitespace-nowrap">Research <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
              <span className="text-sm font-medium text-text-secondary flex items-center gap-1 whitespace-nowrap">Reasoning <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
              <span className="text-sm font-medium text-primary whitespace-nowrap">Drafting</span>
            </div>
            <Link to={currentUser ? "/dashboard" : "/signup"} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ml-4">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION (Inspired by Screenshot 3 "Endless Applications") */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 mb-[180px]">
        {/* Section Header with Pill & Line */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-sans text-[12px] font-semibold tracking-[0.1em] uppercase bg-secondary text-primary px-4 py-1.5 rounded-full border border-border">
            NYAAY Suite
          </span>
          <div className="h-px bg-border flex-grow"></div>
        </div>
        
        {/* Title & Desc Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 items-end">
          <div className="lg:col-span-6">
            <h2 className="font-sans text-[40px] md:text-[48px] font-semibold text-primary leading-[1.1] tracking-[-0.03em]">
              Modular Legal Intelligence
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-sans text-[18px] text-text-secondary leading-[1.6]">
              Four core systems working in harmony. From quick statutory lookup to comprehensive drafting and argumentative strategy, NYAAY AI provides precision-engineered tools for every stakeholder.
            </p>
          </div>
        </div>

        {/* Large Feature Cards (Inspired by the Soft Editor UI cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1 */}
          <div className="bg-surface rounded-3xl p-8 border border-border min-h-[360px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-500 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary">gavel</span>
              </div>
            </div>
            <div className="z-10">
              <h4 className="font-sans text-[24px] font-semibold tracking-tight text-primary mb-2">Know Your Kanoon</h4>
              <p className="text-base text-text-secondary leading-relaxed max-w-sm">
                Interact with Indian statutes, constitutional clauses, and landmark judgments via an intuitive grounded Q&A agent.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface rounded-3xl p-8 border border-border min-h-[360px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-500 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-blue-400/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-sm">
                 <span className="material-symbols-outlined text-primary">edit_document</span>
              </div>
            </div>
            <div className="z-10">
              <h4 className="font-sans text-[24px] font-semibold tracking-tight text-primary mb-2">DocHub Drafting</h4>
              <p className="text-base text-text-secondary leading-relaxed max-w-sm">
                Draft legally binding documents including Rental Agreements, Legal Notices, and Affidavits using interactive template wizards.
              </p>
            </div>
          </div>
          {/* Card 3 - Upload & Chat */}
          <div className="bg-surface rounded-3xl p-8 border border-border min-h-[360px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-500 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary">upload_file</span>
              </div>
            </div>
            <div className="z-10">
              <h4 className="font-sans text-[24px] font-semibold tracking-tight text-primary mb-2">Upload & Chat</h4>
              <p className="text-base text-text-secondary leading-relaxed max-w-sm">
                Analyze contracts and extract clauses.
              </p>
            </div>
          </div>

          {/* Card 4 - Counter Arguments */}
          <div className="bg-surface rounded-3xl p-8 border border-border min-h-[360px] flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-500 cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-red-400/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start z-10">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary">balance</span>
              </div>
            </div>
            <div className="z-10">
              <h4 className="font-sans text-[24px] font-semibold tracking-tight text-primary mb-2">Counter Arguments</h4>
              <p className="text-base text-text-secondary leading-relaxed max-w-sm">
                Stress-test claims and generate rebuttals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUTPUT SHOWCASE & AUDIENCES (Inspired by Screenshot 4 "Enterprise-grade") */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 mb-[180px]">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-sans text-[12px] font-semibold tracking-[0.1em] uppercase bg-secondary text-primary px-4 py-1.5 rounded-full border border-border">
            Trust & Scale
          </span>
          <div className="h-px bg-border flex-grow"></div>
        </div>

        <div className="flex flex-col gap-6 mb-12 max-w-4xl">
          <h2 className="font-sans text-[40px] md:text-[48px] font-semibold text-primary leading-[1.1] tracking-[-0.03em]">
            Complex legal frameworks, simplified<br className="hidden md:block" /> at your fingertips.
          </h2>
          <p className="font-sans text-[18px] text-text-secondary leading-[1.6]">
            Our custom-built RAG architecture decodes the entire Indian justice system, translating
            millions of statutes and precedents into actionable intelligence for everybody.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Showcase Card 1 (Harvey Specter) */}
          <div className="bg-surface rounded-[2rem] p-8 border border-border min-h-[450px] flex flex-col relative overflow-hidden group shadow-sm justify-between">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
              <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-100 to-teal-50 blur-[80px] absolute"></div>
            </div>
            
            <div className="z-10 bg-surface/80 backdrop-blur-md self-start px-4 py-2 rounded-full border border-border text-xs font-semibold mb-8 shadow-sm">
              Harvey Specter-Level Precision
            </div>
            
            <div className="z-10 bg-surface border border-border rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto flex flex-col gap-6 group-hover:-translate-y-2 transition-transform duration-500">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                     HS
                   </div>
                   <div>
                     <h4 className="font-bold text-primary text-[15px]">Closing Argument Strategy</h4>
                     <p className="text-[10px] text-text-secondary font-bold tracking-[0.05em] uppercase mt-0.5">Corporate Litigation</p>
                   </div>
                 </div>
                 <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-[10px] px-3 py-1.5 rounded-full tracking-wide">
                   98% WIN PROBABILITY
                 </div>
               </div>
               
               <div className="border-l-4 border-amber-400 pl-4 py-1">
                 <h5 className="text-[10px] font-bold text-primary tracking-wider uppercase mb-2">The Play</h5>
                 <p className="text-[14px] text-text-secondary italic leading-[1.6]">
                   "Don't play the odds, play the man. We hit them with Section 14(1)(a) before they even file a defense."
                 </p>
                 
                 <div className="mt-5 flex gap-1.5 items-center">
                    <div className="h-2 w-[85%] bg-emerald-400 rounded-full"></div>
                    <div className="h-2 w-[15%] bg-zinc-100 rounded-full"></div>
                 </div>
               </div>
               
               <button className="w-full bg-[#111] hover:bg-black text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md">
                 Draft Aggressive Rebuttal <span className="material-symbols-outlined text-[16px]">draw</span>
               </button>
            </div>
          </div>

          {/* Showcase Card 2 (End-to-End Pipeline) */}
          <div className="bg-surface rounded-[2rem] p-8 border border-border min-h-[450px] flex flex-col relative overflow-hidden group shadow-sm justify-between">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
               <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 blur-[80px] absolute"></div>
            </div>
            
            <div className="z-10 bg-surface/80 backdrop-blur-md self-start px-4 py-2 rounded-full border border-border text-xs font-semibold mb-8 shadow-sm">
              End-to-End Pipeline
            </div>

            <div className="z-10 relative flex flex-col gap-3 w-full max-w-md mx-auto group-hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute left-[35px] top-8 bottom-8 w-[2px] bg-zinc-100 z-0"></div>

               <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm relative z-10 transition-colors hover:bg-secondary">
                 <div className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                   <span className="material-symbols-outlined text-[18px]">account_circle</span>
                 </div>
                 <div>
                   <h5 className="font-bold text-[14px] text-primary">1. Natural Language Query</h5>
                   <p className="text-[13px] text-text-secondary mt-0.5">User inputs complex legal scenario.</p>
                 </div>
               </div>
               
               <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm relative z-10 transition-colors hover:bg-secondary">
                 <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100 shadow-sm">
                   <span className="material-symbols-outlined text-[18px]">database</span>
                 </div>
                 <div>
                   <h5 className="font-bold text-[14px] text-primary">2. Semantic Retrieval</h5>
                   <p className="text-[13px] text-text-secondary mt-0.5">Fetching from the entire Indian legal framework.</p>
                 </div>
               </div>
               
               <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm relative z-10 transition-colors hover:bg-secondary">
                 <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100 shadow-sm">
                   <span className="material-symbols-outlined text-[18px]">account_tree</span>
                 </div>
                 <div>
                   <h5 className="font-bold text-[14px] text-primary">3. Contextual Reasoning</h5>
                   <p className="text-[13px] text-text-secondary mt-0.5">Filtering and structuring precedents via legal logic.</p>
                 </div>
               </div>
               
               <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex items-center gap-4 shadow-lg relative z-10">
                 <div className="w-10 h-10 rounded-full bg-[#222] text-emerald-400 flex items-center justify-center flex-shrink-0 border border-[#333]">
                   <span className="material-symbols-outlined text-[18px]">auto_awesome</span> 
                 </div>
                 <div>
                   <h5 className="font-bold text-[14px] text-white">4. Grounded Synthesis</h5>
                   <p className="text-[13px] text-zinc-400 mt-0.5">Generating advocate-grade, hallucination-free analysis.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mb-32 text-center flex flex-col items-center px-4">
        <h2 className="font-sans text-[48px] md:text-[64px] font-semibold tracking-[-0.03em] text-primary mb-8">
          Ready to simplify legal work?
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Link to={currentUser ? "/dashboard" : "/signup"} className="bg-primary text-white hover:bg-primary-hover px-8 py-4 rounded-full text-lg font-medium transition-all shadow-md hover:shadow-lg">
            Create Free Account
          </Link>
          <span className="text-text-secondary text-base mt-2">Join the next generation of Indian law.</span>
        </div>
      </section>
    </PageContainer>
  );
}