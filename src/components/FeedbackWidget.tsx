'use client';
import React, { useState } from 'react';
import { MessageSquare, X, Send, Smile, Meh, Frown, Sparkles, ChevronDown } from 'lucide-react';

type Mood = 'love' | 'meh' | 'broken';
type Category = 'bug' | 'idea' | 'praise' | 'other';

const FEEDBACK_KEY = 'tcolds_feedback_submitted_v1';

const moodConfig: Record<Mood, { icon: React.ElementType; label: string; color: string; emoji: string }> = {
  love: { icon: Smile, label: 'Loving it', color: '#52B788', emoji: '😍' },
  meh: { icon: Meh, label: 'It\'s okay', color: '#D4AF37', emoji: '😐' },
  broken: { icon: Frown, label: 'Something\'s off', color: '#CC2222', emoji: '😤' },
};

const categories: { value: Category; label: string }[] = [
  { value: 'bug', label: '🐛 Found a bug' },
  { value: 'idea', label: '💡 Feature idea' },
  { value: 'praise', label: '🙌 Just want to say...' },
  { value: 'other', label: '🤷 Other' },
];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);
  const [category, setCategory] = useState<Category>('praise');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    // In production this would POST to an API
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ mood, category, text, ts: Date.now() }));
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setMood(null);
      setText('');
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2">
      {/* Panel */}
      {open && !minimized && (
        <div
          className="w-72 rounded-2xl border shadow-2xl overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', animation: 'fadeInUp 0.25s ease forwards' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 100%)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Soft Launch Feedback</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(true)} className="p-1 rounded hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                <ChevronDown size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="px-4 py-8 text-center">
              <div className="text-3xl mb-3">🙏</div>
              <p className="font-700 text-sm" style={{ color: '#52B788' }}>Bless you for the feedback!</p>
              <p className="text-xs font-500 mt-1" style={{ color: 'var(--muted-foreground)' }}>The congregation appreciates your input.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Soft launch badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <span className="text-xs">🚀</span>
                <p className="text-xs font-600" style={{ color: 'var(--primary)' }}>You&apos;re in the soft launch! Your feedback shapes TCoLDS.</p>
              </div>

              {/* Mood selector */}
              <div>
                <p className="text-xs font-700 mb-2" style={{ color: 'var(--muted-foreground)' }}>HOW&apos;S IT FEELING?</p>
                <div className="flex gap-2">
                  {(Object.entries(moodConfig) as [Mood, typeof moodConfig[Mood]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setMood(key)}
                      className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-600 transition-all duration-150"
                      style={{
                        background: mood === key ? `${cfg.color}18` : 'var(--muted)',
                        color: mood === key ? cfg.color : 'var(--muted-foreground)',
                        border: `1px solid ${mood === key ? cfg.color + '44' : 'transparent'}`,
                      }}
                    >
                      <span className="text-base">{cfg.emoji}</span>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-700 mb-2" style={{ color: 'var(--muted-foreground)' }}>CATEGORY</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className="py-1.5 px-2 rounded-lg text-xs font-600 transition-all duration-150 text-left"
                      style={{
                        background: category === cat.value ? 'rgba(212,175,55,0.15)' : 'var(--muted)',
                        color: category === cat.value ? 'var(--primary)' : 'var(--muted-foreground)',
                        border: `1px solid ${category === cat.value ? 'rgba(212,175,55,0.4)' : 'transparent'}`,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-700 mb-2" style={{ color: 'var(--muted-foreground)' }}>YOUR SERMON</p>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Speak your truth to the congregation..."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 text-xs font-500 resize-none outline-none transition-colors"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-700 transition-all duration-150 disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <Send size={12} />
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB trigger */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 relative"
        style={{
          background: open ? 'var(--muted)' : 'linear-gradient(135deg, var(--primary), #B8860B)',
          color: open ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
          boxShadow: open ? 'none' : '0 4px 20px rgba(212,175,55,0.35)',
        }}
        title="Share feedback"
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
        {!open && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-800"
            style={{ background: '#52B788', fontSize: '9px' }}
          >
            β
          </span>
        )}
      </button>
    </div>
  );
}
