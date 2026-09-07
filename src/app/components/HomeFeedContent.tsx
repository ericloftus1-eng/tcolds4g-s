'use client';
import React, { useState } from 'react';
import { Flame, Radio, Moon, LayoutGrid, List, Plus } from 'lucide-react';
import VideoCard, { VideoPost } from '@/components/ui/VideoCard';
import { ClergryRank } from '@/components/ui/ClergryRankBadge';

const tabs = [
  { id: 'all', label: 'All Sermons', icon: Flame },
  { id: 'mass', label: 'Mass Events', icon: Radio },
  { id: 'basement', label: 'The Basement', icon: Moon },
  { id: 'live', label: 'Live Now', icon: Radio },
];

const mockPosts: VideoPost[] = [
  {
    id: 'post-001',
    title: 'Why God Invented Mondays (A Theological Breakdown)',
    excerpt: 'I have done the research. I have prayed. I have been to therapy. The answer will destroy you.',
    comedian: 'Rev. Cacklesworth',
    comedianHandle: 'cacklesworth',
    rank: 'Minister' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #1a2e1a, #2e1a1a)',
    duration: '4:32',
    views: 84200,
    likes: 6300,
    comments: 412,
    postedAt: '3h ago',
    tags: ['theology', 'mondays', 'existential'],
    isMass: false,
    isLive: false,
    isBasement: false,
  },
  {
    id: 'post-002',
    title: 'LIVE: Sunday Massacre Mass — Week 47',
    excerpt: 'The congregation gathers. The jokes are blasphemous. The Lord is probably fine with it.',
    comedian: 'Archbishop Raucous Thunderpants',
    comedianHandle: 'thunderpants',
    rank: 'Archbishop' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #2e0a0a, #1a0a2e)',
    duration: '1:22:14',
    views: 3847,
    likes: 1920,
    comments: 836,
    postedAt: 'Live now',
    tags: ['mass', 'live', 'roast'],
    isMass: true,
    isLive: true,
    isBasement: false,
  },
  {
    id: 'post-003',
    title: 'My Confessional: 40 Minutes of Unfiltered Blasphemy',
    excerpt: 'Not for the easily offended. Actually, especially for the easily offended.',
    comedian: 'Sister Sinful',
    comedianHandle: 'sistersinful',
    rank: 'Bishop' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #0a0a2e, #2e0a2e)',
    duration: '38:55',
    views: 127400,
    likes: 9800,
    comments: 1203,
    postedAt: '1d ago',
    tags: ['dark', 'confessional', 'basement'],
    isMass: false,
    isLive: false,
    isBasement: true,
  },
  {
    id: 'post-004',
    title: 'Parables of the Parking Lot: A Modern Gospel',
    excerpt: 'Jesus would have been terrible at parallel parking. Scripture backs me up on this.',
    comedian: 'Deacon Punchline',
    comedianHandle: 'deaconpunch',
    rank: 'Deacon' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #1a1a0a, #0a2e1a)',
    duration: '7:18',
    views: 29300,
    likes: 2100,
    comments: 187,
    postedAt: '6h ago',
    tags: ['parables', 'driving', 'gospel'],
    isMass: false,
    isLive: false,
    isBasement: false,
  },
  {
    id: 'post-005',
    title: 'The Holy Trinity of Bad Dates (Stand-Up Special)',
    excerpt: 'Dating apps, bad tacos, and the existential dread of swiping right on someone who quotes Nietzsche.',
    comedian: 'Cardinal Chuckles McSacrilege',
    comedianHandle: 'chucklesmcsac',
    rank: 'Cardinal' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #2e0a0a, #2e1a0a)',
    duration: '52:07',
    views: 394000,
    likes: 41200,
    comments: 5840,
    postedAt: '2d ago',
    tags: ['standup', 'dating', 'special'],
    isMass: false,
    isLive: false,
    isBasement: false,
  },
  {
    id: 'post-006',
    title: 'Sermon on the Mount of Laundry',
    excerpt: 'Blessed are the wrinkled, for they shall inherit the iron.',
    comedian: 'Padre Punchworthy',
    comedianHandle: 'padrepunch',
    rank: 'Minister' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #0a1a2e, #1a2e2e)',
    duration: '11:44',
    views: 47800,
    likes: 3400,
    comments: 298,
    postedAt: '12h ago',
    tags: ['sermon', 'domestic', 'blessed'],
    isMass: false,
    isLive: false,
    isBasement: false,
  },
  {
    id: 'post-007',
    title: 'Dark Catechism: Things You Cannot Say at Thanksgiving',
    excerpt: 'A comprehensive theological guide to ruining family dinners with precision.',
    comedian: 'Bishop Filthy McNasty',
    comedianHandle: 'filthydirtybishop',
    rank: 'Bishop' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #0a0a0a, #1a0a0a)',
    duration: '22:30',
    views: 88100,
    likes: 7650,
    comments: 923,
    postedAt: '3d ago',
    tags: ['dark', 'family', 'thanksgiving'],
    isMass: false,
    isLive: false,
    isBasement: true,
  },
  {
    id: 'post-008',
    title: 'My First Open Mic: A Trauma Debrief',
    excerpt: 'I told three jokes. Two people laughed. One was my mom. She was on her phone.',
    comedian: 'Novice Nervously Nolan',
    comedianHandle: 'nervousnolan',
    rank: 'Layperson' as ClergryRank,
    thumbnailColor: 'linear-gradient(135deg, #1a1a2e, #2e2e1a)',
    duration: '3:15',
    views: 4200,
    likes: 380,
    comments: 67,
    postedAt: '5h ago',
    tags: ['openmic', 'newbie', 'trauma'],
    isMass: false,
    isLive: false,
    isBasement: false,
  },
];

export default function HomeFeedContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');

  const filteredPosts = mockPosts.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mass') return p.isMass;
    if (activeTab === 'basement') return p.isBasement;
    if (activeTab === 'live') return p.isLive;
    return true;
  });

  return (
    <div>
      {/* Tab bar + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {tabs.map((tab) => (
            <button
              key={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150"
              style={{
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color:
                  activeTab === tab.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              <tab.icon size={12} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setViewMode('feed')}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{
                background: viewMode === 'feed' ? 'var(--muted)' : 'transparent',
                color: viewMode === 'feed' ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{
                background: viewMode === 'grid' ? 'var(--muted)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-600 transition-all duration-150 active:scale-95"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Plus size={13} />
            Preach
          </button>
        </div>
      </div>

      {/* Feed */}
      {filteredPosts.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--muted)' }}
          >
            <Moon size={28} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h3 className="font-700 text-base mb-1">The pulpit is empty</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            No sermons in this section yet. Be the first to preach.
          </p>
          <button
            className="mt-4 px-4 py-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Deliver a Sermon
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPosts.map((post) => (
            <VideoCard key={post.id} post={post} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <VideoCard key={post.id} post={post} layout="feed" />
          ))}
        </div>
      )}
    </div>
  );
}