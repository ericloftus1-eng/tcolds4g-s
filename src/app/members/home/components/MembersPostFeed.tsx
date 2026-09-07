'use client';
import React, { useState } from 'react';
import { MessageCircle, Share2, Bookmark, Flame, MoreHorizontal } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';

interface Post {
  id: string;
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
  isLiked?: boolean;
  isSaved?: boolean;
  tag?: string;
  tagColor?: string;
}

const posts: Post[] = [
  {
    id: 'p1',
    author: 'Cardinal Chuckles McSacrilege',
    handle: 'chucklesmcsac',
    rank: 'Cardinal',
    initials: 'CC',
    avatarColor: '#CC2222',
    timeAgo: '12m ago',
    content: 'Just told my therapist I process trauma through comedy. She laughed. Then cried. Then laughed again. I think I cured her. You\'re welcome, science. 🙏',
    likes: 4821,
    comments: 312,
    shares: 891,
    tag: 'Confession',
    tagColor: '#CC2222',
  },
  {
    id: 'p2',
    author: 'Archbishop Raucous Thunderpants',
    handle: 'thunderpants',
    rank: 'Archbishop',
    initials: 'AT',
    avatarColor: '#A855F7',
    timeAgo: '34m ago',
    content: 'The Ten Commandments but it\'s just ten things my open mic audience did wrong last Tuesday. Commandment 1: Thou shalt not check thy phone during the punchline. Commandment 2: Thou shalt not explain the joke to thy date. Commandment 3: Thou shalt not bring a baby to a dark comedy show. We\'re on commandment 3 and already three people are going to hell.',
    likes: 9204,
    comments: 847,
    shares: 2103,
    tag: 'Scripture',
    tagColor: '#A855F7',
  },
  {
    id: 'p3',
    author: 'Sister Sinful',
    handle: 'sistersinful',
    rank: 'Bishop',
    initials: 'SS',
    avatarColor: '#38BDF8',
    timeAgo: '1h ago',
    content: 'Hot take: confession booths are just the world\'s first therapy pods. Same vibe. Slightly less comfortable chairs. The priest doesn\'t charge $200/hour though, so honestly better ROI.',
    likes: 6630,
    comments: 521,
    shares: 1440,
    tag: 'Hot Take',
    tagColor: '#38BDF8',
  },
  {
    id: 'p4',
    author: 'Deacon Punchline',
    handle: 'deaconpunch',
    rank: 'Deacon',
    initials: 'DP',
    avatarColor: '#C9A227',
    timeAgo: '2h ago',
    content: 'Blessed are the meek, for they shall inherit the earth. But not the good parts. Those go to the people who showed up early and grabbed the front row.',
    likes: 2910,
    comments: 188,
    shares: 604,
    tag: 'Beatitude',
    tagColor: '#C9A227',
  },
  {
    id: 'p5',
    author: 'Rev. Cacklesworth',
    handle: 'cacklesworth',
    rank: 'Minister',
    initials: 'RC',
    avatarColor: '#52B788',
    timeAgo: '3h ago',
    content: 'My set bombed so hard last night that the venue\'s Yelp review now says "great acoustics for the sound of silence." I\'m framing it. It\'s art.',
    likes: 1847,
    comments: 143,
    shares: 389,
    tag: 'Field Report',
    tagColor: '#52B788',
  },
  {
    id: 'p6',
    author: 'Padre Punchworthy',
    handle: 'padrepunch',
    rank: 'Minister',
    initials: 'PP',
    avatarColor: '#D4AF37',
    timeAgo: '5h ago',
    content: 'Sermon on the Mount of Laundry: Blessed are the wrinkled, for they shall inherit the iron. Blessed are the sock-losers, for they shall find their pairs in the afterlife. Blessed are those who fold fitted sheets correctly — for they are liars and we do not trust them.',
    likes: 5512,
    comments: 402,
    shares: 1230,
    tag: 'Sermon',
    tagColor: '#D4AF37',
  },
  {
    id: 'p7',
    author: 'Novice Nervously Nolan',
    handle: 'nervousnolan',
    rank: 'Layperson',
    initials: 'NN',
    avatarColor: '#8A8070',
    timeAgo: '6h ago',
    content: 'First open mic update: I told three jokes. Two people laughed. One was my mom. She was on her phone. I think she was laughing at something else. I\'m fine. I\'m totally fine. Please send Cheddar Coins.',
    likes: 3201,
    comments: 287,
    shares: 712,
    tag: 'Rookie Report',
    tagColor: '#8A8070',
  },
];

const myPosts = [
  { id: 'mp1', content: 'My set bombed so hard last night that the venue\'s Yelp review now says "great acoustics for the sound of silence." I\'m framing it. It\'s art.', likes: 1847, comments: 143, timeAgo: '3h ago', tag: 'Field Report', tagColor: '#52B788' },
  { id: 'mp2', content: 'I told my GPS to take me somewhere I\'ve never been. It took me to a Cracker Barrel. I\'ve been to every Cracker Barrel. It knows me too well.', likes: 2910, comments: 188, timeAgo: '1d ago', tag: 'Observational', tagColor: '#C9A227' },
  { id: 'mp3', content: 'Just told my therapist I process trauma through comedy. She laughed. Then cried. Then laughed again. I think I cured her. You\'re welcome, science.', likes: 4821, comments: 312, timeAgo: '2d ago', tag: 'Therapy', tagColor: '#CC2222' },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function MembersPostFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const liked = likedPosts.has(post.id);
        const saved = savedPosts.has(post.id);
        return (
          <article
            key={post.id}
            className="rounded-2xl border p-5 transition-all duration-200 hover:border-opacity-60"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0"
                  style={{ background: `${post.avatarColor}22`, color: post.avatarColor, border: `1.5px solid ${post.avatarColor}55` }}
                >
                  {post.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-700">{post.author}</span>
                    <ClergryRankBadge rank={post.rank} size="sm" showIcon={false} />
                    {post.tag && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-600"
                        style={{ background: `${post.tagColor}22`, color: post.tagColor, border: `1px solid ${post.tagColor}44` }}
                      >
                        {post.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    @{post.handle} · {post.timeAgo}
                  </p>
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <MoreHorizontal size={15} />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
                  style={{ color: liked ? '#CC2222' : 'var(--muted-foreground)' }}
                >
                  <Flame size={14} fill={liked ? '#CC2222' : 'none'} />
                  {formatNum(post.likes + (liked ? 1 : 0))}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <MessageCircle size={14} />
                  {formatNum(post.comments)}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Share2 size={14} />
                  {formatNum(post.shares)}
                </button>
              </div>
              <button
                onClick={() => toggleSave(post.id)}
                className="p-1.5 rounded-lg transition-all duration-150 hover:bg-muted active:scale-95"
                style={{ color: saved ? 'var(--primary)' : 'var(--muted-foreground)' }}
              >
                <Bookmark size={14} fill={saved ? 'var(--primary)' : 'none'} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
