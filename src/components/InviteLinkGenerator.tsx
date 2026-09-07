'use client';
import React, { useState } from 'react';
import { Link2, Clock, Users, Copy, Check, X, Sparkles, ChevronDown } from 'lucide-react';

interface InviteLink {
  token: string;
  url: string;
  expiresAt: number;
  maxUses: number | null;
  usedCount: number;
  createdAt: number;
  label: string;
}

const EXPIRY_OPTIONS = [
  { label: '1 Hour', value: 1 * 60 * 60 * 1000 },
  { label: '6 Hours', value: 6 * 60 * 60 * 1000 },
  { label: '24 Hours', value: 24 * 60 * 60 * 1000 },
  { label: '3 Days', value: 3 * 24 * 60 * 60 * 1000 },
  { label: '7 Days', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', value: 30 * 24 * 60 * 60 * 1000 },
];

const USE_OPTIONS = [
  { label: 'Unlimited', value: null },
  { label: '1 use', value: 1 },
  { label: '5 uses', value: 5 },
  { label: '10 uses', value: 10 },
  { label: '25 uses', value: 25 },
  { label: '50 uses', value: 50 },
];

function generateToken(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function formatTimeLeft(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h left`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m left`;
}

function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://tcolds3821.builtwithrocket.new';
}

interface InviteLinkGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberInitials: string;
  memberColor?: string;
  memberRank?: string;
  memberHandle?: string;
}

export default function InviteLinkGenerator({
  isOpen,
  onClose,
  memberName,
  memberInitials,
  memberColor = '#52B788',
  memberRank = 'Member',
  memberHandle = 'member',
}: InviteLinkGeneratorProps) {
  const [selectedExpiry, setSelectedExpiry] = useState(EXPIRY_OPTIONS[2]); // 24h default
  const [selectedUses, setSelectedUses] = useState(USE_OPTIONS[0]); // unlimited default
  const [customMessage, setCustomMessage] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState<InviteLink[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [usesOpen, setUsesOpen] = useState(false);

  const handleGenerate = () => {
    const token = generateToken();
    const siteUrl = getSiteUrl();
    const inviteData = {
      token,
      createdBy: memberName,
      createdByHandle: memberHandle,
      createdByRank: memberRank,
      createdByInitials: memberInitials,
      createdByColor: memberColor,
      expiresAt: Date.now() + selectedExpiry.value,
      maxUses: selectedUses.value,
      usedCount: 0,
      message: customMessage || `Come join the holiest comedy congregation on the internet. Your punchlines are welcome here.`,
      isValid: true,
    };
    // Store in localStorage for demo (in production: save to Supabase)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tcolds_invite_${token}`, JSON.stringify(inviteData));
    }
    const newLink: InviteLink = {
      token,
      url: `${siteUrl}/invite/${token}`,
      expiresAt: inviteData.expiresAt,
      maxUses: selectedUses.value,
      usedCount: 0,
      createdAt: Date.now(),
      label: `${selectedExpiry.label}${selectedUses.value ? ` · ${selectedUses.value} uses` : ''}`,
    };
    setGeneratedLinks((prev) => [newLink, ...prev]);
  };

  const handleCopy = async (url: string, token: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleRevoke = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`tcolds_invite_${token}`);
    }
    setGeneratedLinks((prev) => prev.filter((l) => l.token !== token));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)' }}>
              <Link2 size={15} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-sm font-800">Share an Invite Link</h2>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Generate a time-limited access link</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Expiry selector */}
          <div>
            <label className="text-xs font-700 mb-2 block" style={{ color: 'var(--foreground)' }}>
              <Clock size={11} className="inline mr-1" />
              Link Expires After
            </label>
            <div className="relative">
              <button
                onClick={() => { setExpiryOpen(!expiryOpen); setUsesOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-600 transition-all hover:bg-muted"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span>{selectedExpiry.label}</span>
                <ChevronDown size={14} style={{ transform: expiryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {expiryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-10 overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setSelectedExpiry(opt); setExpiryOpen(false); }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between"
                      style={{ color: selectedExpiry.label === opt.label ? 'var(--primary)' : 'var(--foreground)', fontWeight: selectedExpiry.label === opt.label ? 700 : 500 }}
                    >
                      {opt.label}
                      {selectedExpiry.label === opt.label && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Max uses selector */}
          <div>
            <label className="text-xs font-700 mb-2 block" style={{ color: 'var(--foreground)' }}>
              <Users size={11} className="inline mr-1" />
              Max Uses
            </label>
            <div className="relative">
              <button
                onClick={() => { setUsesOpen(!usesOpen); setExpiryOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-600 transition-all hover:bg-muted"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span>{selectedUses.label}</span>
                <ChevronDown size={14} style={{ transform: usesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {usesOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-10 overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  {USE_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setSelectedUses(opt); setUsesOpen(false); }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between"
                      style={{ color: selectedUses.label === opt.label ? 'var(--primary)' : 'var(--foreground)', fontWeight: selectedUses.label === opt.label ? 700 : 500 }}
                    >
                      {opt.label}
                      {selectedUses.label === opt.label && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom message */}
          <div>
            <label className="text-xs font-700 mb-2 block" style={{ color: 'var(--foreground)' }}>
              <Sparkles size={11} className="inline mr-1" />
              Personal Message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Come join the holiest comedy congregation on the internet..."
              rows={2}
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-xl text-sm resize-none outline-none focus:ring-2"
              style={{ background: 'var(--input)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>{customMessage.length}/200</p>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 gold-gradient"
            style={{ color: 'var(--primary-foreground)' }}
          >
            <Link2 size={15} />
            Generate Invite Link
          </button>

          {/* Generated links list */}
          {generatedLinks.length > 0 && (
            <div>
              <p className="text-xs font-700 mb-3" style={{ color: 'var(--muted-foreground)' }}>Your Active Invite Links</p>
              <div className="flex flex-col gap-2">
                {generatedLinks.map((link) => {
                  const tl = formatTimeLeft(link.expiresAt);
                  const isExpired = tl === 'Expired';
                  return (
                    <div
                      key={link.token}
                      className="rounded-xl border p-3"
                      style={{ background: 'var(--muted)', borderColor: isExpired ? 'rgba(204,34,34,0.3)' : 'var(--border)', opacity: isExpired ? 0.6 : 1 }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono truncate" style={{ color: 'var(--foreground)' }}>{link.url}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs" style={{ color: isExpired ? '#CC2222' : '#52B788' }}>
                              <Clock size={9} className="inline mr-0.5" />
                              {tl}
                            </span>
                            {link.maxUses && (
                              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                <Users size={9} className="inline mr-0.5" />
                                {link.usedCount}/{link.maxUses} used
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleCopy(link.url, link.token)}
                            disabled={isExpired}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
                            style={{ color: copiedToken === link.token ? '#52B788' : 'var(--muted-foreground)' }}
                            title="Copy link"
                          >
                            {copiedToken === link.token ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => handleRevoke(link.token)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            style={{ color: '#CC2222' }}
                            title="Revoke link"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
