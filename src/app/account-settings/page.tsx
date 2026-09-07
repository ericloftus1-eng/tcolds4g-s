'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Shield, Key, Trash2, LogOut, ArrowLeft, Check, Eye, EyeOff, Smartphone, Mail, Globe, AlertTriangle, Zap, Lock, RefreshCw, Download, ExternalLink, ChevronRight, Coins, Crown, Settings, Copy, CheckCircle2 } from 'lucide-react';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';

type AccountTab = 'security' | 'billing' | 'connected' | 'data';

const tabs: { id: AccountTab; label: string; icon: React.ElementType }[] = [
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & CC', icon: Coins },
  { id: 'connected', label: 'Connected Accounts', icon: Globe },
  { id: 'data', label: 'Data & Privacy', icon: Download },
];

const connectedPlatforms = [
  { id: 'twitter', label: 'X / Twitter', handle: '@thunderpants', connected: true, color: '#1DA1F2', icon: '𝕏' },
  { id: 'instagram', label: 'Instagram', handle: null, connected: false, color: '#E1306C', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', handle: '@thunderpants_official', connected: true, color: '#69C9D0', icon: '♪' },
  { id: 'youtube', label: 'YouTube', handle: null, connected: false, color: '#FF0000', icon: '▶' },
];

const ccTransactions = [
  { id: 't1', type: 'earned', label: 'Content earnings — "Thou Shalt Not Bomb"', amount: 570, date: '2 days ago' },
  { id: 't2', type: 'earned', label: 'Tip from Bishop Snortley', amount: 100, date: '3 days ago' },
  { id: 't3', type: 'spent', label: 'Holy Lottery entry', amount: -50, date: '5 days ago' },
  { id: 't4', type: 'earned', label: 'Content earnings — "Holy Roast: Bishop Edition"', amount: 345, date: '5 days ago' },
  { id: 't5', type: 'spent', label: 'Merch purchase — Sacred Hoodie', amount: -200, date: '1 week ago' },
  { id: 't6', type: 'earned', label: 'Rank-up bonus — Deacon milestone', amount: 250, date: '2 weeks ago' },
];

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>('security');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pwSaved, setPwSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSavePw = () => {
    if (newPw && newPw === confirmPw) {
      setPwSaved(true);
      setTimeout(() => { setPwSaved(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }, 2500);
    }
  };

  const handleCopyId = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/settings" className="flex items-center gap-1.5 text-xs font-600 hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
              <ArrowLeft size={13} />
              Settings
            </Link>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.25)', color: 'var(--primary)' }}>
              Account Settings
            </span>
          </div>
          <h1 className="text-hero-xl text-gold">Account & Security</h1>
          <p className="text-sm font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Manage your login, billing, connected accounts, and data.
          </p>
        </div>

        {/* Account ID Banner */}
        <div
          className="rounded-2xl border p-4 mb-6 flex items-center justify-between flex-wrap gap-3"
          style={{ background: 'rgba(78,160,192,0.06)', borderColor: 'rgba(78,160,192,0.25)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-800"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
            >
              DT
            </div>
            <div>
              <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>Deacon Thunderpants</p>
              <p className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)' }}>ID: tcolds-usr-8f3a2c1d</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-colors hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              {copied ? <CheckCircle2 size={12} style={{ color: '#52B788' }} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
            <Link
              href="/settings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-colors hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <Settings size={12} />
              Profile Settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar Tabs */}
          <div
            className="lg:col-span-1 rounded-2xl border overflow-hidden h-fit"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted border-b last:border-b-0"
                style={{
                  borderColor: 'var(--border)',
                  background: activeTab === tab.id ? 'rgba(139,26,26,0.1)' : 'transparent',
                  borderLeft: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: activeTab === tab.id ? 'rgba(139,26,26,0.2)' : 'var(--muted)',
                    border: `1px solid ${activeTab === tab.id ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <tab.icon size={14} style={{ color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                </div>
                <span className="text-sm font-700" style={{ color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {tab.label}
                </span>
                <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">

            {/* SECURITY */}
            {activeTab === 'security' && (
              <>
                {/* Change Password */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                    <Key size={15} style={{ color: 'var(--primary)' }} />
                    <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Change Password</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrentPw, toggle: setShowCurrentPw },
                      { label: 'New Password', value: newPw, set: setNewPw, show: showNewPw, toggle: setShowNewPw },
                      { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showNewPw, toggle: setShowNewPw },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.show ? 'text' : 'password'}
                            value={field.value}
                            onChange={(e) => field.set(e.target.value)}
                            className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm border outline-none transition-colors"
                            style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          />
                          <button
                            onClick={() => field.toggle(!field.show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {field.show ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {newPw && confirmPw && newPw !== confirmPw && (
                      <p className="flex items-center gap-1.5 text-xs" style={{ color: '#E07B39' }}>
                        <AlertTriangle size={11} />
                        Passwords do not match
                      </p>
                    )}
                    <button
                      onClick={handleSavePw}
                      disabled={!currentPw || !newPw || newPw !== confirmPw}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    >
                      {pwSaved ? <><Check size={14} /> Password Updated!</> : <><Lock size={14} /> Update Password</>}
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                    <Smartphone size={15} style={{ color: '#52B788' }} />
                    <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Two-Factor Authentication</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <p className="text-sm font-600" style={{ color: 'var(--foreground)' }}>
                          {twoFAEnabled ? '2FA is active — your account is blessed with extra protection' : 'Add an extra layer of holy protection'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                          Require a verification code from your phone when signing in.
                        </p>
                      </div>
                      <button
                        onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                        className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                        style={{ background: twoFAEnabled ? '#52B788' : 'var(--border)' }}
                      >
                        <span
                          className="absolute top-1 w-4 h-4 rounded-full transition-all duration-200"
                          style={{ background: 'white', left: twoFAEnabled ? '26px' : '4px' }}
                        />
                      </button>
                    </div>
                    {twoFAEnabled && (
                      <div
                        className="mt-4 p-3 rounded-xl flex items-center gap-2"
                        style={{ background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.3)' }}
                      >
                        <Check size={14} style={{ color: '#52B788' }} />
                        <p className="text-xs font-600" style={{ color: '#52B788' }}>2FA enabled via authenticator app</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <RefreshCw size={15} style={{ color: '#4EA0C0' }} />
                      <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Active Sessions</h2>
                    </div>
                    <button className="text-xs font-600 px-3 py-1 rounded-lg border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: '#E07B39' }}>
                      Sign Out All
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {[
                      { device: 'Chrome on macOS', location: 'Nashville, TN', time: 'Active now', current: true },
                      { device: 'Safari on iPhone 15', location: 'Nashville, TN', time: '2 hours ago', current: false },
                      { device: 'Firefox on Windows', location: 'Austin, TX', time: '3 days ago', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-3.5 gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: session.current ? 'rgba(82,183,136,0.15)' : 'var(--muted)', border: `1px solid ${session.current ? 'rgba(82,183,136,0.3)' : 'var(--border)'}` }}
                          >
                            <Smartphone size={13} style={{ color: session.current ? '#52B788' : 'var(--muted-foreground)' }} />
                          </div>
                          <div>
                            <p className="text-xs font-700" style={{ color: 'var(--foreground)' }}>
                              {session.device}
                              {session.current && <span className="ml-2 text-xs font-600 px-1.5 py-0.5 rounded" style={{ background: 'rgba(82,183,136,0.15)', color: '#52B788' }}>Current</span>}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{session.location} · {session.time}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <button className="text-xs font-600 px-2.5 py-1 rounded-lg border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* BILLING */}
            {activeTab === 'billing' && (
              <>
                {/* CC Balance */}
                <div
                  className="rounded-2xl border p-5"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(139,26,26,0.06) 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <CheddarCoinDisplay size={48} />
                      <div>
                        <p className="text-xs font-700 mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Cheddar Coin Balance</p>
                        <p className="text-3xl font-900 font-mono-data text-gold">8,240 CC</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>≈ $82.40 USD equivalent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/coin-ledger"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 border transition-all duration-150 hover:bg-muted"
                        style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
                      >
                        <ExternalLink size={13} />
                        Full Ledger
                      </Link>
                      <Link
                        href="/mint"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90"
                        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                      >
                        <Coins size={13} />
                        Mint CC
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Recent Transactions</h2>
                    <Link href="/coin-ledger" className="text-xs font-600" style={{ color: 'var(--primary)' }}>View All</Link>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {ccTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: tx.type === 'earned' ? 'rgba(82,183,136,0.15)' : 'rgba(224,123,57,0.15)',
                              border: `1px solid ${tx.type === 'earned' ? 'rgba(82,183,136,0.3)' : 'rgba(224,123,57,0.3)'}`,
                            }}
                          >
                            <Coins size={13} style={{ color: tx.type === 'earned' ? '#52B788' : '#E07B39' }} />
                          </div>
                          <div>
                            <p className="text-xs font-600 leading-snug" style={{ color: 'var(--foreground)' }}>{tx.label}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.date}</p>
                          </div>
                        </div>
                        <span
                          className="text-sm font-800 font-mono-data flex-shrink-0"
                          style={{ color: tx.type === 'earned' ? '#52B788' : '#E07B39' }}
                        >
                          {tx.amount > 0 ? '+' : ''}{tx.amount} CC
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscription */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Membership</h2>
                  </div>
                  <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid rgba(212,175,55,0.4)' }}
                      >
                        <Crown size={18} style={{ color: '#D4AF37' }} />
                      </div>
                      <div>
                        <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>Free Congregation Member</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Access to all public sermons & features</p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #E07B39)', color: '#000' }}
                    >
                      <Crown size={13} />
                      Upgrade to Bishop
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* CONNECTED ACCOUNTS */}
            {activeTab === 'connected' && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Connected Social Accounts</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Link your platforms to share sermons and grow your congregation</p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {connectedPlatforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between px-6 py-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-800 flex-shrink-0"
                          style={{ background: `${platform.color}18`, border: `1.5px solid ${platform.color}44` }}
                        >
                          {platform.icon}
                        </div>
                        <div>
                          <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>{platform.label}</p>
                          {platform.connected && platform.handle ? (
                            <p className="text-xs font-600" style={{ color: platform.color }}>{platform.handle}</p>
                          ) : (
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Not connected</p>
                          )}
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 border transition-all duration-150 hover:bg-muted"
                        style={{
                          borderColor: platform.connected ? 'var(--border)' : platform.color,
                          color: platform.connected ? 'var(--muted-foreground)' : platform.color,
                        }}
                      >
                        {platform.connected ? (
                          <><LogOut size={11} /> Disconnect</>
                        ) : (
                          <><ExternalLink size={11} /> Connect</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ background: 'rgba(78,160,192,0.08)', border: '1px solid rgba(78,160,192,0.2)' }}
                  >
                    <Mail size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#4EA0C0' }} />
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Connected accounts allow cross-posting your sermons and importing your existing audience. Your credentials are never stored.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DATA & PRIVACY */}
            {activeTab === 'data' && (
              <>
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Your Data</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Download or manage your TCoLDS data</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      { label: 'Download Your Data', desc: 'Export all your sermons, comments, and account info as a ZIP file', icon: Download, color: '#4EA0C0' },
                      { label: 'Email Notifications', desc: 'Receive weekly congregation updates via email', icon: Mail, color: '#52B788', toggle: true, state: emailNotifs, set: setEmailNotifs },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl border gap-4"
                        style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}
                          >
                            <item.icon size={14} style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                          </div>
                        </div>
                        {'toggle' in item && item.toggle ? (
                          <button
                            onClick={() => item.set && item.set(!item.state)}
                            className="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
                            style={{ background: item.state ? item.color : 'var(--border)' }}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                              style={{ background: 'white', left: item.state ? '22px' : '2px' }}
                            />
                          </button>
                        ) : (
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-colors hover:bg-muted flex-shrink-0"
                            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            <Download size={11} />
                            Export
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: 'rgba(224,123,57,0.04)', borderColor: 'rgba(224,123,57,0.3)' }}
                >
                  <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(224,123,57,0.3)' }}>
                    <AlertTriangle size={15} style={{ color: '#E07B39' }} />
                    <h2 className="font-700 text-sm" style={{ color: '#E07B39' }}>Danger Zone</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-700 mb-1" style={{ color: 'var(--foreground)' }}>Delete Account</p>
                      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                        Permanently delete your account, all sermons, CC balance, and congregation data. This cannot be undone.
                      </p>
                      <div className="space-y-2">
                        <label className="block text-xs font-700" style={{ color: 'var(--foreground)' }}>
                          Type <span className="font-mono-data" style={{ color: '#E07B39' }}>DELETE MY ACCOUNT</span> to confirm
                        </label>
                        <input
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder="DELETE MY ACCOUNT"
                          className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors"
                          style={{ background: 'var(--input)', borderColor: 'rgba(224,123,57,0.4)', color: 'var(--foreground)' }}
                        />
                        <button
                          disabled={deleteConfirm !== 'DELETE MY ACCOUNT'}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                          style={{ background: '#E07B39', color: 'white' }}
                        >
                          <Trash2 size={14} />
                          Delete My Account Forever
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
