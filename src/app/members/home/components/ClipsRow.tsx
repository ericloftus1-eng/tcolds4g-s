'use client';
import React, { useRef } from 'react';
import { Play, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';

interface Clip {
  id: string;
  title: string;
  comedian: string;
  rank: ClergryRank;
  duration: string;
  views: number;
  likes: number;
  gradientFrom: string;
  gradientTo: string;
  badge?: string;
  badgeColor?: string;
}

const clips: Clip[] = [
  {
    id: 'c1',
    title: 'Why God Invented Mondays',
    comedian: 'Rev. Cacklesworth',
    rank: 'Minister',
    duration: '4:32',
    views: 84200,
    likes: 6300,
    gradientFrom: '#1a2e1a',
    gradientTo: '#2e1a1a',
    badge: 'Trending',
    badgeColor: '#CC2222',
  },
  {
    id: 'c2',
    title: 'Sunday Massacre Mass — Week 47',
    comedian: 'Archbishop Thunderpants',
    rank: 'Archbishop',
    duration: '1:22:14',
    views: 38470,
    likes: 19200,
    gradientFrom: '#2e0a0a',
    gradientTo: '#1a0a2e',
    badge: 'LIVE',
    badgeColor: '#CC2222',
  },
  {
    id: 'c3',
    title: '40 Minutes of Unfiltered Blasphemy',
    comedian: 'Sister Sinful',
    rank: 'Bishop',
    duration: '38:55',
    views: 127400,
    likes: 9800,
    gradientFrom: '#0a0a2e',
    gradientTo: '#2e0a2e',
    badge: '🔞 Basement',
    badgeColor: '#A855F7',
  },
  {
    id: 'c4',
    title: 'Parables of the Parking Lot',
    comedian: 'Deacon Punchline',
    rank: 'Deacon',
    duration: '7:18',
    views: 29300,
    likes: 2100,
    gradientFrom: '#1a1a0a',
    gradientTo: '#0a2e1a',
  },
  {
    id: 'c5',
    title: 'Holy Trinity of Bad Dates',
    comedian: 'Cardinal Chuckles',
    rank: 'Cardinal',
    duration: '52:07',
    views: 394000,
    likes: 41200,
    gradientFrom: '#2e0a0a',
    gradientTo: '#2e1a0a',
    badge: 'Special',
    badgeColor: '#D4AF37',
  },
  {
    id: 'c6',
    title: 'Sermon on the Mount of Laundry',
    comedian: 'Padre Punchworthy',
    rank: 'Minister',
    duration: '11:44',
    views: 47800,
    likes: 3400,
    gradientFrom: '#0a1a2e',
    gradientTo: '#1a2e2e',
  },
  {
    id: 'c7',
    title: 'Dark Catechism: Thanksgiving Edition',
    comedian: 'Bishop Filthy McNasty',
    rank: 'Bishop',
    duration: '22:30',
    views: 88100,
    likes: 7650,
    gradientFrom: '#0a0a0a',
    gradientTo: '#1a0a0a',
    badge: '🔞 Dark',
    badgeColor: '#8B1A1A',
  },
  {
    id: 'c8',
    title: 'My First Open Mic: A Trauma Debrief',
    comedian: 'Novice Nervously Nolan',
    rank: 'Layperson',
    duration: '3:15',
    views: 4200,
    likes: 380,
    gradientFrom: '#1a1a2e',
    gradientTo: '#2e2e1a',
    badge: 'Rookie',
    badgeColor: '#8A8070',
  },
];

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function ClipsRow() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-700 flex items-center gap-2">
          <Play size={16} style={{ color: 'var(--primary)' }} />
          Clips &amp; Sermons
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-muted active:scale-95 border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-muted active:scale-95 border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="flex-shrink-0 w-52 rounded-xl overflow-hidden border cursor-pointer group transition-all duration-200 hover:border-opacity-60 hover:-translate-y-0.5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Thumbnail */}
            <div
              className="relative h-32 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${clip.gradientFrom}, ${clip.gradientTo})` }}
            >
              {clip.badge && (
                <span
                  className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-700"
                  style={{ background: `${clip.badgeColor}33`, color: clip.badgeColor, border: `1px solid ${clip.badgeColor}55` }}
                >
                  {clip.badge}
                </span>
              )}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 group-hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                <Play size={16} fill="white" style={{ color: 'white', marginLeft: '2px' }} />
              </div>
              <span
                className="absolute bottom-2 right-2 text-xs font-mono-data px-1.5 py-0.5 rounded font-600"
                style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
              >
                {clip.duration}
              </span>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-xs font-700 leading-snug mb-1.5 line-clamp-2" style={{ color: 'var(--foreground)' }}>
                {clip.title}
              </p>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {clip.comedian}
                </span>
              </div>
              <ClergryRankBadge rank={clip.rank} size="sm" showIcon={false} />
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <Eye size={11} />
                  {formatNum(clip.views)}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <Heart size={11} />
                  {formatNum(clip.likes)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
