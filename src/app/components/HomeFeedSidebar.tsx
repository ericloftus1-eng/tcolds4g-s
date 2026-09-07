'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, UserPlus, Coins, ChevronRight, Crown } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';
import GuestRegistryModal, {
  isGuestRegistered,
  getGuestSigninCount,
  GUEST_MAX_SIGNINS,
} from '@/components/GuestRegistryModal';


const trendingClergy = [
  {
    id: 'clergy-001',
    name: 'Cardinal Chuckles McSacrilege',
    handle: 'chucklesmcsac',
    rank: 'Cardinal' as ClergryRank,
    followers: 284000,
    recentViews: '+12.4K today',
    initials: 'CC',
    color: '#8B1A1A',
  },
  {
    id: 'clergy-002',
    name: 'Archbishop Raucous Thunderpants',
    handle: 'thunderpants',
    rank: 'Archbishop' as ClergryRank,
    followers: 156000,
    recentViews: '+8.9K today',
    initials: 'AT',
    color: '#7B4EA0',
  },
  {
    id: 'clergy-003',
    name: 'Saint Gigglesworth the Profane',
    handle: 'gigglesworth',
    rank: 'Saint' as ClergryRank,
    followers: 892000,
    recentViews: '+31.2K today',
    initials: 'SG',
    color: '#B8860B',
  },
  {
    id: 'clergy-004',
    name: 'Bishop Filthy McNasty',
    handle: 'filthydirtybishop',
    rank: 'Bishop' as ClergryRank,
    followers: 94000,
    recentViews: '+4.1K today',
    initials: 'BF',
    color: '#1E6B8A',
  },
  {
    id: 'clergy-005',
    name: 'Rev. Cacklesworth',
    handle: 'cacklesworth',
    rank: 'Minister' as ClergryRank,
    followers: 38000,
    recentViews: '+2.8K today',
    initials: 'RC',
    color: '#2D6A4F',
  },
];

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function HomeFeedSidebar() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestModalMode, setGuestModalMode] = useState<'registry' | 'limit_reached' | 'action_gate'>('action_gate');
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const handleFollowClick = (personId: string) => {
    if (!isGuestRegistered()) {
      const count = getGuestSigninCount();
      if (count >= GUEST_MAX_SIGNINS) {
        setGuestModalMode('limit_reached');
      } else {
        setGuestModalMode('action_gate');
      }
      setGuestModalOpen(true);
      return;
    }
    setFollowedIds((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]
    );
  };

  return (
    <>
      <GuestRegistryModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        mode={guestModalMode}
      />
      <div className="flex flex-col gap-4 sticky top-20 scrollbar-thin overflow-y-auto max-h-[calc(100vh-5rem)]">
        {/* Ordination CTA */}
        <div
          className="rounded-2xl border p-4 relative overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--primary)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 blob-gold opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-700 text-gold">Get Ordained</span>
            </div>
            <p className="text-sm font-600 leading-snug mb-1">
              Join the clergy and unlock the sacred perks
            </p>
            <p className="text-sm mb-3 font-500" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              Pay $25 or earn your way through the congregation&apos;s blessing.
            </p>
            <Link
              href="/sign-up-login-screen"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all duration-150 active:scale-95 gold-gradient"
              style={{ color: 'var(--primary-foreground)' }}
            >
              Begin Your Ordination
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Trending Clergy */}
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-700 flex items-center gap-2">
              <TrendingUp size={14} style={{ color: 'var(--primary)' }} />
              Trending Clergy
            </h3>
            <button
              className="text-xs hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              See all
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {trendingClergy.map((person, idx) => (
              <div key={person.id} className="flex items-center gap-3 group cursor-pointer">
                <span
                  className="text-xs font-mono-data w-4 flex-shrink-0"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {idx + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                  style={{ background: `${person.color}33`, color: person.color, border: `1px solid ${person.color}55` }}
                >
                  {person.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 truncate group-hover:text-gold transition-colors">
                    {person.name}
                  </p>
                  <ClergryRankBadge rank={person.rank} size="sm" showIcon={false} />
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="text-xs font-mono-data font-600"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {formatFollowers(person.followers)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: '#52B788', fontSize: '10px' }}
                  >
                    {person.recentViews}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggest to Follow */}
        <div
          className="rounded-2xl border p-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-700 flex items-center gap-2">
              <UserPlus size={14} style={{ color: 'var(--primary)' }} />
              Join Their Congregation
            </h3>
          </div>

          {[
            {
              id: 'sug-001',
              name: 'Sister Sinful',
              handle: 'sistersinful',
              rank: 'Bishop' as ClergryRank,
              mutual: 14,
              initials: 'SS',
            },
            {
              id: 'sug-002',
              name: 'Deacon Punchline',
              handle: 'deaconpunch',
              rank: 'Deacon' as ClergryRank,
              mutual: 7,
              initials: 'DP',
            },
            {
              id: 'sug-003',
              name: 'Novice Nervously Nolan',
              handle: 'nervousnolan',
              rank: 'Layperson' as ClergryRank,
              mutual: 3,
              initials: 'NN',
            },
          ].map((person) => (
            <div key={person.id} className="flex items-center gap-2 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-600 truncate">{person.name}</p>
                <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.65, fontSize: '10px' }}>
                  {person.mutual} mutual congregation members
                </p>
              </div>
              <button
                onClick={() => handleFollowClick(person.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-600 transition-all duration-150 active:scale-95 hover:opacity-80 flex-shrink-0"
                style={{
                  background: followedIds.includes(person.id) ? 'var(--primary)' : 'var(--muted)',
                  color: followedIds.includes(person.id) ? 'var(--primary-foreground)' : 'var(--primary)',
                  border: '1px solid var(--primary)',
                }}
              >
                <UserPlus size={10} />
                {followedIds.includes(person.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>

        {/* Cheddar Coin quick buy */}
        <div
          className="rounded-2xl border p-4 relative overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="absolute inset-0 coin-shine opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-700 text-gold">Cheddar Coin</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono-data"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                CC
              </span>
            </div>
            <p className="text-xs mb-1 font-500" style={{ color: 'var(--foreground)', opacity: 0.75 }}>
              Your balance
            </p>
            <p className="font-mono-data font-700 text-2xl text-gold mb-3">1,240 CC</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[100, 500, 1000].map((amt) => (
                <button
                  key={`buy-${amt}`}
                  className="py-1.5 rounded-lg text-xs font-600 transition-all duration-150 active:scale-95 hover:opacity-80"
                  style={{ background: 'var(--muted)', color: 'var(--primary)', border: '1px solid var(--border)' }}
                >
                  {amt} CC
                </button>
              ))}
            </div>
            <button
              className="w-full py-2 rounded-xl text-xs font-700 transition-all duration-150 active:scale-95 gold-gradient"
              style={{ color: 'var(--primary-foreground)' }}
            >
              Buy Cheddar Coin
            </button>
            <p className="text-center mt-2 text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.65, fontSize: '10px' }}>
              Tax-free donations for ordained clergy 🧀
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-1 pb-4">
          <p className="text-sm leading-relaxed font-500" style={{ color: 'var(--foreground)', opacity: 0.75 }}>
            <span style={{ color: 'var(--primary)' }}>TCoLDS</span> · The Church of Laughterday Saints
            <br />
            <span className="italic text-xs">&ldquo;No comedy is bad comedy.&rdquo;</span>
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {['About', 'Terms', 'Privacy', 'Ordination', 'Cheddar Coin'].map((item) => (
              <button
                key={`footer-${item}`}
                className="text-xs hover:underline transition-colors font-500"
                style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '11px' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}