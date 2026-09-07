'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Church, Crown, Star, Shield, Radio, BookOpen, Coins, User, ChevronRight, Sparkles, Clock, Users, LogIn, UserCheck, AlertTriangle, CheckCircle, Laugh, Trophy, Music, Zap, Gift } from 'lucide-react';

// Simulated invite data — in production this would be fetched from DB
interface InviteData {
  token: string;
  createdBy: string;
  createdByHandle: string;
  createdByRank: string;
  createdByInitials: string;
  createdByColor: string;
  expiresAt: number; // timestamp ms
  maxUses: number | null;
  usedCount: number;
  message: string;
  isValid: boolean;
}

function getInviteFromToken(token: string): InviteData | null {
  // In production: fetch from Supabase invite_links table
  // For demo: decode from localStorage or return mock
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`tcolds_invite_${token}`);
    if (stored) {
      try {
        return JSON.parse(stored) as InviteData;
      } catch {
        return null;
      }
    }
  }
  // Demo fallback for any token
  return {
    token,
    createdBy: 'Rev. Cacklesworth',
    createdByHandle: 'cacklesworth',
    createdByRank: 'Minister',
    createdByInitials: 'RC',
    createdByColor: '#52B788',
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
    maxUses: 50,
    usedCount: 12,
    message: 'Come join the holiest comedy congregation on the internet. Your punchlines are welcome here.',
    isValid: true,
  };
}

function formatTimeLeft(expiresAt: number): { label: string; urgent: boolean } {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return { label: 'Expired', urgent: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return { label: `${days}d ${hours % 24}h remaining`, urgent: days < 1 };
  if (hours > 0) return { label: `${hours}h remaining`, urgent: hours < 6 };
  const mins = Math.floor(diff / (1000 * 60));
  return { label: `${mins}m remaining`, urgent: true };
}

const rankTiers = [
  { rank: 'Saint', icon: Crown, color: '#D4AF37' },
  { rank: 'Cardinal', icon: Star, color: '#CC2222' },
  { rank: 'Archbishop', icon: Shield, color: '#A855F7' },
  { rank: 'Bishop', icon: Radio, color: '#38BDF8' },
  { rank: 'Minister', icon: BookOpen, color: '#52B788' },
  { rank: 'Deacon', icon: Coins, color: '#C9A227' },
  { rank: 'Layperson', icon: User, color: '#8A8070' },
];

const highlights = [
  { icon: Laugh, label: 'Live Comedy Masses', desc: 'Watch ordained clergy perform live sets' },
  { icon: Trophy, label: 'Holy Lottery', desc: 'Win 24-hour AI editing control' },
  { icon: Coins, label: 'Cheddar Coin Economy', desc: 'Earn CC, tithe, and trade' },
  { icon: Music, label: 'Sermon Slam Battles', desc: 'Head-to-head comedy tournaments' },
  { icon: Zap, label: 'Clergy Rank Progression', desc: 'Rise from Layperson to Saint' },
  { icon: Gift, label: 'Member Merchandise', desc: 'Earn 70% profit in Cheddar Coins' },
];

const liveStats = [
  { label: 'Ordained Clergy', value: '12,480', icon: BookOpen },
  { label: 'Active Now', value: '3,847', icon: Users },
  { label: 'CC in Circulation', value: '4.2M', icon: Coins },
  { label: 'Masses Held', value: '3,310', icon: Radio },
];

export default function InvitePage() {
  const params = useParams();
  const token = params?.token as string;
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ label: string; urgent: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const data = getInviteFromToken(token);
    setInvite(data);
    if (data) {
      const tl = formatTimeLeft(data.expiresAt);
      setTimeLeft(tl);
      setExpired(tl.label === 'Expired');
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!invite) return;
    const interval = setInterval(() => {
      const tl = formatTimeLeft(invite.expiresAt);
      setTimeLeft(tl);
      setExpired(tl.label === 'Expired');
    }, 30000);
    return () => clearInterval(interval);
  }, [invite]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)' }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Verifying your holy invitation...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(204,34,34,0.15)', border: '2px solid rgba(204,34,34,0.4)' }}>
            <AlertTriangle size={28} style={{ color: '#CC2222' }} />
          </div>
          <h1 className="text-xl font-800 mb-2">Invalid Invitation</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>This invite link doesn't exist or has been revoked by the congregation.</p>
          <Link href="/entrance" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700 gold-gradient" style={{ color: 'var(--primary-foreground)' }}>
            <Church size={14} />
            Visit the Entrance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b glass-card" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo size={28} />
            <div className="flex flex-col leading-none">
              <span className="font-sans font-800 text-sm tracking-tight text-gold">TCoLDS</span>
              <span className="text-xs hidden sm:block" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>Church of Laughterday Saints</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/members/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-all hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <LogIn size={12} />
              <span className="hidden sm:block">Member Login</span>
            </Link>
            <Link href="/sign-up-login-screen" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-700 gold-gradient" style={{ color: 'var(--primary-foreground)' }}>
              <UserCheck size={12} />
              Join Free
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-14">
        {/* Hero — Invite Banner */}
        <div
          className="relative overflow-hidden border-b"
          style={{
            background: 'linear-gradient(160deg, #0a0a0a 0%, #1a0800 50%, #0a0a1a 100%)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="absolute top-0 left-0 w-96 h-96 blob-gold opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 blob-crimson opacity-25 pointer-events-none" />

          <div className="relative max-w-screen-xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="max-w-2xl">
              {/* Invite badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.3)' }}>
                <Sparkles size={12} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-700 text-gold tracking-widest uppercase">Personal Invitation</span>
              </div>

              {/* Inviter info */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-800 flex-shrink-0"
                  style={{ background: `${invite.createdByColor}22`, color: invite.createdByColor, border: `2px solid ${invite.createdByColor}55` }}
                >
                  {invite.createdByInitials}
                </div>
                <div>
                  <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>
                    <span style={{ color: invite.createdByColor }}>{invite.createdBy}</span> invites you to join
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    @{invite.createdByHandle} · {invite.createdByRank} of TCoLDS
                  </p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-800 leading-tight mb-4">
                Enter the Church of<br />
                <span className="text-gold">Laughterday Saints</span>
              </h1>

              <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--muted-foreground)' }}>
                {invite.message}
              </p>

              {/* Expiry + uses */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-600"
                  style={{
                    background: expired ? 'rgba(204,34,34,0.1)' : timeLeft?.urgent ? 'rgba(224,123,57,0.1)' : 'rgba(82,183,136,0.1)',
                    borderColor: expired ? 'rgba(204,34,34,0.4)' : timeLeft?.urgent ? 'rgba(224,123,57,0.4)' : 'rgba(82,183,136,0.4)',
                    color: expired ? '#CC2222' : timeLeft?.urgent ? '#E07B39' : '#52B788',
                  }}
                >
                  <Clock size={12} />
                  {timeLeft?.label ?? 'Checking...'}
                </div>
                {invite.maxUses && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-600" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                    <Users size={12} />
                    {invite.usedCount} / {invite.maxUses} used
                  </div>
                )}
                {!expired && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-600" style={{ background: 'rgba(82,183,136,0.1)', borderColor: 'rgba(82,183,136,0.3)', color: '#52B788' }}>
                    <CheckCircle size={12} />
                    Invite Valid
                  </div>
                )}
              </div>

              {/* CTAs */}
              {!expired ? (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/sign-up-login-screen"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 gold-gradient"
                    style={{ color: 'var(--primary-foreground)' }}
                  >
                    <Church size={16} />
                    Join the Congregation
                  </Link>
                  <Link
                    href="/members/login"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 border transition-all duration-150 hover:bg-muted"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <LogIn size={16} />
                    Already a Member
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 border opacity-50 cursor-not-allowed" style={{ borderColor: 'rgba(204,34,34,0.4)', color: '#CC2222' }}>
                    <AlertTriangle size={16} />
                    This Invite Has Expired
                  </div>
                  <Link href="/entrance" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 border transition-all hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Church size={16} />
                    Visit Entrance
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {liveStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)' }}>
                    <stat.icon size={14} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p className="font-mono-data font-700 text-sm text-gold">{stat.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content — 2 column */}
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — Entrance Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Church size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-700 tracking-widest uppercase" style={{ color: 'var(--primary)' }}>The Entrance</span>
              </div>
              <h2 className="text-2xl font-800 mb-4">What awaits inside</h2>

              {/* Entrance preview card */}
              <div
                className="rounded-2xl border overflow-hidden mb-6"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {/* Fake entrance hero */}
                <div
                  className="relative p-6 border-b"
                  style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0800 60%, #0a0a1a 100%)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blob-gold opacity-20 pointer-events-none" />
                  <div className="relative flex items-center gap-3 mb-3">
                    <AppLogo size={36} />
                    <div>
                      <p className="font-800 text-base text-gold">TCoLDS</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>The Church of Laughterday Saints</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    The world's holiest comedy congregation. Live masses, ordained clergy, and the sacred Cheddar Coin economy.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600" style={{ background: 'rgba(204,34,34,0.15)', color: '#CC2222', border: '1px solid rgba(204,34,34,0.3)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      LIVE NOW
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Sunday Massacre Mass — 3,847 watching</span>
                  </div>
                </div>

                {/* Highlights grid */}
                <div className="p-4 grid grid-cols-2 gap-3">
                  {highlights.map((h) => (
                    <div key={h.label} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
                        <h.icon size={13} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-700" style={{ color: 'var(--foreground)' }}>{h.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clergy hierarchy */}
              <div className="rounded-2xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-xs font-700 mb-3 tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>The Clergy Hierarchy</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {rankTiers.map((tier, idx) => (
                    <React.Fragment key={`rank-${tier.rank}`}>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-default"
                        style={{ background: `${tier.color}22`, border: `1px solid ${tier.color}55` }}
                        title={tier.rank}
                      >
                        <tier.icon size={15} style={{ color: tier.color }} />
                      </div>
                      {idx < rankTiers.length - 1 && (
                        <ChevronRight size={10} style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                  Layperson → Saint. Every joke counts toward your ordination.
                </p>
              </div>
            </div>

            {/* Right — Login / Signup preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LogIn size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-700 tracking-widest uppercase" style={{ color: 'var(--primary)' }}>Join the Congregation</span>
              </div>
              <h2 className="text-2xl font-800 mb-4">Create your account</h2>

              {/* Login preview card */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-800 mb-1">Enter the Church</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Create your free account and start your ordination journey.
                    </p>
                  </div>

                  {/* Form preview */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-600" style={{ color: 'var(--foreground)' }}>Your Name</label>
                      <div className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--input)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                        e.g. Rev. Gigglesworth
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-600" style={{ color: 'var(--foreground)' }}>Email Address</label>
                      <div className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--input)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                        reverend@tcolds.org
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-600" style={{ color: 'var(--foreground)' }}>Password</label>
                      <div className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--input)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                        ••••••••••••
                      </div>
                    </div>

                    <Link
                      href="/sign-up-login-screen"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 gold-gradient"
                      style={{ color: 'var(--primary-foreground)' }}
                    >
                      <Church size={15} />
                      Join the Congregation — It's Free
                    </Link>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>already ordained?</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    </div>

                    <Link
                      href="/members/login"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-700 text-sm border transition-all duration-150 hover:bg-muted"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      <LogIn size={15} />
                      Member Login
                    </Link>
                  </div>
                </div>

                {/* Perks footer */}
                <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
                  <p className="text-xs font-700 mb-2" style={{ color: 'var(--foreground)' }}>What you get as a member:</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      'Full access to all Masses, Sermons & Basement content',
                      'Earn Cheddar Coins for every laugh you generate',
                      'Climb the clergy ladder from Layperson to Saint',
                      'Enter the Holy Lottery for AI editing control',
                      'Sell your own merch and earn 70% in CC',
                    ].map((perk, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle size={11} className="mt-0.5 flex-shrink-0" style={{ color: '#52B788' }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invite note */}
              <div
                className="mt-4 rounded-xl border p-3 flex items-start gap-3"
                style={{ background: 'rgba(212,175,55,0.05)', borderColor: 'rgba(212,175,55,0.25)' }}
              >
                <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  You were personally invited by <span className="font-700" style={{ color: invite.createdByColor }}>{invite.createdBy}</span>. This link is valid for a limited time — join now to secure your spot in the congregation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t py-6" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AppLogo size={20} />
              <span className="text-xs font-700 text-gold">TCoLDS</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· The Church of Laughterday Saints</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/entrance" className="text-xs hover:underline" style={{ color: 'var(--muted-foreground)' }}>Entrance</Link>
              <Link href="/members/login" className="text-xs hover:underline" style={{ color: 'var(--muted-foreground)' }}>Members</Link>
              <Link href="/" className="text-xs hover:underline" style={{ color: 'var(--muted-foreground)' }}>The Pulpit</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
