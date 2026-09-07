'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';
import {
  Flame,
  Radio,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogIn,
  Church,
  Leaf,
  Upload,
  Users,
  UserCheck,
  Circle,
  TrendingUp,
  Heart,
  ShoppingBag,
  Link2,
  HandHeart,
  Crown,
  LayoutDashboard,
  Settings,
  Coins,
  Share2,
  CloudUpload,
  UserCog,
  Edit3,
  MoreHorizontal,
  Printer,
} from 'lucide-react';
import GuestRegistryModal, {
  getGuestSigninCount,
  incrementGuestSignin,
  isGuestRegistered,
  getGuestName,
  GUEST_MAX_SIGNINS,
} from '@/components/GuestRegistryModal';
import NotificationsCenter from '@/components/NotificationsCenter';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Entrance', href: '/entrance', icon: Church },
  { label: 'The Pulpit', href: '/pulpit', icon: Flame },
  { label: 'The Basement', href: '/basement', icon: Moon },
  { label: 'Green Room', href: '/green-room', icon: Leaf },
  { label: 'Live Mass', href: '/green-room', icon: Radio },
  { label: 'Submit', href: '/submit', icon: Upload },
];

const moreNavItems = [
  { label: 'Giveback', href: '/giveback', icon: HandHeart, color: '#52B788' },
  { label: 'Lore', href: '/lore', icon: Crown, color: '#7B4EA0' },
  { label: 'Coin Ledger', href: '/coin-ledger', icon: TrendingUp, color: '#D4AF37' },
  { label: 'Heckler Award', href: '/heckler-award', icon: Flame, color: '#FF4444' },
  { label: 'Share', href: '/share', icon: Share2, color: '#52B788' },
  { label: 'Print Materials', href: '/print-materials', icon: Printer, color: '#D4AF37' },
  { label: 'Settings', href: '/settings', icon: Settings, color: 'var(--muted-foreground)' },
  { label: 'Account', href: '/account-settings', icon: UserCog, color: 'var(--muted-foreground)' },
];

const activeFriends = [
  { id: 'f1', name: 'Rev. Cacklesworth', handle: 'cacklesworth', initials: 'RC', color: '#52B788', rank: 'Minister', online: true },
  { id: 'f2', name: 'Bishop Snortley', handle: 'snortley', initials: 'BS', color: '#D4AF37', rank: 'Bishop', online: true },
  { id: 'f3', name: 'Deacon Wheezington', handle: 'wheezington', initials: 'DW', color: '#7B4EA0', rank: 'Deacon', online: true },
  { id: 'f4', name: 'Pastor Gigglesworth', handle: 'gigglesworth', initials: 'PG', color: '#4EA0C0', rank: 'Pastor', online: false },
];

const trendingComedians = [
  { id: 't1', name: 'Archbishop Thunderpants', handle: 'thunderpants', initials: 'AT', color: '#E07B39', rank: 'Archbishop', likes: '142K', trending: true },
  { id: 't2', name: 'Rev. Punchline McGee', handle: 'punchlinemcgee', initials: 'PM', color: '#D4AF37', rank: 'Reverend', likes: '98K', trending: true },
  { id: 't3', name: 'Sister Snickerdoodle', handle: 'snickerdoodle', initials: 'SS', color: '#52B788', rank: 'Sister', likes: '76K', trending: false },
  { id: 't4', name: 'Friar Tuck-and-Roll', handle: 'tucknroll', initials: 'FT', color: '#7B4EA0', rank: 'Friar', likes: '61K', trending: false },
];

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [mobileMembersOpen, setMobileMembersOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestModalMode, setGuestModalMode] = useState<'registry' | 'limit_reached' | 'action_gate'>('registry');
  const [guestName, setGuestName] = useState('');
  const [signinCount, setSigninCount] = useState(0);
  const membersRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Derive display initials from auth user
  const userInitials = user
    ? (user.user_metadata?.full_name
        ? user.user_metadata.full_name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : user.email?.slice(0, 2).toUpperCase() ?? 'ME')
    : null;

  useEffect(() => {
    setSigninCount(getGuestSigninCount());
    if (isGuestRegistered()) {
      setGuestName(getGuestName());
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (membersRef.current && !membersRef.current.contains(e.target as Node)) {
        setMembersOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGuestLogin = () => {
    const count = getGuestSigninCount();
    if (count >= GUEST_MAX_SIGNINS) {
      setGuestModalMode('limit_reached');
      setGuestModalOpen(true);
      return;
    }
    if (isGuestRegistered()) {
      const newCount = incrementGuestSignin();
      setSigninCount(newCount);
      setGuestName(getGuestName());
      return;
    }
    setGuestModalMode('registry');
    setGuestModalOpen(true);
  };

  const handleGuestSuccess = (name: string) => {
    const newCount = incrementGuestSignin();
    setSigninCount(newCount);
    setGuestName(name);
  };

  const remainingGuest = Math.max(0, GUEST_MAX_SIGNINS - signinCount);

  return (
    <>
      <GuestRegistryModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        mode={guestModalMode}
        onSuccess={handleGuestSuccess}
      />

      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b glass-card"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between px-4 lg:px-6 gap-2">
          {/* Logo → Merchandise */}
          <Link href="/merchandise" className="flex items-center gap-2 flex-shrink-0">
            <AppLogo size={32} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-sans font-800 text-sm tracking-tight text-gold">
                TCoLDS
              </span>
              <span
                className="text-xs font-500"
                style={{ color: 'var(--foreground)', fontSize: '11px', opacity: 0.85 }}
              >
                Church of Laughterday Saints
              </span>
            </div>
          </Link>

          {/* Center Nav — lean set of primary links */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
            {/* Entrance — highlighted */}
            <Link
              href="/entrance"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
              style={{ color: 'var(--primary)', fontWeight: 700, border: '1px solid var(--primary)' }}
            >
              <Church size={13} />
              Entrance
            </Link>

            {/* Members — dropdown trigger */}
            <div className="relative" ref={membersRef}>
              <button
                onClick={() => setMembersOpen(!membersOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
                style={{ color: 'var(--foreground)', fontWeight: 700 }}
              >
                <Users size={13} />
                Members
                <ChevronDown
                  size={11}
                  className="transition-transform duration-200"
                  style={{ transform: membersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Members Dropdown Panel */}
              {membersOpen && (
                <div
                  className="absolute left-0 top-10 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  {/* Active Friends */}
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-700 flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                        <Circle size={8} fill="#52B788" stroke="none" />
                        Friends Active Now
                      </p>
                      <Link
                        href="/members/login"
                        className="text-xs font-600"
                        style={{ color: 'var(--primary)' }}
                        onClick={() => setMembersOpen(false)}
                      >
                        View All
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {activeFriends.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        >
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700"
                              style={{ background: `${f.color}22`, color: f.color, border: `1.5px solid ${f.color}55` }}
                            >
                              {f.initials}
                            </div>
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                              style={{
                                background: f.online ? '#52B788' : 'var(--muted-foreground)',
                                borderColor: 'var(--card)',
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>{f.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{f.rank}</p>
                          </div>
                          {f.online && (
                            <span className="text-xs font-600" style={{ color: '#52B788', fontSize: '10px' }}>Active</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Comedians */}
                  <div className="p-3">
                    <p className="text-xs font-700 flex items-center gap-1.5 mb-2" style={{ color: 'var(--foreground)' }}>
                      <TrendingUp size={11} style={{ color: 'var(--primary)' }} />
                      Most Liked &amp; Trending
                    </p>
                    <div className="space-y-1">
                      {trendingComedians.map((c, idx) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        >
                          <span
                            className="w-4 text-center text-xs font-800 font-mono-data flex-shrink-0"
                            style={{ color: idx === 0 ? '#D4AF37' : 'var(--muted-foreground)' }}
                          >
                            #{idx + 1}
                          </span>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                            style={{ background: `${c.color}22`, color: c.color, border: `1.5px solid ${c.color}55` }}
                          >
                            {c.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.rank}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Heart size={10} style={{ color: 'var(--secondary)' }} />
                            <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.likes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link
                      href="/members/login"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-700 transition-all duration-150 hover:opacity-90"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                      onClick={() => setMembersOpen(false)}
                    >
                      <LogIn size={12} />
                      Member Login
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Core nav items (Pulpit, Basement, Green Room) */}
            {navItems.slice(1, 4).map((item) => (
              <Link
                key={`nav-${item.label}`}
                href={item.href}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
                style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              >
                <item.icon size={13} />
                {item.label}
              </Link>
            ))}

            {/* Creator Studio */}
            <Link
              href="/creator-dashboard"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
              style={{ color: '#4EA0C0', fontWeight: 600 }}
            >
              <LayoutDashboard size={13} />
              Studio
            </Link>

            {/* Upload Studio */}
            <Link
              href="/upload-studio"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
              style={{ color: '#E07B39', fontWeight: 600 }}
            >
              <CloudUpload size={13} />
              Upload
            </Link>

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
                style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              >
                <MoreHorizontal size={13} />
                More
                <ChevronDown
                  size={11}
                  className="transition-transform duration-200"
                  style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {moreOpen && (
                <div
                  className="absolute left-0 top-10 w-48 rounded-xl border shadow-2xl z-50 overflow-hidden py-1"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted transition-colors"
                      style={{ color: item.color, fontWeight: 600 }}
                      onClick={() => setMoreOpen(false)}
                    >
                      <item.icon size={13} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Search */}
            <button
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 hover:bg-muted"
              style={{
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)',
              }}
            >
              <Search size={14} />
              <span className="hidden xl:block">Search sermons...</span>
              <span
                className="hidden xl:block text-xs font-mono px-1 rounded"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                ⌘K
              </span>
            </button>

            {/* Cheddar Coin Balance */}
            <button
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted border"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              <CheddarCoinDisplay size={18} />
              <span className="font-mono-data hidden md:block">1,240</span>
              <span className="text-xs hidden md:block" style={{ color: 'var(--muted-foreground)' }}>
                CC
              </span>
            </button>

            {/* Mint Coins icon button — after Upload/CC */}
            <Link
              href="/mint"
              className="hidden sm:flex items-center justify-center p-2 rounded-lg transition-all duration-150 hover:bg-muted border"
              style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
              title="Mint Coins"
            >
              <Coins size={16} />
            </Link>

            {/* Guest Login Button */}
            {!guestName ? (
              <button
                onClick={handleGuestLogin}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                title={`Guest access — ${remainingGuest} sign-ins remaining`}
              >
                <UserCheck size={14} />
                <span className="hidden lg:block">Guest</span>
              </button>
            ) : (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-600 border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                title={`Signed in as guest: ${guestName} — ${remainingGuest} sign-ins remaining`}
              >
                <UserCheck size={14} style={{ color: '#52B788' }} />
                <span className="hidden lg:block text-xs" style={{ color: '#52B788' }}>
                  {guestName.split(' ')[0]}
                </span>
                <span
                  className="hidden xl:block text-xs font-mono-data px-1 rounded"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: '10px' }}
                >
                  {remainingGuest} left
                </span>
              </div>
            )}

            {/* Merch shortcut */}
            <Link
              href="/merchandise"
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              title="Member Merchandise"
            >
              <ShoppingBag size={14} />
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg transition-all duration-150 hover:bg-muted"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <Bell size={18} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: 'var(--secondary)' }}
                />
              </button>
              <NotificationsCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Profile avatar — links to profile-editor when logged in, sign-up page when logged out */}
            {user ? (
              <div className="flex items-center gap-1">
                <Link href="/profile-editor" className="flex items-center gap-1 group" title="Your Profile">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 transition-all duration-150 group-hover:ring-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {userInitials}
                  </div>
                </Link>
                <Link
                  href="/members/home"
                  className="hidden sm:flex p-1.5 rounded-lg hover:bg-muted transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="My Homepage"
                >
                  <Edit3 size={14} />
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-up-login-screen"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-700 transition-all duration-150 hover:opacity-90"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <LogIn size={14} />
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-muted"
              style={{ color: 'var(--muted-foreground)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Link
              href="/entrance"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: 'var(--primary)', fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              <Church size={16} />
              Entrance
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-600"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Start Here
              </span>
            </Link>

            {/* Members — expandable inline panel */}
            <div>
              <button
                onClick={() => setMobileMembersOpen(!mobileMembersOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                style={{ color: 'var(--foreground)', fontWeight: 700 }}
              >
                <Users size={16} />
                Members
                <ChevronDown
                  size={14}
                  className="ml-auto transition-transform duration-200"
                  style={{ transform: mobileMembersOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--muted-foreground)' }}
                />
              </button>
              {mobileMembersOpen && (
                <div className="mx-4 mb-2 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
                  {/* Active Friends */}
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-700 flex items-center gap-1.5 mb-2" style={{ color: 'var(--foreground)' }}>
                      <Circle size={8} fill="#52B788" stroke="none" />
                      Friends Active Now
                    </p>
                    <div className="space-y-1">
                      {activeFriends.map((f) => (
                        <div key={f.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700"
                              style={{ background: `${f.color}22`, color: f.color, border: `1.5px solid ${f.color}55` }}
                            >
                              {f.initials}
                            </div>
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                              style={{ background: f.online ? '#52B788' : 'var(--muted-foreground)', borderColor: 'var(--card)' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>{f.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{f.rank}</p>
                          </div>
                          {f.online && <span className="text-xs font-600" style={{ color: '#52B788', fontSize: '10px' }}>Active</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Trending Comedians */}
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-700 flex items-center gap-1.5 mb-2" style={{ color: 'var(--foreground)' }}>
                      <TrendingUp size={11} style={{ color: 'var(--primary)' }} />
                      Most Liked &amp; Trending
                    </p>
                    <div className="space-y-1">
                      {trendingComedians.map((c, idx) => (
                        <div key={c.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <span className="w-4 text-center text-xs font-800 font-mono-data flex-shrink-0" style={{ color: idx === 0 ? '#D4AF37' : 'var(--muted-foreground)' }}>
                            #{idx + 1}
                          </span>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                            style={{ background: `${c.color}22`, color: c.color, border: `1.5px solid ${c.color}55` }}
                          >
                            {c.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.rank}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Heart size={10} style={{ color: 'var(--secondary)' }} />
                            <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.likes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Login CTA */}
                  <div className="p-3">
                    <Link
                      href="/members/login"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-700 transition-all duration-150 hover:opacity-90"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn size={12} />
                      Member Login
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={`mobile-nav-${item.label}`}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <Link
              href="/merchandise"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingBag size={16} />
              Merchandise
            </Link>
            {/* Giveback mobile link */}
            <Link
              href="/giveback"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#52B788', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <HandHeart size={16} />
              Giveback
            </Link>
            {/* Lore & Elections mobile link */}
            <Link
              href="/lore"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#7B4EA0', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <Crown size={16} />
              Lore &amp; Elections
            </Link>
            {/* Creator Dashboard mobile link */}
            <Link
              href="/creator-dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#4EA0C0', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={16} />
              Creator Studio
            </Link>
            {/* Upload Studio mobile link */}
            <Link
              href="/upload-studio"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#E07B39', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <CloudUpload size={16} />
              Upload Studio
            </Link>
            {/* Mint mobile link */}
            <Link
              href="/mint"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#D4AF37', fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              <Coins size={16} />
              Mint Your Coin
            </Link>
            {/* Coin Ledger mobile link */}
            <Link
              href="/coin-ledger"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#D4AF37', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <TrendingUp size={16} />
              Coin Ledger
            </Link>
            {/* Heckler Award mobile link */}
            <Link
              href="/heckler-award"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#FF4444', fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              <Flame size={16} />
              Most Savage Heckler
            </Link>
            {/* Settings mobile link */}
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              onClick={() => setMobileOpen(false)}
            >
              <Settings size={16} />
              Settings
            </Link>
            {/* Account Settings mobile link */}
            <Link
              href="/account-settings"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              onClick={() => setMobileOpen(false)}
            >
              <UserCog size={16} />
              Account Settings
            </Link>
            {/* Share mobile link */}
            <Link
              href="/share"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#52B788', fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              <Share2 size={16} />
              Share TCoLDS
            </Link>
            {/* Invite link in mobile menu */}
            <Link
              href="/members/home"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
              style={{ color: '#D4AF37', fontWeight: 600 }}
              onClick={() => setMobileOpen(false)}
            >
              <Link2 size={16} />
              Share Invite Link
            </Link>
            <div className="px-4 py-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
              {/* CC Balance row */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                <CheddarCoinDisplay size={20} />
                <span className="font-mono-data font-700 text-sm">1,240</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>CC</span>
                <span className="ml-auto text-xs font-600" style={{ color: '#D4AF37' }}>CC</span>
              </div>
              {user ? (
                <>
                  <Link
                    href="/members/home"
                    className="flex items-center gap-2 text-sm font-600 py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                    style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserCheck size={14} style={{ color: '#52B788' }} />
                    My Homepage
                  </Link>
                  <Link
                    href="/profile-editor"
                    className="flex items-center gap-2 text-sm font-600 py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                    style={{ color: '#D4AF37', border: '1px solid var(--border)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </Link>
                  <button
                    onClick={async () => { await signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 text-sm font-600 py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                    style={{ color: 'var(--secondary)', border: '1px solid var(--border)' }}
                  >
                    <LogIn size={14} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { handleGuestLogin(); setMobileOpen(false); }}
                    className="flex items-center gap-2 text-sm font-600 py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                    style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}
                  >
                    <UserCheck size={14} />
                    {guestName ? `Guest: ${guestName} (${remainingGuest} left)` : 'Continue as Guest'}
                  </button>
                  <Link
                    href="/sign-up-login-screen"
                    className="flex items-center gap-2 text-sm font-600 py-2 px-3 rounded-lg"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn size={14} />
                    Join the Congregation
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}