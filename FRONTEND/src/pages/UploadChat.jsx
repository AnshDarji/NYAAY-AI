import React, { useState, useRef } from 'react';
import Navbar from '../components/common/Navbar';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { uploadDocument, queryDocument } from '../services/uploadChatService';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const UploadChat = () => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [documentMetadata, setDocumentMetadata] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    // Client-side validation
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
      const data = await queryDocument(token, documentMetadata.document_id, currentQuestion);
      
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
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      <Navbar />
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          <div className="text-left space-y-4">
            <Link to="/dashboard" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111] transition-colors mb-4">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Dashboard
            </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Document Metadata */}
              <div className="md:col-span-1 space-y-4">
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

              {/* Right Column: Chat Interface */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Chat History */}
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
                                  Confidence: {item.confidence}
                                </span>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-[#111111] mb-1">Answer Summary</h4>
                                <p className="text-[#111111] font-medium leading-relaxed">
                                  {item.summary}
                                </p>
                              </div>
                              
                              <div className="h-px w-full bg-[#E7E7E4]"></div>
                              
                              <div>
                                <h4 className="font-semibold text-[#111111] mb-2">Detailed Answer</h4>
                                <div className="prose prose-sm text-[#6B6B6B] leading-relaxed max-w-none">
                                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chat Input */}
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
                      placeholder="Ask a question about this document..."
                      className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[80px] p-2 text-[#111111] placeholder:text-[#6B6B6B]/60 font-medium"
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
          )}

        </div>
      </PageContainer>
    </div>
  );
};

export default UploadChat;
