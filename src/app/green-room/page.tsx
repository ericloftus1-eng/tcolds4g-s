'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Leaf,
  Crown,
  Coins,
  Star,
  Gift,
  Zap,
  Users,
  Lock,
  CheckCircle,
  ChevronRight,
  Mic,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';



const perks = [
  {
    id: 'perk-1',
    icon: Coins,
    title: 'Tax-Free Cheddar Coin Donations',
    description: 'All CC donations to ordained clergy are non-taxable holy offerings.',
    unlocked: true,
    rank: 'Minister+',
    color: '#D4AF37',
  },
  {
    id: 'perk-2',
    icon: Mic,
    title: 'Priority Mass Booking',
    description: 'Skip the queue and book your Live Mass slot up to 30 days in advance.',
    unlocked: true,
    rank: 'Minister+',
    color: '#52B788',
  },
  {
    id: 'perk-3',
    icon: Star,
    title: 'Clergy Verified Badge',
    description: 'Display your ordained rank badge across all content and comments.',
    unlocked: true,
    rank: 'Minister+',
    color: '#38BDF8',
  },
  {
    id: 'perk-4',
    icon: Gift,
    title: 'Exclusive Merch Drops',
    description: 'First access to TCoLDS merch, limited edition robes, and holy swag.',
    unlocked: true,
    rank: 'Bishop+',
    color: '#A855F7',
  },
  {
    id: 'perk-5',
    icon: Zap,
    title: 'Boosted Content Reach',
    description: 'Your sermons are algorithmically elevated to the top of the Pulpit feed.',
    unlocked: false,
    rank: 'Cardinal+',
    color: '#FB923C',
  },
  {
    id: 'perk-6',
    icon: Crown,
    title: 'Sainthood Revenue Share',
    description: 'Saints receive a 5% cut of all CC transactions on the platform.',
    unlocked: false,
    rank: 'Saint Only',
    color: '#FFD700',
  },
];

const clergyOnline = [
  { id: 'c1', name: 'Rev. Cacklesworth', rank: 'Archbishop', status: 'In the Green Room', rankColor: '#A855F7' },
  { id: 'c2', name: 'Bishop Filthy McNasty', rank: 'Bishop', status: 'Prepping a set', rankColor: '#38BDF8' },
  { id: 'c3', name: 'Cardinal Chuckles', rank: 'Cardinal', status: 'Counting CC', rankColor: '#CC2222' },
  { id: 'c4', name: 'Sister Blasphema', rank: 'Minister', status: 'Writing sermons', rankColor: '#52B788' },
];

const rankLadder = [
  { rank: 'Layperson', req: 'Join the congregation', color: '#8A8070', achieved: true },
  { rank: 'Deacon', req: '100 followers or $25 ordination', color: '#C9A227', achieved: true },
  { rank: 'Minister', req: '500 followers + 1k likes', color: '#52B788', achieved: true },
  { rank: 'Bishop', req: '2k followers + 10k views', color: '#38BDF8', achieved: false },
  { rank: 'Archbishop', req: '10k followers + 50k views', color: '#A855F7', achieved: false },
  { rank: 'Cardinal', req: '25k followers + 200k views', color: '#CC2222', achieved: false },
  { rank: 'Saint', req: '100k followers + congregation vote', color: '#FFD700', achieved: false },
];

export default function GreenRoomPage() {
  const [claimingPerk, setClaimingPerk] = useState<string | null>(null);

  const handleClaimPerk = async (perkId: string, unlocked: boolean) => {
    if (!unlocked) {
      toast.error('🔒 This perk requires a higher clergy rank. Keep preaching!');
      return;
    }
    setClaimingPerk(perkId);
    await new Promise((r) => setTimeout(r, 700));
    setClaimingPerk(null);
    toast.success('✅ Perk activated! The congregation rejoices.');
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div
          className="relative rounded-2xl overflow-hidden border mb-8 p-6 md:p-8"
          style={{ borderColor: '#52B788', background: 'linear-gradient(135deg, #0a1a0a 0%, #0d2e0d 60%, #0a0a0a 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(82,183,136,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none blob-gold opacity-20" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)' }}
            >
              <Leaf size={26} style={{ color: '#fff' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-800" style={{ color: 'var(--foreground)' }}>
                  The Green Room
                </h1>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-600"
                  style={{ background: 'rgba(82,183,136,0.2)', color: '#52B788', border: '1px solid rgba(82,183,136,0.3)' }}
                >
                  Clergy Only
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Your exclusive backstage lounge. Hang with fellow clergy, claim perks, and track your path to Sainthood.
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0"
              style={{ background: 'rgba(82,183,136,0.1)', borderColor: '#52B788' }}
            >
              <Sparkles size={14} style={{ color: '#52B788' }} />
              <span className="text-sm font-700" style={{ color: '#52B788' }}>Minister</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Current Rank</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perks — main area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Perks Grid */}
            <div>
              <h2 className="font-700 text-base mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Gift size={16} style={{ color: '#52B788' }} />
                Clergy Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {perks.map((perk) => {
                  const PerkIcon = perk.icon;
                  return (
                    <div
                      key={perk.id}
                      className="rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200"
                      style={{
                        background: perk.unlocked ? 'var(--card)' : 'rgba(10,10,10,0.6)',
                        borderColor: perk.unlocked ? perk.color + '55' : 'var(--border)',
                        opacity: perk.unlocked ? 1 : 0.65,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: perk.unlocked ? `${perk.color}22` : 'var(--muted)', border: `1px solid ${perk.unlocked ? perk.color + '44' : 'var(--border)'}` }}
                        >
                          <PerkIcon size={16} style={{ color: perk.unlocked ? perk.color : 'var(--muted-foreground)' }} />
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-600 flex-shrink-0"
                          style={{
                            background: perk.unlocked ? `${perk.color}22` : 'var(--muted)',
                            color: perk.unlocked ? perk.color : 'var(--muted-foreground)',
                          }}
                        >
                          {perk.unlocked ? '✓ Unlocked' : <><Lock size={9} className="inline mr-1" />{perk.rank}</>}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-600 mb-1" style={{ color: perk.unlocked ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                          {perk.title}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {perk.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleClaimPerk(perk.id, perk.unlocked)}
                        className="w-full py-2 rounded-lg text-xs font-700 transition-all duration-200 flex items-center justify-center gap-1.5"
                        style={{
                          background: perk.unlocked ? `${perk.color}22` : 'var(--muted)',
                          color: perk.unlocked ? perk.color : 'var(--muted-foreground)',
                          border: `1px solid ${perk.unlocked ? perk.color + '44' : 'var(--border)'}`,
                        }}
                      >
                        {claimingPerk === perk.id ? (
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : perk.unlocked ? (
                          <><CheckCircle size={12} /> Activate Perk</>
                        ) : (
                          <><Lock size={12} /> Locked</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rank Ladder */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-700 text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Trophy size={14} style={{ color: 'var(--primary)' }} />
                Path to Sainthood
              </h3>
              <div className="space-y-2">
                {rankLadder.map((r, i) => (
                  <div
                    key={r.rank}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      background: r.achieved ? `${r.color}11` : 'transparent',
                      border: `1px solid ${r.achieved ? r.color + '33' : 'var(--border)'}`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-800 flex-shrink-0"
                      style={{
                        background: r.achieved ? r.color : 'var(--muted)',
                        color: r.achieved ? '#0a0a0a' : 'var(--muted-foreground)',
                      }}
                    >
                      {r.achieved ? <CheckCircle size={13} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-700" style={{ color: r.achieved ? r.color : 'var(--muted-foreground)' }}>
                        {r.rank}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {r.req}
                      </p>
                    </div>
                    {!r.achieved && (
                      <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Clergy Online */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-700 text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Users size={14} style={{ color: '#52B788' }} />
                Clergy in the Room
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-600"
                  style={{ background: 'rgba(82,183,136,0.2)', color: '#52B788' }}
                >
                  {clergyOnline.length} online
                </span>
              </h3>
              <div className="space-y-3">
                {clergyOnline.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                      style={{ background: `${c.rankColor}33`, color: c.rankColor, border: `1px solid ${c.rankColor}55` }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>
                        {c.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {c.status}
                      </p>
                    </div>
                    <span className="text-xs font-600 flex-shrink-0" style={{ color: c.rankColor }}>
                      {c.rank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordination CTA */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'linear-gradient(135deg, #0a1a0a, #0d2e0d)', borderColor: '#52B788' }}
            >
              <Crown size={20} className="mb-3" style={{ color: '#D4AF37' }} />
              <p className="text-sm font-700 mb-1" style={{ color: 'var(--foreground)' }}>
                Upgrade Your Rank
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Get ordained for $25 or earn your rank through followers, likes, and views.
              </p>
              <a
                href="/sign-up-login-screen"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-700 transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
              >
                <Zap size={13} />
                Get Ordained
              </a>
            </div>

            {/* CC Balance */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                  Cheddar Coin Balance
                </p>
                <Coins size={14} style={{ color: 'var(--primary)' }} />
              </div>
              <p className="text-2xl font-800 font-mono-data text-gold mb-1">1,240 CC</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                ≈ $12.40 USD · Tax-free offerings
              </p>
              <button
                onClick={() => toast.success('💰 Opening the Cheddar Coin exchange...')}
                className="mt-3 w-full py-2 rounded-lg text-xs font-700 transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--primary)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                Buy More CC
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
