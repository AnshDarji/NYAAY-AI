import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Download,
  Loader2,
  Scale,
  FileText
} from 'lucide-react';
import { generateReasoning } from '../services/reasoningService';

const LegalReasoning = () => {
  const [step, setStep] = useState(1);
  const [facts, setFacts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!facts.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await generateReasoning(facts);
      setResult(response);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to generate legal reasoning.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      alert('Analysis copied to clipboard!');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-dark-900 text-gray-100 font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-dark-900 to-dark-900 pointer-events-none" />
        
        <header className="relative z-10 px-8 py-6 border-b border-dark-700 bg-dark-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Scale className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Legal Reasoning Engine</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Submit a factual scenario. Our AI will analyze the legal issues, retrieve relevant statutory provisions, construct arguments for both sides, and provide a structured, objective legal assessment.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Step 1: Input Facts */}
            {step === 1 && (
              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  Describe the Dispute or Scenario
                </h2>
                <textarea
                  className="w-full h-64 bg-dark-900 border border-dark-600 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none mb-6 text-base leading-relaxed"
                  placeholder="E.g., My landlord Amit at 123 Main St. is refusing to return my security deposit of 50,000 INR even though my lease ended 3 months ago..."
                  value={facts}
                  onChange={(e) => setFacts(e.target.value)}
                />
                
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={!facts.trim() || isGenerating}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Legal Framework...
                      </>
                    ) : (
                      <>
                        Generate Legal Analysis
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Results */}
            {step === 2 && result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    ← Analyze Another Scenario
                  </button>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg border border-dark-700 transition-all"
                      title="Copy Analysis"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      className="px-4 py-2 bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 rounded-lg border border-primary-500/30 transition-all text-sm font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Analysis Content */}
                  <div className="lg:col-span-2 bg-dark-800/80 border border-dark-700 rounded-2xl p-8 backdrop-blur-md shadow-xl prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-a:text-primary-400 max-w-none">
                    <ReactMarkdown>{result.content}</ReactMarkdown>
                  </div>

                  {/* Citations Sidebar */}
                  <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 backdrop-blur-sm h-fit sticky top-0 shadow-lg">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-400" />
                      Legal Citations
                    </h3>
                    <div className="space-y-4">
                      {result.citations && result.citations.length > 0 ? (
                        result.citations.map((citation, index) => (
                          <div key={index} className="p-4 bg-dark-900 border border-dark-700 rounded-xl group hover:border-primary-500/50 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                                {citation.marker}
                              </span>
                              <span className="text-sm font-medium text-gray-200">
                                {citation.metadata.source_name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                              {citation.text_snippet}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl text-center">
                          <AlertCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">No citations mapped for this analysis.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalReasoning;
