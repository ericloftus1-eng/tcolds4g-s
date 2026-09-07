'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import MembersSidebar from '../members/home/components/MembersSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, Moon, Bookmark, MoreHorizontal, MessageCircle, Share2, Plus, Megaphone, Star, Zap, ChevronDown, Radio, Users, AlertTriangle, UserCheck } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';
import GuestRegistryModal, {
  getGuestSigninCount,
  incrementGuestSignin,
  isGuestRegistered,
  getGuestName,
  GUEST_MAX_SIGNINS,
} from '@/components/GuestRegistryModal';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────────────────────────
interface FeedPost {
  id: string;
  type: 'post' | 'ad' | 'platform';
  author: string;
  handle: string;
  rank: ClergryRank;
  initials: string;
  avatarColor: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  tag?: string;
  tagColor?: string;
  isPlatform?: boolean;
  adTitle?: string;
  adCta?: string;
  adHref?: string;
  weight: number;
}

// ── Feed Pool — regular jokes, no religious material ───────────────────────
const feedPool: FeedPost[] = [
  {
    id: 'p1', type: 'post', author: 'Chuckles McSacrilege', handle: 'chucklesmcsac',
    rank: 'Cardinal', initials: 'CC', avatarColor: '#CC2222', timeAgo: '12m ago',
    content: 'Just told my therapist I process trauma through comedy. She laughed. Then cried. Then laughed again. I think I cured her. You\'re welcome, science.',
    likes: 4821, comments: 312, shares: 891, tag: 'Therapy', tagColor: '#CC2222', weight: 95,
  },
  {
    id: 'p2', type: 'post', author: 'Raucous Thunderpants', handle: 'thunderpants',
    rank: 'Archbishop', initials: 'AT', avatarColor: '#A855F7', timeAgo: '34m ago',
    content: 'Open mic audience rules I wish I could enforce: 1. No checking your phone during the punchline. 2. No explaining the joke to your date. 3. No bringing a baby to a dark comedy show. 4. No heckling unless you\'re funnier than me. Nobody has passed rule 4 yet.',
    likes: 9204, comments: 847, shares: 2103, tag: 'Open Mic', tagColor: '#A855F7', weight: 100,
  },
  {
    id: 'p3', type: 'post', author: 'Sister Sinful', handle: 'sistersinful',
    rank: 'Bishop', initials: 'SS', avatarColor: '#38BDF8', timeAgo: '1h ago',
    content: 'Hot take: therapy is just stand-up comedy where only one person is performing and the other one is legally required to laugh. Except they don\'t laugh. They just say "and how does that make you feel?" Same energy though.',
    likes: 6630, comments: 521, shares: 1440, tag: 'Hot Take', tagColor: '#38BDF8', weight: 88,
  },
  {
    id: 'p4', type: 'post', author: 'Deacon Punchline', handle: 'deaconpunch',
    rank: 'Deacon', initials: 'DP', avatarColor: '#C9A227', timeAgo: '2h ago',
    content: 'My dating profile says I\'m "6 feet tall in personality." I\'m 5\'7". I have been on zero dates. The algorithm is working as intended.',
    likes: 2910, comments: 188, shares: 604, tag: 'Dating', tagColor: '#C9A227', weight: 72,
  },
  {
    id: 'p5', type: 'post', author: 'Padre Punchworthy', handle: 'padrepunch',
    rank: 'Minister', initials: 'PP', avatarColor: '#D4AF37', timeAgo: '5h ago',
    content: 'My GPS has trust issues. Every time I make a wrong turn it says "recalculating" like it\'s disappointed in me. Same energy as my dad. At least the GPS doesn\'t bring it up at dinner.',
    likes: 5512, comments: 402, shares: 1230, tag: 'Observational', tagColor: '#D4AF37', weight: 91,
  },
  {
    id: 'p6', type: 'post', author: 'Nervously Nolan', handle: 'nervousnolan',
    rank: 'Layperson', initials: 'NN', avatarColor: '#8A8070', timeAgo: '6h ago',
    content: 'First open mic update: I told three jokes. Two people laughed. One was my mom. She was on her phone. I think she was laughing at something else. I\'m fine. I\'m totally fine. Please send Cheddar Coins.',
    likes: 3201, comments: 287, shares: 712, tag: 'Rookie Report', tagColor: '#8A8070', weight: 80,
  },
  {
    id: 'p7', type: 'post', author: 'Bishop Snortley', handle: 'snortley',
    rank: 'Bishop', initials: 'BS', avatarColor: '#D4AF37', timeAgo: '8h ago',
    content: 'Comedy tip #47: If the audience isn\'t laughing, just say "that was a test" and move on. Works every time. Except when it doesn\'t. Which is most of the time. But the confidence sells it.',
    likes: 1847, comments: 143, shares: 389, tag: 'Pro Tip', tagColor: '#D4AF37', weight: 68,
  },
  {
    id: 'p8', type: 'post', author: 'Rev. Cacklesworth', handle: 'cacklesworth',
    rank: 'Minister', initials: 'RC', avatarColor: '#52B788', timeAgo: '10h ago',
    content: 'My set bombed so hard last night that the venue\'s Yelp review now says "great acoustics for the sound of silence." I\'m framing it. It\'s art.',
    likes: 1847, comments: 143, shares: 389, tag: 'Field Report', tagColor: '#52B788', weight: 75,
  },
  {
    id: 'p9', type: 'post', author: 'Cardinal Snickerdoodle', handle: 'snickerdoodle',
    rank: 'Cardinal', initials: 'CS', avatarColor: '#52B788', timeAgo: '12h ago',
    content: 'Crowd work is just improv therapy for people who didn\'t ask for it. And I am their unlicensed therapist. You\'re welcome, front row. Your insurance doesn\'t cover this but your dignity might not survive it.',
    likes: 3890, comments: 267, shares: 820, tag: 'Crowd Work', tagColor: '#52B788', weight: 83,
  },
  {
    id: 'p10', type: 'post', author: 'Deacon Wheezington', handle: 'wheezington',
    rank: 'Deacon', initials: 'DW', avatarColor: '#4EA0C0', timeAgo: '1d ago',
    content: 'The difference between a comedian and a prophet: one predicts the future, the other just makes fun of the present. I\'m both. Neither. I don\'t know. I\'m tired. Someone bring me a drink.',
    likes: 2340, comments: 198, shares: 510, tag: 'Philosophy', tagColor: '#4EA0C0', weight: 70,
  },
  {
    id: 'p11', type: 'post', author: 'Filthy McNasty', handle: 'filthydirty',
    rank: 'Bishop', initials: 'FM', avatarColor: '#E07B39', timeAgo: '14h ago',
    content: 'My ex texted me "I miss you." I replied "Your aim will improve with practice." She did not find this funny. I found it hilarious. We are not the same.',
    likes: 7821, comments: 634, shares: 1890, tag: 'Dark', tagColor: '#E07B39', weight: 86,
  },
  {
    id: 'p12', type: 'post', author: 'Baroness Bawdy', handle: 'baronessbawdy',
    rank: 'Minister', initials: 'BB', avatarColor: '#FF4488', timeAgo: '18h ago',
    content: 'I asked my doctor if it was normal to talk to yourself. He said "only if you don\'t answer back." I said "what if the answer is funnier than the question?" He referred me to a specialist. The specialist was a comedy club.',
    likes: 4102, comments: 318, shares: 890, tag: 'Self-Deprecating', tagColor: '#FF4488', weight: 79,
  },
  // Platform announcements
  {
    id: 'plat1', type: 'platform', author: 'TCoLDS Official', handle: 'tcolds',
    rank: 'Saint', initials: '🎭', avatarColor: '#D4AF37', timeAgo: '2h ago',
    content: '🎉 COMMUNITY ANNOUNCEMENT: The Sainthood Trials are back! Top 10 comedians this month will compete in a live roast battle for the ultimate rank. Submit your best material to enter. May the funniest soul ascend. 🏆',
    likes: 12400, comments: 1203, shares: 4500, tag: 'Platform News', tagColor: '#D4AF37', isPlatform: true, weight: 99,
  },
  {
    id: 'plat2', type: 'platform', author: 'TCoLDS Official', handle: 'tcolds',
    rank: 'Saint', initials: '🎭', avatarColor: '#D4AF37', timeAgo: '1d ago',
    content: '🧀 NEW FEATURE: Cheddar Coin Tithe-a-Thon is LIVE! Every post you make this week earns double CC. The community is watching. Post louder. Earn holier.',
    likes: 8900, comments: 890, shares: 3200, tag: 'Feature Drop', tagColor: '#52B788', isPlatform: true, weight: 97,
  },
  // Ads
  {
    id: 'ad1', type: 'ad', author: 'TCoLDS Merch', handle: 'tcolds_merch',
    rank: 'Layperson', initials: '🛍️', avatarColor: '#D4AF37', timeAgo: 'Sponsored',
    content: 'New merch just dropped. "No Comedy Is Bad Comedy" tees, hoodies, and the legendary Cheddar Coin enamel pin. Limited run.',
    likes: 0, comments: 0, shares: 0, adTitle: 'TCoLDS Merch Drop', adCta: 'Shop Now', adHref: '/merchandise', weight: 0,
  },
];

function buildFeed(tab: string): FeedPost[] {
  const pool = [...feedPool];
  let filtered = pool.filter((p) => {
    if (tab === 'mass') return p.rank === 'Archbishop' || p.rank === 'Cardinal' || p.isPlatform;
    if (tab === 'basement') return p.tag === 'Hot Take' || p.tag === 'Dark' || p.tag === 'Self-Deprecating';
    if (tab === 'following') return ['cacklesworth', 'thunderpants', 'snickerdoodle'].includes(p.handle);
    return true;
  });

  filtered.sort((a, b) => {
    const aScore = a.weight + (a.likes / 1000) + Math.random() * 10;
    const bScore = b.weight + (b.likes / 1000) + Math.random() * 10;
    return bScore - aScore;
  });

  const ads = feedPool.filter((p) => p.type === 'ad');
  const result: FeedPost[] = [];
  let adIdx = 0;
  filtered.forEach((post, i) => {
    result.push(post);
    if ((i + 1) % 5 === 0 && adIdx < ads.length) {
      result.push(ads[adIdx % ads.length]);
      adIdx++;
    }
  });

  return result;
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const feedTabs = [
  { id: 'all', label: 'For You', icon: Flame },
  { id: 'mass', label: 'Mass', icon: Radio },
  { id: 'basement', label: 'Basement', icon: Moon },
  { id: 'following', label: 'Following', icon: Users },
];

// ── Post Card ──────────────────────────────────────────────────────────────
function PostCard({ post, liked, saved, onLike, onSave }: {
  post: FeedPost; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void;
}) {
  if (post.type === 'ad') {
    return (
      <div
        className="rounded-2xl border p-4 sm:p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1200 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-600 px-2 py-0.5 rounded-full border" style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)' }}>
            <Megaphone size={10} className="inline mr-1" />Sponsored
          </span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${post.avatarColor}22`, border: `1px solid ${post.avatarColor}44` }}>
            {post.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 mb-0.5 text-gold">{post.adTitle}</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>{post.content}</p>
            <Link href={post.adHref || '/'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-700 transition-all duration-150 hover:opacity-90" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              {post.adCta} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      className="rounded-2xl border p-4 sm:p-5 transition-all duration-200"
      style={{
        background: post.isPlatform ? 'linear-gradient(135deg, #141414 0%, #1a1200 100%)' : 'var(--card)',
        borderColor: post.isPlatform ? 'rgba(212,175,55,0.4)' : 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0" style={{ background: `${post.avatarColor}22`, color: post.avatarColor, border: `1.5px solid ${post.avatarColor}55` }}>
            {post.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-700 truncate">{post.author}</span>
              {post.isPlatform && <Star size={12} style={{ color: '#D4AF37' }} fill="#D4AF37" />}
              <ClergryRankBadge rank={post.rank} size="sm" showIcon={false} />
              {post.tag && (
                <span className="text-xs px-2 py-0.5 rounded-full font-600 hidden sm:inline" style={{ background: `${post.tagColor}22`, color: post.tagColor, border: `1px solid ${post.tagColor}44` }}>
                  {post.tag}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>@{post.handle} · {post.timeAgo}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
          <MoreHorizontal size={15} />
        </button>
      </div>

      {post.tag && (
        <span className="sm:hidden inline-block text-xs px-2 py-0.5 rounded-full font-600 mb-2" style={{ background: `${post.tagColor}22`, color: post.tagColor, border: `1px solid ${post.tagColor}44` }}>
          {post.tag}
        </span>
      )}

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>{post.content}</p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={onLike} className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95" style={{ color: liked ? '#CC2222' : 'var(--muted-foreground)' }}>
            <Flame size={14} fill={liked ? '#CC2222' : 'none'} />
            <span>{formatNum(post.likes + (liked ? 1 : 0))}</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95" style={{ color: 'var(--muted-foreground)' }}>
            <MessageCircle size={14} />
            <span>{formatNum(post.comments)}</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95" style={{ color: 'var(--muted-foreground)' }}>
            <Share2 size={14} />
            <span className="hidden sm:inline">{formatNum(post.shares)}</span>
          </button>
        </div>
        <button onClick={onSave} className="p-1.5 rounded-lg transition-all duration-150 hover:bg-muted active:scale-95" style={{ color: saved ? 'var(--primary)' : 'var(--muted-foreground)' }}>
          <Bookmark size={14} fill={saved ? 'var(--primary)' : 'none'} />
        </button>
      </div>
    </article>
  );
}

// ── New Post Box ───────────────────────────────────────────────────────────
function NewPostBox({
  onPost, memberInitials, memberColor, isGuest, guestPostsUsed, onGuestGate,
}: {
  onPost: (content: string) => void;
  memberInitials: string;
  memberColor: string;
  isGuest: boolean;
  guestPostsUsed: number;
  onGuestGate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handlePost = () => {
    if (!text.trim()) return;
    if (isGuest && guestPostsUsed >= 1) {
      onGuestGate();
      return;
    }
    onPost(text.trim());
    setText('');
    setOpen(false);
  };

  const handleOpen = () => {
    if (isGuest && guestPostsUsed >= 1) {
      onGuestGate();
      return;
    }
    setOpen(true);
  };

  return (
    <div className="rounded-2xl border mb-5 overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      {!open ? (
        <button onClick={handleOpen} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0" style={{ background: `${memberColor}22`, color: memberColor, border: `1.5px solid ${memberColor}55` }}>
            {memberInitials}
          </div>
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {isGuest && guestPostsUsed >= 1 ? 'Create an account to post again...' : 'Share something with the community...'}
          </span>
          {isGuest && guestPostsUsed >= 1 && <AlertTriangle size={14} className="ml-auto flex-shrink-0" style={{ color: 'var(--primary)' }} />}
        </button>
      ) : (
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0 mt-1" style={{ background: `${memberColor}22`, color: memberColor, border: `1.5px solid ${memberColor}55` }}>
              {memberInitials}
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your comedy with the community..."
              rows={3}
              maxLength={500}
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border resize-none"
              style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{text.length}/500</span>
            <div className="flex items-center gap-2">
              <button onClick={() => { setOpen(false); setText(''); }} className="px-3 py-1.5 rounded-lg text-xs font-600 border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                Cancel
              </button>
              <button disabled={!text.trim()} onClick={handlePost} className="px-4 py-1.5 rounded-lg text-xs font-700 transition-all disabled:opacity-50" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Post to Pulpit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PulpitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestModalMode, setGuestModalMode] = useState<'registry' | 'limit_reached' | 'action_gate'>('registry');
  const [guestPostsUsed, setGuestPostsUsed] = useState(0);

  const isGuest = !user;
  const displayName = user?.user_metadata?.full_name || (isGuestRegistered() ? getGuestName() : 'Guest');
  const initials = isGuest ? 'G' : displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const memberColor = isGuest ? '#8A8070' : '#52B788';

  useEffect(() => {
    setFeed(buildFeed(activeTab));
  }, [activeTab]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 800));
    const more = buildFeed(activeTab);
    setFeed((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = more.filter((p) => !existingIds.has(p.id));
      return [...prev, ...unique.slice(0, 5)];
    });
    setLoadingMore(false);
  }, [activeTab]);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleGuestGate = () => {
    const count = getGuestSigninCount();
    if (count >= GUEST_MAX_SIGNINS) {
      setGuestModalMode('limit_reached');
    } else {
      setGuestModalMode('action_gate');
    }
    setGuestModalOpen(true);
  };

  const handleNewPost = (content: string) => {
    if (isGuest) {
      setGuestPostsUsed((p) => p + 1);
      toast.success('Posted as guest! Create an account to post more.');
    } else {
      toast.success('Posted to the Pulpit!');
    }
    const newPost: FeedPost = {
      id: `new-${Date.now()}`,
      type: 'post',
      author: displayName,
      handle: user?.email?.split('@')[0] || 'guest',
      rank: 'Layperson',
      initials,
      avatarColor: memberColor,
      timeAgo: 'just now',
      content,
      likes: 0,
      comments: 0,
      shares: 0,
      tag: 'New',
      tagColor: memberColor,
      weight: 50,
    };
    setFeed((prev) => [newPost, ...prev]);
  };

  return (
    <AppLayout>
      <GuestRegistryModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        mode={guestModalMode}
        onSuccess={(name) => {
          toast.success(`Welcome, ${name}!`);
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 2xl:px-16 py-4 sm:py-6">

        {/* ── Pulpit Header ── */}
        <div
          className="rounded-2xl border p-4 sm:p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #141414 0%, #1a0800 60%, #141414 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 blob-gold opacity-15 pointer-events-none" />
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-800 text-gold flex items-center gap-2">
                🎤 The Pulpit
              </h1>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Community feed — everyone posts here
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isGuest ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted-foreground)' }}>
                    <UserCheck size={11} className="inline mr-1" />
                    Guest
                    {guestPostsUsed >= 1 && <span className="ml-1 text-primary" style={{ color: 'var(--primary)' }}>· 1 post used</span>}
                  </span>
                  <Link
                    href="/sign-up-login-screen"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-700 transition-all duration-150 active:scale-95"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <Plus size={12} />
                    Join Free
                  </Link>
                </div>
              ) : (
                <Link
                  href="/members/home"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-700 border transition-all hover:bg-muted"
                  style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
                >
                  My Homepage
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Guest post limit notice */}
        {isGuest && guestPostsUsed >= 1 && (
          <div
            className="rounded-xl border p-3 mb-5 flex items-start gap-3"
            style={{ background: 'rgba(139,26,26,0.08)', borderColor: 'rgba(139,26,26,0.3)' }}
          >
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
            <div className="flex-1">
              <p className="text-xs font-700" style={{ color: 'var(--primary)' }}>Guest post limit reached</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Guests get 1 post per visit. <Link href="/sign-up-login-screen" className="underline" style={{ color: 'var(--primary)' }}>Create a free account</Link> to post unlimited.
              </p>
            </div>
          </div>
        )}

        {/* ── New Post Box ── */}
        <NewPostBox
          onPost={handleNewPost}
          memberInitials={initials}
          memberColor={memberColor}
          isGuest={isGuest}
          guestPostsUsed={guestPostsUsed}
          onGuestGate={handleGuestGate}
        />

        {/* ── Main Layout ── */}
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            {/* Feed tabs */}
            <div
              className="flex p-1 rounded-xl mb-4 sticky top-[68px] z-30"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {feedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-600 transition-all duration-150 flex-1 justify-center"
                  style={{
                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    minHeight: '40px',
                  }}
                >
                  <tab.icon size={12} />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-3 px-1">
              <Zap size={12} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                Algorithm-curated · Updates every session
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {feed.map((post, idx) => (
                <PostCard
                  key={`${post.id}-${activeTab}-${idx}`}
                  post={post}
                  liked={likedPosts.has(post.id)}
                  saved={savedPosts.has(post.id)}
                  onLike={() => toggleLike(post.id)}
                  onSave={() => toggleSave(post.id)}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 border transition-all duration-150 hover:bg-muted disabled:opacity-60"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                {loadingMore ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronDown size={16} />
                )}
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block w-80 2xl:w-96 flex-shrink-0 space-y-5">
            <MembersSidebar />
          </div>
        </div>

        <div className="xl:hidden mt-6 space-y-5">
          <MembersSidebar />
        </div>
      </div>
    </AppLayout>
  );
}
