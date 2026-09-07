'use client';
import React, { useState } from 'react';
import { Play, Heart, Eye, MessageCircle, Share2, Lock } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from './ClergryRankBadge';
import CheddarCoinWidget from './CheddarCoinWidget';

export interface VideoPost {
  id: string;
  title: string;
  excerpt: string;
  comedian: string;
  comedianHandle: string;
  rank: ClergryRank;
  thumbnailColor: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  postedAt: string;
  isLive?: boolean;
  isBasement?: boolean;
  isMass?: boolean;
  tags: string[];
}

interface VideoCardProps {
  post: VideoPost;
  layout?: 'feed' | 'grid';
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function VideoCard({ post, layout = 'feed' }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // BACKEND: POST /api/posts/{post.id}/like
  };

  if (layout === 'grid') {
    return (
      <div
        className="group relative rounded-xl overflow-hidden border card-hover cursor-pointer"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Thumbnail */}
        <div
          className="relative aspect-video flex items-center justify-center"
          style={{ background: post.thumbnailColor }}
        >
          {post.isBasement && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Lock size={24} style={{ color: 'var(--muted-foreground)' }} />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <Play size={16} style={{ color: 'var(--foreground)' }} fill="currentColor" />
            </div>
          </div>
          {post.isLive && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-700 live-pulse"
              style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
            >
              ● LIVE
            </span>
          )}
          {post.isMass && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-700"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              ⛪ MASS
            </span>
          )}
          <span
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono-data"
            style={{ background: 'rgba(0,0,0,0.8)', color: 'var(--foreground)' }}
          >
            {post.duration}
          </span>
        </div>
        {/* Info */}
        <div className="p-3">
          <p className="text-sm font-600 line-clamp-1" style={{ color: 'var(--foreground)' }}>
            {post.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {post.comedian}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)' }}>
              <Eye size={10} className="inline mr-0.5" />
              {formatCount(post.views)}
            </span>
            <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)' }}>
              <Heart size={10} className="inline mr-0.5" />
              {formatCount(likeCount)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border card-hover transition-all duration-200"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${post.thumbnailColor}, var(--secondary))`,
            color: '#fff',
          }}
        >
          {post.comedian.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-600">{post.comedian}</span>
            <ClergryRankBadge rank={post.rank} size="sm" />
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            @{post.comedianHandle} · {post.postedAt}
          </p>
        </div>
        <CheddarCoinWidget recipientName={post.comedian} compact />
      </div>

      {/* Thumbnail */}
      <div
        className="mx-4 rounded-xl overflow-hidden relative aspect-video flex items-center justify-center cursor-pointer group"
        style={{ background: post.thumbnailColor }}
      >
        {post.isBasement ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-2">
            <Lock size={32} style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
              Basement Access Required
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              <Play size={24} style={{ color: '#fff' }} fill="white" />
            </div>
          </div>
        )}
        {post.isLive && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-700 live-pulse flex items-center gap-1"
            style={{ background: 'var(--secondary)', color: '#fff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE NOW
          </span>
        )}
        {post.isMass && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-700"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            ⛪ MASS EVENT
          </span>
        )}
        <span
          className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-mono-data font-600"
          style={{ background: 'rgba(0,0,0,0.8)', color: '#fff' }}
        >
          {post.duration}
        </span>
      </div>

      {/* Title + tags */}
      <div className="px-4 pt-3">
        <p className="font-600 text-sm leading-snug" style={{ color: 'var(--foreground)' }}>
          {post.title}
        </p>
        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
          {post.excerpt}
        </p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={`tag-${post.id}-${tag}`}
              className="text-xs px-2 py-0.5 rounded-full font-500"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 px-4 py-3 mt-2 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 transition-all duration-150 active:scale-95 hover:bg-muted"
          style={{ color: liked ? 'var(--secondary)' : 'var(--muted-foreground)' }}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          <span className="font-mono-data">{formatCount(likeCount)}</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 transition-all duration-150 active:scale-95 hover:bg-muted"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <MessageCircle size={14} />
          <span className="font-mono-data">{formatCount(post.comments)}</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 transition-all duration-150 active:scale-95 hover:bg-muted"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Eye size={14} />
          <span className="font-mono-data">{formatCount(post.views)}</span>
        </button>
        <button
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 transition-all duration-150 active:scale-95 hover:bg-muted"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  );
}