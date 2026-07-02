import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import WorkspaceContainer from '../components/common/WorkspaceContainer';
import ConversationLayout from '../components/chat/ConversationLayout';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import KanoonRenderer from '../components/kanoon/KanoonRenderer';
import { askKanoon } from '../services/kanoonService';
import { useAuth } from '../contexts/AuthContext';

const KanoonChatArea = ({ refreshConversations }) => {
  const { currentUser } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

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
    
    try {
      const token = await currentUser.getIdToken();
      const response = await askKanoon(token, userMessage.content, activeConversationId);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: JSON.stringify(response) // Store as JSON string for renderer
      }]);
      
      // If it's a new conversation, update the active ID and refresh sidebar
      if (!activeConversationId && response.conversation_id) {
        setActiveConversationId(response.conversation_id);
        if (refreshConversations) refreshConversations();
      }
      
    } catch (err) {
      setError(err.message || 'Failed to get an answer. Please try again.');
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
    // Backend returns { role, content }, content is JSON string for assistant
    setMessages(loadedMessages);
  };

  const EXAMPLE_QUESTIONS = [
    "Can my landlord evict me without notice?",
    "What are my rights during police questioning?",
    "What is anticipatory bail?",
  ];

  return (
    <ConversationLayout
      featureType="know_kanoon"
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
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary tracking-tight leading-tight">Know Your Kanoon</h1>
              <p className="text-xs text-text-secondary">Your AI-powered Indian legal assistant</p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-background relative scroll-smooth scrollbar-thin scrollbar-thumb-border">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-6">
              <div className="w-16 h-16 bg-surface rounded-2xl shadow-sm border border-border flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">Ask Any Legal Question</h2>
              <p className="text-text-secondary text-sm mb-8">
                Get clear, simple answers about Indian law, fundamental rights, legal procedures, and civil matters.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-sm">
                {EXAMPLE_QUESTIONS.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInputValue(q)} 
                    className="text-sm bg-surface hover:bg-secondary border border-border px-4 py-3 rounded-xl text-text-primary text-left transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  renderContent={msg.role === 'assistant' ? (content) => <KanoonRenderer content={content} /> : null}
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
              placeholder="E.g., Can my landlord evict me without notice?"
            />
          </div>
        </div>
      </div>
    </ConversationLayout>
  );
};

const KnowYourKanoon = () => {
  return (
    <WorkspaceContainer>
      <KanoonChatArea />
    </WorkspaceContainer>
  );
};

export default KnowYourKanoon;
