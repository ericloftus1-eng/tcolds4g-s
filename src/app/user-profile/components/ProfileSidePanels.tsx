'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Crown, Coins, Users } from 'lucide-react';
import CheddarCoinWidget from '@/components/ui/CheddarCoinWidget';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';

const OrdinationChart = dynamic(() => import('./OrdinationChart'), { ssr: false });

const rankProgression: { rank: ClergryRank; threshold: number; current: number }[] = [
  { rank: 'Cardinal', threshold: 250000, current: 284000 },
  { rank: 'Saint', threshold: 500000, current: 284000 },
];

export default function ProfileSidePanels() {
  return (
    <div className="flex flex-col gap-4 sticky top-20">
      {/* Holy Offerings */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Coins size={14} style={{ color: 'var(--primary)' }} />
          <h3 className="text-sm font-700">Holy Offerings</h3>
          <span
            className="ml-auto text-xs font-600 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--primary)' }}
          >
            Tax-free for clergy
          </span>
        </div>
        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Total tithes received
          </p>
          <p className="font-mono-data font-800 text-2xl text-gold">94,220 CC</p>
          <p className="text-xs mt-1" style={{ color: '#52B788' }}>
            +1,840 CC this week
          </p>
        </div>
        <CheddarCoinWidget
          recipientName="Cardinal Chuckles McSacrilege"
          recipientRank="Cardinal"
        />
      </div>

      {/* Ordination Progress */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Crown size={14} style={{ color: 'var(--primary)' }} />
          <h3 className="text-sm font-700">Path to Sainthood</h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Current rank */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Current rank
            </span>
            <ClergryRankBadge rank="Cardinal" size="sm" />
          </div>

          {/* Progress to Saint */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-600">Progress to Saint</span>
              <span className="text-xs font-mono-data" style={{ color: 'var(--primary)' }}>
                284K / 500K
              </span>
            </div>
            <div
              className="w-full h-2.5 rounded-full overflow-hidden"
              style={{ background: 'var(--muted)' }}
            >
              <div
                className="h-full rounded-full gold-gradient transition-all duration-500"
                style={{ width: `${(284000 / 500000) * 100}%` }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              216K more congregation members needed
            </p>
          </div>

          {/* Ordination chart */}
          <div className="mt-1">
            <p className="text-xs font-600 mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Congregation growth (90 days)
            </p>
            <OrdinationChart />
          </div>
        </div>
      </div>

      {/* Top congregation members */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: 'var(--primary)' }} />
            <h3 className="text-sm font-700">Top Tithers</h3>
          </div>
          <button className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>
            View all
          </button>
        </div>

        {[
          { id: 'tither-001', name: 'Saint Gigglesworth', amount: '8,400 CC', initials: 'SG', rank: 'Saint' as ClergryRank },
          { id: 'tither-002', name: 'Archbishop Thunderpants', amount: '5,200 CC', initials: 'AT', rank: 'Archbishop' as ClergryRank },
          { id: 'tither-003', name: 'Bishop Filthy McNasty', amount: '3,800 CC', initials: 'BF', rank: 'Bishop' as ClergryRank },
          { id: 'tither-004', name: 'Rev. Cacklesworth', amount: '2,100 CC', initials: 'RC', rank: 'Minister' as ClergryRank },
        ].map((tither, idx) => (
          <div key={tither.id} className="flex items-center gap-2.5 py-2">
            <span
              className="text-xs font-mono-data w-4 flex-shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {idx + 1}
            </span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              {tither.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 truncate">{tither.name}</p>
              <ClergryRankBadge rank={tither.rank} size="sm" showIcon={false} />
            </div>
            <span className="text-xs font-mono-data font-600 text-gold flex-shrink-0">
              {tither.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}