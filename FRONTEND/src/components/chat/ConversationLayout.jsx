import React, { useState, useEffect, useCallback } from 'react';
import ChatSidebar from './ChatSidebar';
import { getConversations, getMessages } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const ConversationLayout = ({ 
  featureType, 
  onSelectConversation, 
  activeConversationId,
  onNewChat,
  children,
  onMessagesLoaded // Callback to pass messages back up when a conversation is selected
}) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await getConversations(token, featureType);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, featureType]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, activeConversationId]);

  const handleSelectConversation = async (conv) => {
    onSelectConversation(conv);
    if (onMessagesLoaded) {
      try {
        const token = await currentUser.getIdToken();
        const data = await getMessages(token, conv.id);
        onMessagesLoaded(data.messages || [], conv);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-surface overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white rounded-button shadow-sm text-text-secondary border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar Container */}
      <div 
        className={`absolute md:relative z-30 h-full transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
        }`}
      >
        <ChatSidebar 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={onNewChat}
          onConversationsChanged={fetchConversations}
        />
        <button
          className="md:hidden absolute top-4 right-4 text-slate-500"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Mobile Overlay Background */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/20 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface relative h-full">
        {children}
      </div>
    </div>
  );
};

export default ConversationLayout;
