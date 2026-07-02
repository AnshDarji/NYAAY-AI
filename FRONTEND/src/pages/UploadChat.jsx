import React, { useState, useRef, useEffect } from 'react';
import { FileText, AlertCircle, UploadCloud, FileUp } from 'lucide-react';
import WorkspaceContainer from '../components/common/WorkspaceContainer';
import ConversationLayout from '../components/chat/ConversationLayout';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import UploadChatRenderer from '../components/uploadChat/UploadChatRenderer';
import { uploadDocument, queryDocument } from '../services/uploadChatService';
import { useAuth } from '../contexts/AuthContext';

const UploadChatArea = ({ refreshConversations }) => {
  const { currentUser } = useAuth();
  
  // File Upload State
  const [file, setFile] = useState(null);
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Chat State
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatError, setChatError] = useState(null);
  
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setUploadError("Only PDF and DOCX files are supported.");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds the 10MB limit.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const token = await currentUser.getIdToken();
      const response = await uploadDocument(token, file);
      setDocumentMetadata(response);
      
      // Clear current chat when a new document is uploaded
      setActiveConversationId(null);
      setMessages([]);
    } catch (err) {
      setUploadError(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating || !documentMetadata) return;
    
    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    setChatError(null);
    
    abortControllerRef.current = new AbortController();
    
    try {
      const token = await currentUser.getIdToken();
      const response = await queryDocument(
        token, 
        documentMetadata.document_id, 
        userMessage.content, 
        activeConversationId, 
        abortControllerRef.current.signal
      );
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: JSON.stringify(response)
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
        setChatError(err.message || "Failed to get an answer.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputValue('');
    setChatError(null);
    setDocumentMetadata(null); // Return to upload screen
    setFile(null);
  };

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);
    if (conv.document_id) {
      setDocumentMetadata({
        document_id: conv.document_id,
        filename: conv.document?.filename || "Previously Uploaded Document",
        pages: conv.document?.pages || "?",
        summary: conv.document?.summary || "Loaded from history."
      });
    }
  };

  const handleMessagesLoaded = (loadedMessages) => {
    setMessages(loadedMessages);
  };

  return (
    <ConversationLayout
      featureType="upload_chat"
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
              <FileUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary tracking-tight leading-tight">Document Chat</h1>
              <p className="text-xs text-text-secondary">
                {documentMetadata ? documentMetadata.filename : "Upload and analyze legal documents"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background relative scroll-smooth scrollbar-thin scrollbar-thumb-border">
          {!documentMetadata ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="bg-surface border-2 border-dashed border-border rounded-3xl p-10 max-w-lg w-full text-center hover:border-primary/40 transition-colors shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary mb-2">Upload Document</h2>
                <p className="text-text-secondary text-sm mb-8">
                  Upload any legal document (PDF or DOCX up to 10MB) to extract insights, summarize clauses, and ask questions.
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx" 
                  className="hidden" 
                />
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 py-2.5 bg-surface border border-border text-text-primary rounded-button hover:bg-secondary font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Select File
                  </button>
                  
                  {file && (
                    <button 
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-6 py-2.5 bg-primary text-white rounded-button hover:bg-primary-hover font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {uploading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload & Parse"
                      )}
                    </button>
                  )}
                </div>

                {file && !uploading && (
                  <p className="text-sm font-medium text-primary bg-primary/10 inline-block px-3 py-1 rounded-full">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                
                {uploadError && (
                  <p className="text-error text-sm mt-4 bg-error-bg py-2 px-3 rounded-lg inline-block border border-error/50">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  renderContent={msg.role === 'assistant' ? (content) => <UploadChatRenderer content={content} /> : null}
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

        {/* Input Area (Only visible when document is uploaded) */}
        {documentMetadata && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-8 z-10 pointer-events-none">
            <div className="max-w-4xl mx-auto w-full pointer-events-auto">
              {chatError && (
                <div className="mb-4 p-3 bg-error-bg border border-error/50 rounded-lg flex items-center gap-2 text-error text-sm shadow-sm">
                  <AlertCircle className="w-4 h-4" />
                  {chatError}
                </div>
              )}
              <ChatInput 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSubmit={handleSendMessage}
                isLoading={isGenerating}
                placeholder="Ask a question about this document..."
              />
            </div>
          </div>
        )}
      </div>
    </ConversationLayout>
  );
};

const UploadChat = () => {
  return (
    <WorkspaceContainer>
      <UploadChatArea />
    </WorkspaceContainer>
  );
};

export default UploadChat;
