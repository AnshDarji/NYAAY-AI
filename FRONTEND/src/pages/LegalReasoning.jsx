import React, { useState, useRef, useEffect } from 'react';
import { Scale, AlertCircle } from 'lucide-react';
import WorkspaceContainer from '../components/common/WorkspaceContainer';
import ConversationLayout from '../components/chat/ConversationLayout';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import LegalAnalysisRenderer from '../components/reasoning/LegalAnalysisRenderer';
import { generateReasoning } from '../services/reasoningService';
import { useAuth } from '../contexts/AuthContext';

const LegalReasoningChatArea = ({ refreshConversations }) => {
  const { currentUser } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;
    
    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    setError(null);
    
    abortControllerRef.current = new AbortController();
    
    try {
      const token = await currentUser.getIdToken();
      const response = await generateReasoning(
        token,
        userMessage.content, 
        activeConversationId, // pass conversation_id
        abortControllerRef.current.signal
      );
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content,
        citations: response.citations || [],
        id: response.analysis_id
      }]);
      
      // If it's a new conversation, update the active ID and refresh sidebar
      if (!activeConversationId && response.conversation_id) {
        setActiveConversationId(response.conversation_id);
        if (refreshConversations) refreshConversations();
      }
      
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        console.log('Request canceled');
      } else {
        setError(err.message || 'Failed to generate legal reasoning.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputValue('');
    setError(null);
  };

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);
  };

  const handleMessagesLoaded = (loadedMessages) => {
    // Map backend messages to frontend format if needed
    setMessages(loadedMessages);
  };

  return (
    <ConversationLayout
      featureType="legal_reasoning"
      activeConversationId={activeConversationId}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onMessagesLoaded={handleMessagesLoaded}
    >
      <div className="flex flex-col h-full bg-surface relative">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-border bg-surface/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-3 md:ml-12">
            <div className="p-1.5 bg-primary/10 rounded-button border border-primary/20">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary tracking-tight leading-tight">Legal Reasoning</h1>
              <p className="text-xs text-text-secondary">Continuous legal analysis workspace</p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-background relative scroll-smooth scrollbar-thin scrollbar-thumb-border">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-6">
              <div className="w-16 h-16 bg-surface rounded-2xl shadow-sm border border-border flex items-center justify-center mb-6">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">Start a Legal Session</h2>
              <p className="text-text-secondary text-sm mb-8">
                Describe a scenario, outline a dispute, or ask a legal question. 
                The AI associate will maintain context throughout the conversation.
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button onClick={() => setInputValue("Analyze a potential contract dispute regarding late delivery...")} className="text-xs bg-surface hover:bg-secondary border border-border px-4 py-2 rounded-full text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Contract Dispute</button>
                <button onClick={() => setInputValue("What are the legal steps for an eviction notice...")} className="text-xs bg-surface hover:bg-secondary border border-border px-4 py-2 rounded-full text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Eviction Notice</button>
                <button onClick={() => setInputValue("Analyze the new BNS provisions regarding...")} className="text-xs bg-surface hover:bg-secondary border border-border px-4 py-2 rounded-full text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">BNS Analysis</button>
              </div>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  renderContent={msg.role === 'assistant' ? (content) => <LegalAnalysisRenderer content={content} /> : null}
                />
              ))}
              
              {isGenerating && (
                <MessageBubble 
                  message={{ role: 'assistant', content: 'Thinking...' }} 
                  renderContent={() => (
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-8 z-10 pointer-events-none">
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            {error && (
              <div className="mb-4 p-3 bg-error-bg border border-error/50 rounded-lg flex items-center gap-2 text-error text-sm shadow-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <ChatInput 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSendMessage}
              isLoading={isGenerating}
              placeholder="Ask a legal question, request drafting modifications..."
            />
          </div>
        </div>
      </div>
    </ConversationLayout>
  );
};

const LegalReasoning = () => {
  return (
    <WorkspaceContainer>
      <LegalReasoningChatArea />
    </WorkspaceContainer>
  );
};

export default LegalReasoning;
