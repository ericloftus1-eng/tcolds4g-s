'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, ChevronLeft, Circle, Search } from 'lucide-react';
import { messagingService, type Conversation, type DirectMessage } from '@/lib/services/messagingService';
import { useAuth } from '@/contexts/AuthContext';

const PARTNER_COLORS: Record<string, string> = {
  'demo-1': '#D4AF37',
  'demo-2': '#7B4EA0',
  'demo-3': '#52B788',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function DirectMessaging() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id || 'demo-user';

  const loadConversations = useCallback(async () => {
    const convs = await messagingService.getConversations(userId);
    setConversations(convs);
    const unread = convs.reduce((sum, c) => sum + c.unread_count, 0);
    setTotalUnread(unread);
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    const channel = messagingService.subscribeToMessages(user.id, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      loadConversations();
    });
    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, loadConversations]);

  const openChat = async (conv: Conversation) => {
    setActiveConv(conv);
    setView('chat');
    const msgs = await messagingService.getMessages(userId, conv.partner_id);
    setMessages(msgs);
    setConversations((prev) =>
      prev.map((c) => (c.partner_id === conv.partner_id ? { ...c, unread_count: 0 } : c))
    );
    setTotalUnread((prev) => Math.max(0, prev - conv.unread_count));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = async () => {
    if (!draft.trim() || !activeConv || sending) return;
    const body = draft.trim();
    setDraft('');
    setSending(true);

    // Optimistic update
    const optimistic: DirectMessage = {
      id: `opt-${Date.now()}`,
      sender_id: userId,
      recipient_id: activeConv.partner_id,
      body,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    const sent = await messagingService.sendMessage(userId, activeConv.partner_id, body);
    if (sent) {
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
    }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConvs = conversations.filter((c) =>
    c.partner_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-95 hover:scale-105"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          width: 52,
          height: 52,
          boxShadow: '0 8px 32px rgba(139,26,26,0.45)',
        }}
        aria-label="Open messages"
      >
        <MessageCircle size={22} />
        {totalUnread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-800"
            style={{ background: '#D4AF37', color: '#0a0a0a', fontSize: 10 }}
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border overflow-hidden flex flex-col shadow-2xl"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            height: 480,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          >
            {view === 'chat' && activeConv ? (
              <>
                <button
                  onClick={() => { setView('list'); setActiveConv(null); setMessages([]); }}
                  className="p-1 rounded-lg hover:bg-muted transition-colors mr-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                    style={{
                      background: `${PARTNER_COLORS[activeConv.partner_id] || '#8B1A1A'}22`,
                      color: PARTNER_COLORS[activeConv.partner_id] || '#8B1A1A',
                      border: `1.5px solid ${PARTNER_COLORS[activeConv.partner_id] || '#8B1A1A'}55`,
                    }}
                  >
                    {getInitials(activeConv.partner_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-700 truncate" style={{ color: 'var(--foreground)' }}>
                      {activeConv.partner_name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>
                      {activeConv.partner_rank}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <MessageCircle size={15} style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-700" style={{ color: 'var(--foreground)' }}>Messages</span>
                {totalUnread > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-700"
                    style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}
                  >
                    {totalUnread}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Conversation list */}
          {view === 'list' && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Search */}
              <div className="px-3 py-2 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <Search size={12} style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConvs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
                    <MessageCircle size={28} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                    <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                      No conversations yet
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
                      Send a message to a congregation member
                    </p>
                  </div>
                ) : (
                  filteredConvs.map((conv) => (
                    <button
                      key={conv.partner_id}
                      onClick={() => openChat(conv)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-700"
                          style={{
                            background: `${PARTNER_COLORS[conv.partner_id] || '#8B1A1A'}22`,
                            color: PARTNER_COLORS[conv.partner_id] || '#8B1A1A',
                            border: `1.5px solid ${PARTNER_COLORS[conv.partner_id] || '#8B1A1A'}55`,
                          }}
                        >
                          {getInitials(conv.partner_name)}
                        </div>
                        <Circle
                          size={9}
                          className="absolute -bottom-0.5 -right-0.5"
                          fill="#52B788"
                          stroke="var(--card)"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-700 truncate" style={{ color: 'var(--foreground)' }}>
                            {conv.partner_name}
                          </p>
                          <span className="text-xs flex-shrink-0 ml-1" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>
                            {timeAgo(conv.last_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
                            {conv.last_message}
                          </p>
                          {conv.unread_count > 0 && (
                            <span
                              className="flex-shrink-0 ml-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-800"
                              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 9 }}
                            >
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat view */}
          {view === 'chat' && activeConv && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                        style={{
                          background: isMe ? 'var(--primary)' : 'var(--muted)',
                          color: isMe ? 'var(--primary-foreground)' : 'var(--foreground)',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        }}
                      >
                        {msg.body}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className="flex items-center gap-2 px-3 py-3 border-t flex-shrink-0"
                style={{ borderColor: 'var(--border)' }}
              >
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!draft.trim() || sending}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
