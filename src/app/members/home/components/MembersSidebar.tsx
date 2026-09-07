'use client';
import React from 'react';
import Link from 'next/link';
import { Lightbulb, Coins, Crown, TrendingUp, Zap } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';

const hilarousIdeas = [
  { id: 'i1', emoji: '⛪', name: 'The Confession Cam', desc: 'A live stream where comedians confess their worst jokes to the congregation in real time.' },
  { id: 'i2', emoji: '🧀', name: 'Cheddar Coin Tithe-a-Thon', desc: 'A 24-hour fundraiser where every joke earns CC. The more laughs, the more cheese.' },
  { id: 'i3', emoji: '🎤', name: 'Roast the Pope-cast', desc: 'A weekly podcast where clergy roast each other\'s sermons. No one is safe. Not even the Saints.' },
  { id: 'i4', emoji: '🔔', name: 'The Holy Heckler Hotline', desc: 'Members can call in and heckle live sets. Comedians earn XP for surviving.' },
  { id: 'i5', emoji: '🪦', name: 'The Bit Graveyard', desc: 'A sacred archive of jokes that bombed. A memorial. A warning. A masterclass.' },
  { id: 'i6', emoji: '🎭', name: 'Improv Exorcisms', desc: 'Live improv shows where the audience shouts suggestions and comedians must "cast out" bad vibes.' },
  { id: 'i7', emoji: '📖', name: 'The Book of Punchlines', desc: 'A community-written comedy bible. Every member can submit a verse. Canonized by vote.' },
  { id: 'i8', emoji: '🏆', name: 'The Sainthood Trials', desc: 'A quarterly comedy tournament. Survive three rounds of roasting to ascend the clergy ladder.' },
  { id: 'i9', emoji: '🌙', name: 'Midnight Mass Meltdowns', desc: 'Late-night live sets where comedians go off-script. Anything goes after midnight.' },
  { id: 'i10', emoji: '🧪', name: 'The Comedy Lab', desc: 'A members-only workshop where new material gets tested on a live congregation before going public.' },
];

const cleverNames = [
  { id: 'n1', name: 'The Pew Review', desc: 'Weekly comedy ratings from the congregation' },
  { id: 'n2', name: 'Blasphemy Bingo', desc: 'Live show game — cross off the taboos' },
  { id: 'n3', name: 'The Vestibule', desc: 'Lobby chat for pre-show warmups' },
  { id: 'n4', name: 'Holy Rollers', desc: 'Top-earning Cheddar Coin comedians' },
  { id: 'n5', name: 'The Reliquary', desc: 'Archive of legendary sets and clips' },
  { id: 'n6', name: 'Sermon Slam', desc: 'Head-to-head comedy battle format' },
  { id: 'n7', name: 'The Sacristy', desc: 'Backstage green room for ordained clergy' },
  { id: 'n8', name: 'Purgatory Picks', desc: 'Content that\'s too good to delete, too bad to promote' },
  { id: 'n9', name: 'The Narthex', desc: 'Newcomer onboarding zone for fresh Laypersons' },
  { id: 'n10', name: 'Cheddar Communion', desc: 'Monthly CC giveaway for top performers' },
];

const trendingClergy: { id: string; name: string; handle: string; rank: ClergryRank; initials: string; color: string; views: string }[] = [
  { id: 'tc1', name: 'Saint Gigglesworth', handle: 'gigglesworth', rank: 'Saint', initials: 'SG', color: '#D4AF37', views: '+31.2K' },
  { id: 'tc2', name: 'Cardinal Chuckles', handle: 'chucklesmcsac', rank: 'Cardinal', initials: 'CC', color: '#CC2222', views: '+12.4K' },
  { id: 'tc3', name: 'Archbishop Thunderpants', handle: 'thunderpants', rank: 'Archbishop', initials: 'AT', color: '#A855F7', views: '+8.9K' },
];

export default function MembersSidebar() {
  return (
    <div className="flex flex-col gap-4 sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)]" style={{ scrollbarWidth: 'none' }}>

      {/* Cheddar Coin balance */}
      <div
        className="rounded-2xl border p-4 relative overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'rgba(212,175,55,0.4)' }}
      >
        <div className="absolute inset-0 coin-shine opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={15} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-700 text-gold">Your Cheddar Coin</span>
          </div>
          <p className="font-mono-data font-800 text-2xl text-gold">1,240 CC</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>+50 CC earned this week</p>
          <Link
            href="/submit"
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all duration-150 active:scale-95 gold-gradient"
            style={{ color: 'var(--primary-foreground)' }}
          >
            <Crown size={12} />
            Preach &amp; Earn
          </Link>
        </div>
      </div>

      {/* Trending Clergy */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 flex items-center gap-2 mb-3">
          <TrendingUp size={14} style={{ color: 'var(--primary)' }} />
          Trending Clergy
        </h3>
        <div className="flex flex-col gap-3">
          {trendingClergy.map((p, idx) => (
            <div key={p.id} className="flex items-center gap-2.5">
              <span className="text-xs font-mono-data w-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                {idx + 1}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-600 truncate">{p.name}</p>
                <ClergryRankBadge rank={p.rank} size="sm" showIcon={false} />
              </div>
              <span className="text-xs font-600" style={{ color: '#52B788' }}>{p.views}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clever Hilarious Ideas */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 flex items-center gap-2 mb-3">
          <Lightbulb size={14} style={{ color: 'var(--primary)' }} />
          Holy Ideas &amp; Features
        </h3>
        <div className="flex flex-col gap-3">
          {hilarousIdeas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-xl p-3 border transition-all duration-150 hover:border-opacity-60 cursor-pointer"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{idea.emoji}</span>
                <span className="text-xs font-700" style={{ color: 'var(--foreground)' }}>{idea.name}</span>
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--muted-foreground)' }}>
                {idea.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clever Names */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color: 'var(--primary)' }} />
          Clever Names &amp; Concepts
        </h3>
        <div className="flex flex-col gap-2">
          {cleverNames.map((item) => (
            <div key={item.id} className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              />
              <div>
                <span className="text-xs font-700 text-gold">{item.name}</span>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
