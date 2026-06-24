import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { uploadDocument, queryDocument } from '../services/uploadChatService';
import { getConversations, getMessages, deleteConversation } from '../services/chatService';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Toast from '../components/common/Toast';

const UploadChat = () => {
  const { currentUser } = useAuth();
  
  // File Upload State
  const [file, setFile] = useState(null);
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Chat State
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState("");

  // History State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(
    localStorage.getItem('nyaay_active_upload_conversation') || null
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (activeConversationId && currentUser) {
      loadMessages(activeConversationId);
      localStorage.setItem('nyaay_active_upload_conversation', activeConversationId);
    } else {
      localStorage.removeItem('nyaay_active_upload_conversation');
    }
  }, [activeConversationId, currentUser]);

  const loadConversations = async () => {
    try {
      const token = await currentUser.getIdToken();
      const data = await getConversations(token);
      const uploadChats = data.conversations.filter(c => c.feature_type === 'upload_chat');
      setConversations(uploadChats);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const loadMessages = async (conversationId) => {
    setLoadingHistory(true);
    try {
      const token = await currentUser.getIdToken();
      const data = await getMessages(token, conversationId);
      
      const reconstructedHistory = [];
      let currentQuestion = "";
      
      data.messages.forEach(msg => {
        if (msg.role === 'user') {
          currentQuestion = msg.content;
        } else if (msg.role === 'assistant') {
          try {
            const parsed = JSON.parse(msg.content);
            reconstructedHistory.push({
              question: currentQuestion,
              ...parsed
            });
            currentQuestion = "";
          } catch(e) {
            console.error("Failed to parse message content", e);
          }
        }
      });
      
      setHistory(reconstructedHistory);
    } catch (err) {
      console.error("Failed to load messages", err);
      setChatError("Failed to load chat history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);
    // Mock the document metadata so the UI renders the chat view
    if (conv.document_id) {
      setDocumentMetadata({
        document_id: conv.document_id,
        filename: "Previously Uploaded Document",
        pages: "?",
        summary: "Loaded from history."
      });
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setHistory([]);
    setChatError("");
    setQuestion("");
    setDocumentMetadata(null); // Return to upload screen
    setFile(null);
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;
    setIsDeleting(true);
    try {
      const token = await currentUser.getIdToken();
      await deleteConversation(token, conversationToDelete);
      
      setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
      
      if (activeConversationId === conversationToDelete) {
        handleNewChat();
      }
      
      setToastMessage("Conversation deleted successfully");
      setIsToastOpen(true);
    } catch (err) {
      console.error("Failed to delete conversation", err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setConversationToDelete(null);
    }
  };

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
      setHistory([]);
    } catch (err) {
      setUploadError(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e?.preventDefault();
    if (!question.trim() || !documentMetadata) return;

    setChatError("");
    setLoadingChat(true);
    
    const currentQuestion = question.trim();
    setQuestion("");

    try {
      const token = await currentUser.getIdToken();
      const data = await queryDocument(token, documentMetadata.document_id, currentQuestion, activeConversationId);
      
      if (!activeConversationId) {
        setActiveConversationId(data.conversation_id);
        loadConversations();
      }

      setHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          ...data,
        }
      ]);
    } catch (err) {
      setChatError(err.message || "Failed to get an answer.");
      setQuestion(currentQuestion);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans flex flex-col overflow-hidden">
      <Navbar />
      <PageContainer className="flex-1 max-w-7xl w-full mx-auto pb-8 h-[calc(100vh-100px)]">
        <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
            <Link to="/dashboard" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Dashboard
            </Link>
            
            <div className="bg-white rounded-2xl border border-[#E7E7E4] flex flex-col h-full overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#E7E7E4]">
                <Button 
                  onClick={handleNewChat} 
                  variant="primary" 
                  className="w-full justify-center gap-2 rounded-xl"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <h3 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider px-3 mb-2 mt-2">Chat History</h3>
                {conversations.length === 0 ? (
                  <p className="text-sm text-[#6B6B6B] px-3 py-2">No previous conversations.</p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map(conv => (
                      <div key={conv.id} className="group relative flex items-center">
                        <button
                          onClick={() => handleSelectConversation(conv)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors truncate pr-10 ${
                            activeConversationId === conv.id 
                              ? 'bg-[#111111] text-white' 
                              : 'text-[#111111] hover:bg-[#F3F2EF]'
                          }`}
                        >
                          {conv.title}
                        </button>
                        <button
                          onClick={() => {
                            setConversationToDelete(conv.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className={`absolute right-2 p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100 ${
                            activeConversationId === conv.id 
                              ? 'text-white/80 hover:text-white hover:bg-white/20' 
                              : 'text-[#6B6B6B] hover:text-red-500 hover:bg-[#E7E7E4]'
                          }`}
                          title="Delete conversation"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            <div className="text-left space-y-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-semibold text-[#111111] tracking-tight">
                Upload & Chat
              </h1>
              <p className="text-[#6B6B6B] text-lg max-w-xl">
                Upload any legal document (PDF or DOCX) and ask questions to understand its contents instantly.
              </p>
            </div>

            {!documentMetadata ? (
              <Card className="p-8 text-center border-2 border-dashed border-[#E7E7E4] hover:border-[#111111] transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-[#6B6B6B]">upload_file</span>
                  <h3 className="text-xl font-medium text-[#111111]">Upload your document</h3>
                  <p className="text-[#6B6B6B] text-sm">Supports PDF and DOCX up to 10MB (max 300 pages).</p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf,.docx" 
                    className="hidden" 
                  />
                  
                  <div className="flex gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      Select File
                    </Button>
                    
                    {file && (
                      <Button 
                        variant="primary" 
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" color="white" />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          "Upload & Parse"
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {file && !uploading && (
                    <p className="text-[#111111] font-medium mt-2">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  )}
                  
                  {uploadError && (
                    <p className="text-red-500 text-sm font-medium mt-2">{uploadError}</p>
                  )}
                </div>
              </Card>
            ) : (
              <div className="flex-1 flex flex-col lg:flex-row gap-6">
                
                {/* Document Metadata Column */}
                <div className="w-full lg:w-1/3 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">
                  <Card className="!bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#111111]">
                        <span className="material-symbols-outlined text-2xl">description</span>
                        <h3 className="font-semibold truncate">{documentMetadata.filename}</h3>
                      </div>
                      <div className="flex justify-between text-sm text-[#6B6B6B]">
                        <span>Pages</span>
                        <span className="font-medium text-[#111111]">{documentMetadata.pages}</span>
                      </div>
                      <div className="h-px w-full bg-[#E7E7E4]"></div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111] mb-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">psychiatry</span>
                          AI Summary
                        </h4>
                        <p className="text-sm text-[#6B6B6B] leading-relaxed">
                          {documentMetadata.summary}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Chat Column */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden h-full">
                  {loadingHistory ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner size="lg" color="black" />
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 pb-4">
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
                                  <span className="bg-[#F3F2EF] text-[#111111] text-xs font-medium px-3 py-1 rounded-full border border-[#E7E7E4] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Confidence: {item.confidence}
                                  </span>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-[#111111] mb-1">Answer</h4>
                                  <div className="prose prose-sm text-[#6B6B6B] leading-relaxed max-w-none">
                                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                                  </div>
                                </div>

                                <div className="h-px w-full bg-[#E7E7E4]"></div>
                                
                                <div className="bg-[#F7F7F5] p-4 rounded-xl border border-[#E7E7E4]">
                                  <p className="text-sm text-[#111111] font-medium leading-relaxed">
                                    <strong>Summary:</strong> {item.summary}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex-1"></div>
                  )}

                  {/* Chat Input */}
                  <div className="mt-auto shrink-0 pb-2">
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
                          placeholder="Ask a question about the document..."
                          className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[60px] p-2 text-[#111111] placeholder:text-[#6B6B6B]/60 font-medium"
                          disabled={loadingChat}
                        />
                        
                        {chatError && (
                          <p className="text-red-500 text-sm font-medium px-2">{chatError}</p>
                        )}

                        <div className="flex items-center justify-end border-t border-[#E7E7E4] pt-4 mt-2">
                          <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loadingChat || !question.trim()}
                            className="min-w-[120px] rounded-full"
                          >
                            {loadingChat ? (
                              <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" color="white" />
                                <span>Thinking...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>Ask Document</span>
                                <span className="material-symbols-outlined text-sm">send</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </PageContainer>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Conversation?"
        body="This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
        onConfirm={handleDeleteConversation}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setConversationToDelete(null);
        }}
      />
      
      <Toast 
        isOpen={isToastOpen} 
        message={toastMessage} 
        onClose={() => setIsToastOpen(false)} 
      />
    </div>
  );
};

export default UploadChat;
