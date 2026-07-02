import React, { useState, useMemo } from 'react';
import { Search, Plus, MessageSquare, MoreHorizontal, Pencil, Trash2, Pin } from 'lucide-react';
import { renameConversation, deleteConversation, pinConversation } from "../../services/chatService";
import { useAuth } from "../../contexts/AuthContext";

const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onConversationsChanged
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [conversations, searchQuery]);

  // Grouping logic
  const grouped = useMemo(() => {
    const groups = {
      pinned: [],
      today: [],
      yesterday: [],
      previous7Days: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const sevenDaysAgo = today - 86400000 * 7;

    filteredConversations.forEach(c => {
      if (c.is_pinned) {
        groups.pinned.push(c);
        return;
      }
      
      const updatedTime = new Date(c.updated_at).getTime();
      if (updatedTime >= today) {
        groups.today.push(c);
      } else if (updatedTime >= yesterday) {
        groups.yesterday.push(c);
      } else if (updatedTime >= sevenDaysAgo) {
        groups.previous7Days.push(c);
      } else {
        groups.older.push(c);
      }
    });
    return groups;
  }, [filteredConversations]);

  const handleRenameSubmit = async (id, e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      const token = await currentUser.getIdToken();
      await renameConversation(token, id, editTitle);
      setEditingId(null);
      if (onConversationsChanged) onConversationsChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      const token = await currentUser.getIdToken();
      await deleteConversation(token, id);
      setMenuOpenId(null);
      if (onConversationsChanged) onConversationsChanged();
      if (activeConversationId === id) {
        onNewChat(); // reset view
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (c) => {
    try {
      const token = await currentUser.getIdToken();
      await pinConversation(token, c.id, !c.is_pinned);
      setMenuOpenId(null);
      if (onConversationsChanged) onConversationsChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-3">{title}</h3>
        <div className="space-y-1">
          {items.map(c => (
            <div 
              key={c.id}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === c.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-text-primary'
              }`}
              onClick={() => {
                if (editingId !== c.id) onSelectConversation(c);
              }}
            >
              <MessageSquare size={16} className={activeConversationId === c.id ? 'text-primary' : 'text-text-secondary'} />
              
              {editingId === c.id ? (
                <form onSubmit={(e) => handleRenameSubmit(c.id, e)} className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={(e) => handleRenameSubmit(c.id, e)}
                    className="w-full bg-surface border border-primary rounded px-2 py-0.5 text-sm outline-none focus:ring-2 ring-primary/20 text-text-primary"
                    autoFocus
                  />
                </form>
              ) : (
                <span className="flex-1 min-w-0 truncate text-sm font-medium">
                  {c.title || "New Conversation"}
                </span>
              )}

              {/* Context Menu Button */}
              {editingId !== c.id && (
                <div className={`relative ${menuOpenId === c.id ? 'block' : 'hidden group-hover:block'}`}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === c.id ? null : c.id);
                    }}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-border rounded"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {menuOpenId === c.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-surface rounded-md shadow-lg border border-border z-50 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(c);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-secondary flex items-center gap-2"
                      >
                        <Pin size={14} /> {c.is_pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTitle(c.title);
                          setEditingId(c.id);
                          setMenuOpenId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-secondary flex items-center gap-2"
                      >
                        <Pencil size={14} /> Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c.id);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 flex-shrink-0 bg-background border-r border-border flex flex-col h-full" onClick={() => setMenuOpenId(null)}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">History</h2>
        <button
          onClick={onNewChat}
          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center border border-primary/20"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder-text-secondary"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border">
        {conversations.length === 0 ? (
          <div className="text-center text-text-secondary text-sm mt-10">
            No conversations yet.<br />Start a new chat to begin.
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center text-text-secondary text-sm mt-10">
            No matches found for "{searchQuery}".
          </div>
        ) : (
          <>
            {renderGroup("Pinned", grouped.pinned)}
            {renderGroup("Today", grouped.today)}
            {renderGroup("Yesterday", grouped.yesterday)}
            {renderGroup("Previous 7 Days", grouped.previous7Days)}
            {renderGroup("Older", grouped.older)}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
