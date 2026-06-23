import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <PageContainer>
      {/* HERO SECTION */}
      <section className="mb-[140px] mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h1 className="font-sans text-5xl md:text-7xl font-semibold tracking-tighter text-[#111111] leading-[1.1] max-w-2xl">
              Indian Law, translated for everyone.
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link to={currentUser ? "/dashboard" : "/signup"}>
                <Button variant="primary" className="px-8 py-4 text-base">
                  {currentUser ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="px-8 py-4 text-base">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex justify-end">
            <p className="font-sans text-lg text-[#6B6B6B] leading-relaxed max-w-sm text-left lg:text-right pt-4">
              NYAAY AI is a premium AI-powered legal assistant tailored for the Indian judiciary ecosystem. It empowers citizens, students, and legal professionals to navigate law with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* HERO PRODUCT PANEL WITH GLASSMORPHIC WIDGET */}
      <section className="mb-[180px]">
        <div className="bg-[#F3F2EF] rounded-3xl p-8 flex flex-col relative overflow-hidden border border-[#E7E7E4] min-h-[600px] justify-between">
          {/* Top Tabs */}
          <div className="flex justify-between items-center z-10">
            <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-full border border-[#E7E7E4] shadow-sm">
              <button className="px-4 py-2 bg-[#FCFCFB] text-[#111111] rounded-full text-xs font-semibold shadow-sm tracking-wide">
                Grounding Engine
              </button>
              <button className="px-4 py-2 text-[#6B6B6B] rounded-full text-xs font-semibold hover:text-[#111111] transition-colors tracking-wide">
                RAG Pipeline
              </button>
              <button className="px-4 py-2 text-[#6B6B6B] rounded-full text-xs font-semibold hover:text-[#111111] transition-colors tracking-wide">
                ChromaDB
              </button>
            </div>
            <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-[#E7E7E4] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-[#111111] tracking-wide">Legal Corpus Active</span>
            </div>
          </div>

          {/* Center Orbs (Simulated with gradients) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 blur-3xl absolute -ml-40"></div>
            <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-300 to-sage-400 blur-3xl absolute"></div>
            <div className="w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-blue-300 to-indigo-200 blur-3xl absolute ml-40 mt-20"></div>
          </div>

          {/* Glassmorphic Widget Container */}
          <div className="z-10 self-center my-auto flex flex-col items-center">
            <div className="relative w-full max-w-[440px] bg-white/20 backdrop-blur-3xl border border-white/40 rounded-[2rem] p-8 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(255,255,255,0.4)] flex flex-col gap-6 text-left">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/50 mb-1">
                    NYAAY Legal Model v2
                  </span>
                  <span className="text-sm font-semibold text-[#111111] tracking-tight">
                    Citation Grounding Verification
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest">
                    Safe Mode
                  </span>
                </div>
              </div>

              {/* Spectral Visualization representing AI processing */}
              <div className="flex items-end justify-between h-20 gap-1.5 px-2">
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[25%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[45%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[70%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[60%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-teal-500/40 to-teal-600 rounded-full h-[90%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-teal-500/40 to-teal-600 rounded-full h-[80%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[55%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[30%]"></div>
                <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-600 rounded-full h-[40%]"></div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-black/5 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold">Latency</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-[#111111]">340</span>
                    <span className="text-[10px] text-[#6B6B6B] font-medium">ms</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold">Grounding</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-[#111111]">99.6</span>
                    <span className="text-[10px] text-[#6B6B6B] font-medium">%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold">Precision</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-[#111111]">99.9</span>
                    <span className="text-[10px] text-[#6B6B6B] font-medium">%</span>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div className="border-t border-black/5 pt-4 flex items-center justify-between text-xs text-[#6B6B6B]">
                <span className="font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  BNS / BNSS / BSA Seed Data
                </span>
                <span className="font-mono text-[10px]">VERIFIED OK</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex justify-between items-center z-10 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-[#E7E7E4]">
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
              <span className="text-xs font-semibold text-[#111111] whitespace-nowrap">Know Your Kanoon</span>
              <span className="text-xs font-semibold text-[#6B6B6B] whitespace-nowrap">Upload & Chat</span>
              <span className="text-xs font-semibold text-[#6B6B6B] whitespace-nowrap">DocHub Templates</span>
              <span className="text-xs font-semibold text-[#6B6B6B] whitespace-nowrap">Rebuttal Generator</span>
            </div>
            <Link
              to={currentUser ? "/dashboard" : "/signup"}
              className="bg-[#111111] text-white hover:bg-zinc-800 px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="text-center mb-16">
        <h3 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-[0.2em] mb-4">
          Empowering all layers of the Indian Legal System
        </h3>
        <div className="flex flex-wrap justify-center gap-12 text-[#6B6B6B]/40 font-bold text-lg tracking-tighter italic">
          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined">balance</span>Constitutional Law</div>
          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined">menu_book</span>Bharatiya Sanhitas</div>
          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined">account_balance</span>Supreme Court Precedents</div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mb-[180px] text-left">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
            Legal AI Suite
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-[#111111] mt-6 mb-4">
            Four core systems. One shared legal intelligence.
          </h2>
          <p className="text-lg text-[#6B6B6B] leading-relaxed">
            From quick statutory lookup to comprehensive drafting and argumentative strategy, NYAAY AI provides precision-engineered tools for every stakeholder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <Card className="h-[300px] bg-[#FCFCFB] p-8 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-50"></div>
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined text-[32px] text-[#111111]">gavel</span>
            </div>
            <div className="z-10 text-left">
              <h4 className="text-xl font-semibold tracking-tight text-[#111111] mb-2">Know Your Kanoon</h4>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Interact with Indian statutes, constitutional clauses, and landmark judgments via an intuitive grounded Q&A agent.
              </p>
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="h-[300px] bg-[#FCFCFB] p-8 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-50"></div>
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined text-[32px] text-[#111111]">upload_file</span>
            </div>
            <div className="z-10 text-left">
              <h4 className="text-xl font-semibold tracking-tight text-[#111111] mb-2">Upload &amp; Chat</h4>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Analyze contracts, affidavits, and case papers. Extract clauses, identify liabilities, and translate complex legalese instantly.
              </p>
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="h-[300px] bg-[#FCFCFB] p-8 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50"></div>
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined text-[32px] text-[#111111]">edit_document</span>
            </div>
            <div className="z-10 text-left">
              <h4 className="text-xl font-semibold tracking-tight text-[#111111] mb-2">DocHub</h4>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Draft legally binding documents including Rental Agreements, Legal Notices, and Affidavits using interactive template wizards.
              </p>
            </div>
          </Card>

          {/* Card 4 */}
          <Card className="h-[300px] bg-[#FCFCFB] p-8 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50"></div>
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined text-[32px] text-[#111111]">balance</span>
            </div>
            <div className="z-10 text-left">
              <h4 className="text-xl font-semibold tracking-tight text-[#111111] mb-2">Counter Argument Generator</h4>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Stress-test case claims. Input arguments and generate highly strategic legal rebuttals backed by precedent.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* FINAL SIGN OFF SECTION */}
      <section className="mb-[80px] text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-[#111111] mb-8 max-w-3xl leading-tight">
          The future of legal assistance starts here.
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link to={currentUser ? "/dashboard" : "/signup"}>
            <Button variant="primary" className="px-8 py-4">
              {currentUser ? "Dashboard" : "Create Free Account"}
            </Button>
          </Link>
          <Link to="/login" className={currentUser ? "hidden" : "block"}>
            <Button variant="outline" className="px-8 py-4">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
