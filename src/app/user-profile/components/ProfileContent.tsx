'use client';
import React, { useState } from 'react';
import { Grid3x3, Radio, Moon, Info, Play, Eye, Heart, Lock } from 'lucide-react';


const contentTabs = [
  { id: 'sermons', label: 'Sermons', icon: Grid3x3 },
  { id: 'mass', label: 'Mass Events', icon: Radio },
  { id: 'basement', label: 'The Basement', icon: Moon },
  { id: 'about', label: 'About', icon: Info },
];

interface ContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  duration: string;
  postedAt: string;
  thumbnailColor: string;
  isBasement?: boolean;
  isMass?: boolean;
  isLive?: boolean;
}

const sermonItems: ContentItem[] = [
  {
    id: 'content-001',
    title: 'The Holy Trinity of Bad Dates',
    views: 394000,
    likes: 41200,
    duration: '52:07',
    postedAt: '2d ago',
    thumbnailColor: 'linear-gradient(135deg, #2e0a0a, #2e1a0a)',
  },
  {
    id: 'content-002',
    title: 'Sermon: Why Airlines Are Purgatory',
    views: 218000,
    likes: 19800,
    duration: '18:34',
    postedAt: '5d ago',
    thumbnailColor: 'linear-gradient(135deg, #0a0a2e, #1a0a2e)',
  },
  {
    id: 'content-003',
    title: 'Gospel of the Group Chat',
    views: 156000,
    likes: 14300,
    duration: '12:55',
    postedAt: '1w ago',
    thumbnailColor: 'linear-gradient(135deg, #0a2e0a, #1a2e1a)',
  },
  {
    id: 'content-004',
    title: 'Beatitudes of the Brunch Menu',
    views: 98400,
    likes: 8700,
    duration: '9:22',
    postedAt: '2w ago',
    thumbnailColor: 'linear-gradient(135deg, #2e2e0a, #2e1a0a)',
  },
  {
    id: 'content-005',
    title: 'A Theological Defense of Napping',
    views: 312000,
    likes: 28900,
    duration: '24:11',
    postedAt: '3w ago',
    thumbnailColor: 'linear-gradient(135deg, #1a0a2e, #2e0a1a)',
  },
  {
    id: 'content-006',
    title: 'The Exorcism of My Credit Card Debt',
    views: 441000,
    likes: 52100,
    duration: '37:48',
    postedAt: '1mo ago',
    thumbnailColor: 'linear-gradient(135deg, #2e0a0a, #0a0a2e)',
  },
  {
    id: 'content-007',
    title: 'Parables of the Self-Checkout Line',
    views: 87600,
    likes: 7200,
    duration: '6:14',
    postedAt: '1mo ago',
    thumbnailColor: 'linear-gradient(135deg, #0a2e2e, #0a1a2e)',
  },
  {
    id: 'content-008',
    title: 'Revelations: My Tinder Profile',
    views: 203000,
    likes: 22400,
    duration: '15:03',
    postedAt: '2mo ago',
    thumbnailColor: 'linear-gradient(135deg, #2e1a0a, #1a0a0a)',
  },
  {
    id: 'content-009',
    title: 'The Ten Commandments of Texting',
    views: 521000,
    likes: 63800,
    duration: '29:40',
    postedAt: '2mo ago',
    thumbnailColor: 'linear-gradient(135deg, #1a2e0a, #0a2e1a)',
  },
];

const massItems: ContentItem[] = [
  {
    id: 'mass-content-001',
    title: 'Sunday Massacre Mass — Week 46',
    views: 8420,
    likes: 3100,
    duration: '1:18:33',
    postedAt: '1w ago',
    thumbnailColor: 'linear-gradient(135deg, #2e0a0a, #1a0a2e)',
    isMass: true,
  },
  {
    id: 'mass-content-002',
    title: 'The Midnight Vespers Roast — Vol. 12',
    views: 6280,
    likes: 2400,
    duration: '1:02:14',
    postedAt: '2w ago',
    thumbnailColor: 'linear-gradient(135deg, #0a0a2e, #2e0a2e)',
    isMass: true,
  },
  {
    id: 'mass-content-003',
    title: 'Easter Massacre Special 2026',
    views: 22100,
    likes: 9800,
    duration: '2:14:07',
    postedAt: '2mo ago',
    thumbnailColor: 'linear-gradient(135deg, #1a0a0a, #2e2e0a)',
    isMass: true,
  },
];

const basementItems: ContentItem[] = [
  {
    id: 'basement-content-001',
    title: '[BASEMENT] Things You Cannot Say at a Funeral',
    views: 88100,
    likes: 7650,
    duration: '22:30',
    postedAt: '3d ago',
    thumbnailColor: 'linear-gradient(135deg, #0a0a0a, #1a0a0a)',
    isBasement: true,
  },
  {
    id: 'basement-content-002',
    title: '[BASEMENT] The Unhinged Nativity',
    views: 134000,
    likes: 12300,
    duration: '31:15',
    postedAt: '3w ago',
    thumbnailColor: 'linear-gradient(135deg, #0a0a0a, #0a0a1a)',
    isBasement: true,
  },
];

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function ContentGrid({ items }: { items: ContentItem[] }) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <p className="text-sm font-600 mb-1">No sermons here yet</p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          The pulpit is empty. Check back after the next Mass.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative rounded-xl overflow-hidden border card-hover cursor-pointer"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Thumbnail */}
          <div
            className="relative aspect-video flex items-center justify-center"
            style={{ background: item.thumbnailColor }}
          >
            {item.isBasement ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-1">
                <Lock size={20} style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                  Basement Only
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <Play size={16} fill="white" style={{ color: '#fff' }} />
                </div>
              </div>
            )}
            {item.isMass && (
              <span
                className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-xs font-700"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: '10px' }}
              >
                ⛪ MASS
              </span>
            )}
            <span
              className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono-data"
              style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '10px' }}
            >
              {item.duration}
            </span>
          </div>
          {/* Info */}
          <div className="p-2.5">
            <p className="text-xs font-600 line-clamp-2 leading-snug" style={{ color: 'var(--foreground)' }}>
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                <Eye size={9} className="inline mr-0.5" />
                {formatCount(item.views)}
              </span>
              <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                <Heart size={9} className="inline mr-0.5" />
                {formatCount(item.likes)}
              </span>
              <span className="ml-auto text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                {item.postedAt}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 mb-3" style={{ color: 'var(--primary)' }}>
          The Gospel According to Chuckles
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Cardinal Chuckles McSacrilege has been performing stand-up comedy since 2012, when he
          accidentally insulted a priest at an open mic and discovered his calling. Born in Newark,
          NJ, raised on a diet of blasphemy and bad cable, he is now one of TCoLDS&apos;s most
          decorated clergy members.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--muted-foreground)' }}>
          His specials have been viewed over 12 million times across the platform. He hosts the
          weekly Sunday Massacre Mass — the most-attended live event in TCoLDS history.
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 mb-3">Ordained Credentials</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Ordination Date', value: 'March 14, 2024' },
            { label: 'Ordination Method', value: 'Earned (threshold met)' },
            { label: 'Current Rank', value: 'Cardinal' },
            { label: 'Rank Achieved', value: 'November 2025' },
            { label: 'Congregation Size', value: '284,000 members' },
            { label: 'Total Tithes Received', value: '94,220 CC (tax-free)' },
          ].map((row) => (
            <div
              key={`about-row-${row.label}`}
              className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>
                {row.label}
              </span>
              <span className="text-xs font-600" style={{ color: 'var(--foreground)' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-700 mb-3">Upcoming Tour Dates</h3>
        {[
          { id: 'tour-001', venue: 'The Laugh Sanctuary, NYC', date: 'Jun 14, 2026', tickets: 'Sold Out' },
          { id: 'tour-002', venue: 'Holy Roller Comedy Club, Chicago', date: 'Jun 21, 2026', tickets: 'Available' },
          { id: 'tour-003', venue: 'The Profane Pulpit, Austin TX', date: 'Jul 4, 2026', tickets: 'Available' },
          { id: 'tour-004', venue: 'TCoLDS Virtual Mass — Special Edition', date: 'Jul 12, 2026', tickets: 'RSVP' },
        ].map((show) => (
          <div
            key={show.id}
            className="flex items-center justify-between py-2.5 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <p className="text-sm font-600">{show.venue}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {show.date}
              </p>
            </div>
            <span
              className="text-xs font-700 px-2.5 py-1 rounded-full"
              style={{
                background: show.tickets === 'Sold Out' ? 'rgba(139,26,26,0.2)' : show.tickets === 'RSVP' ? 'rgba(212,175,55,0.15)' : 'rgba(82,183,136,0.15)',
                color: show.tickets === 'Sold Out' ? 'var(--secondary)' : show.tickets === 'RSVP' ? 'var(--primary)' : '#52B788',
              }}
            >
              {show.tickets}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState('sermons');

  const contentMap: Record<string, ContentItem[]> = {
    sermons: sermonItems,
    mass: massItems,
    basement: basementItems,
  };

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4 w-fit"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {contentTabs.map((tab) => (
          <button
            key={`profile-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-600 transition-all duration-150"
            style={{
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            <tab.icon size={12} />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'about' ? (
        <AboutTab />
      ) : (
        <ContentGrid items={contentMap[activeTab] || []} />
      )}
    </div>
  );
}