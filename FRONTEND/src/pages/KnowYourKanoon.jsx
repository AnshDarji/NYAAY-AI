import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { askKanoon } from '../services/kanoonService';
import { Link } from 'react-router-dom';

const EXAMPLE_QUESTIONS = [
  "Can my landlord evict me without notice?",
  "What are my rights during police questioning?",
  "What is anticipatory bail?",
  "What are fundamental rights?",
];

const KnowYourKanoon = () => {
  const { currentUser } = useAuth();
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e?.preventDefault();
    if (!question.trim()) {
      setError("Please enter a legal question.");
      return;
    }
    if (question.length < 5) {
      setError("Your question is too short. Please provide more details.");
      return;
    }
    if (question.length > 1000) {
      setError("Your question is too long. Please keep it under 1000 characters.");
      return;
    }

    setError("");
    setLoading(true);
    
    // Save current question temporarily to push to history later
    const currentQuestion = question.trim();
    // Clear input immediately for better UX
    setQuestion("");

    try {
      const token = await currentUser.getIdToken();
      const data = await askKanoon(token, currentQuestion);
      
      setHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          ...data,
        }
      ]);
    } catch (err) {
      setError(err.message || "Failed to get an answer. Please try again.");
      setQuestion(currentQuestion); // Restore input on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      <Navbar />
      <PageContainer>
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          
          <div className="text-left space-y-4">
            <Link to="/dashboard" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] transition-colors mb-4">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#111111] tracking-tight">
              Know Your Kanoon
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Your AI-powered legal assistant. Ask any question about Indian law and get clear, simple answers.
            </p>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="space-y-4">
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="bg-[#111111] text-white px-6 py-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                      <p className="text-sm md:text-base">{item.question}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <Card className="max-w-[95%] !rounded-tl-sm !bg-white">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#F3F2EF] text-[#111111] text-xs font-medium px-3 py-1 rounded-full border border-[#E7E7E4]">
                            {item.category}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#111111] mb-1">Summary</h4>
                          <p className="text-[#111111] font-medium leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                        
                        <div className="h-px w-full bg-[#E7E7E4]"></div>
                        
                        <div>
                          <h4 className="font-semibold text-[#111111] mb-2">Detailed Answer</h4>
                          <div className="prose prose-sm text-[#6B6B6B] leading-relaxed whitespace-pre-wrap">
                            {item.answer}
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-[#F7F7F5] p-4 rounded-xl border border-[#E7E7E4]">
                          <div className="flex gap-2">
                            <span className="material-symbols-outlined text-[#6B6B6B] text-lg">info</span>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                              <strong>Disclaimer:</strong> {item.disclaimer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Section */}
          <div className="pt-4">
            <Card className="!p-4 shadow-sm border border-[#E7E7E4] focus-within:border-[#111111] transition-colors">
              <form onSubmit={handleAsk} className="flex flex-col gap-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk(e);
                    }
                  }}
                  placeholder="E.g., Can my landlord evict me without notice?"
                  className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[80px] p-2 text-[#111111] placeholder:text-[#6B6B6B]/60 font-medium"
                  disabled={loading}
                />
                
                {error && (
                  <p className="text-red-500 text-sm font-medium px-2">{error}</p>
                )}

                <div className="flex items-center justify-between border-t border-[#E7E7E4] pt-4 mt-2">
                  <div className="flex-1 flex flex-wrap gap-2 pr-4">
                    {history.length === 0 && EXAMPLE_QUESTIONS.map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuestion(example);
                          setError("");
                        }}
                        className="text-xs bg-[#F3F2EF] hover:bg-[#E7E7E4] text-[#6B6B6B] hover:text-[#111111] px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
                        disabled={loading}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || !question.trim()}
                    className="min-w-[120px] rounded-full"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" color="white" />
                        <span>Asking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Ask AI</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>
      </PageContainer>
    </div>
  );
};

export default KnowYourKanoon;
