'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import MembersSidebar from './components/MembersSidebar';
import InviteLinkGenerator from '@/components/InviteLinkGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Bell, Plus, Flame, Bookmark, MoreHorizontal, MessageCircle, Share2, Edit3, Camera, Archive, X, Image as ImageIcon, Lock, Globe, Settings } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────────────────────────
interface MemberPost {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  tag?: string;
  tagColor?: string;
  archiveFolder?: 'sinkers' | 'bobbers' | 'floaters' | 'bangers';
}

interface ArchiveSettings {
  sinkerThreshold: number;
  bobberThreshold: number;
  floaterThreshold: number;
  bangerThreshold: number;
  sinkerName: string;
  bobberName: string;
  floaterName: string;
  bangerName: string;
}

// ── Mock member posts ──────────────────────────────────────────────────────
const initialPosts: MemberPost[] = [
  {
    id: 'mp1',
    content: 'Tested this one at the open mic last night — "I told my doctor I broke my arm in two places. He told me to stop going to those places." Dead silence. Then one guy in the back lost it. That\'s a banger in the making.',
    likes: 847,
    comments: 62,
    shares: 134,
    timeAgo: '2h ago',
    tag: 'Test Material',
    tagColor: '#52B788',
    archiveFolder: 'floaters',
  },
  {
    id: 'mp2',
    content: 'New bit: "My GPS has trust issues. Every time I make a turn it says \'recalculating\' like it\'s disappointed in me. Same energy as my dad."',
    likes: 2341,
    comments: 189,
    shares: 412,
    timeAgo: '1d ago',
    tag: 'New Bit',
    tagColor: '#D4AF37',
    archiveFolder: 'bangers',
  },
  {
    id: 'mp3',
    content: 'Crowd work experiment: asked the front row what they do for work. Accountant, nurse, and a guy who "does stuff." Spent 8 minutes on the guy who does stuff. Best 8 minutes of my career.',
    likes: 156,
    comments: 23,
    shares: 31,
    timeAgo: '3d ago',
    tag: 'Crowd Work',
    tagColor: '#4EA0C0',
    archiveFolder: 'bobbers',
  },
  {
    id: 'mp4',
    content: 'Tried a bit about airline food. Yes, airline food. In 2025. It bombed so hard the venue asked me to leave. Putting this one in the vault.',
    likes: 12,
    comments: 4,
    shares: 2,
    timeAgo: '5d ago',
    tag: 'Bombed',
    tagColor: '#8A8070',
    archiveFolder: 'sinkers',
  },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function getArchiveFolder(likes: number, settings: ArchiveSettings): 'sinkers' | 'bobbers' | 'floaters' | 'bangers' {
  if (likes >= settings.bangerThreshold) return 'bangers';
  if (likes >= settings.floaterThreshold) return 'floaters';
  if (likes >= settings.bobberThreshold) return 'bobbers';
  return 'sinkers';
}

// ── Post Card ──────────────────────────────────────────────────────────────
function PostCard({
  post, liked, saved, onLike, onSave, folderName, folderColor,
}: {
  post: MemberPost;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  folderName: string;
  folderColor: string;
}) {
  return (
    <article
      className="rounded-2xl border p-4 sm:p-5 transition-all duration-200"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {post.tag && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-600"
              style={{ background: `${post.tagColor}22`, color: post.tagColor, border: `1px solid ${post.tagColor}44` }}
            >
              {post.tag}
            </span>
          )}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-600"
            style={{ background: `${folderColor}18`, color: folderColor, border: `1px solid ${folderColor}33` }}
          >
            {folderName}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{post.timeAgo}</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>
          <MoreHorizontal size={15} />
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>{post.content}</p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={onLike}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
            style={{ color: liked ? '#CC2222' : 'var(--muted-foreground)' }}
          >
            <Flame size={14} fill={liked ? '#CC2222' : 'none'} />
            <span>{formatNum(post.likes + (liked ? 1 : 0))}</span>
          </button>
          <button
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <MessageCircle size={14} />
            <span>{formatNum(post.comments)}</span>
          </button>
          <button
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted active:scale-95"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">{formatNum(post.shares)}</span>
          </button>
        </div>
        <button
          onClick={onSave}
          className="p-1.5 rounded-lg transition-all duration-150 hover:bg-muted active:scale-95"
          style={{ color: saved ? 'var(--primary)' : 'var(--muted-foreground)' }}
        >
          <Bookmark size={14} fill={saved ? 'var(--primary)' : 'none'} />
        </button>
      </div>
    </article>
  );
}

// ── Archive Settings Modal ─────────────────────────────────────────────────
function ArchiveSettingsModal({
  isOpen, onClose, settings, onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: ArchiveSettings;
  onSave: (s: ArchiveSettings) => void;
}) {
  const [local, setLocal] = useState(settings);

  useEffect(() => { setLocal(settings); }, [settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-700 text-base">Archive Settings</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Customize folder names and like thresholds</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {([
            { key: 'sinker', color: '#8A8070', desc: 'Posts with fewest likes' },
            { key: 'bobber', color: '#4EA0C0', desc: 'Posts with some likes' },
            { key: 'floater', color: '#52B788', desc: 'Posts with more likes' },
            { key: 'banger', color: '#D4AF37', desc: 'Posts with most likes' },
          ] as const).map(({ key, color, desc }) => (
            <div key={key} className="p-3 rounded-xl border" style={{ borderColor: `${color}44`, background: `${color}08` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-xs font-700" style={{ color }}>{desc}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-600 mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Folder Name</label>
                  <input
                    value={local[`${key}Name` as keyof ArchiveSettings] as string}
                    onChange={(e) => setLocal((s) => ({ ...s, [`${key}Name`]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded-lg text-xs border outline-none"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1) + 's'}
                  />
                </div>
                {key !== 'sinker' && (
                  <div>
                    <label className="text-xs font-600 mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Min Likes</label>
                    <input
                      type="number"
                      value={local[`${key}Threshold` as keyof ArchiveSettings] as number}
                      onChange={(e) => setLocal((s) => ({ ...s, [`${key}Threshold`]: parseInt(e.target.value) || 0 }))}
                      className="w-full px-2 py-1.5 rounded-lg text-xs border outline-none"
                      style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      min={0}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-600 border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(local); onClose(); toast.success('Archive settings saved!'); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-700"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Post Modal ─────────────────────────────────────────────────────────
function NewPostModal({
  isOpen, onClose, onPost, memberInitials, memberColor,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, image?: string) => void;
  memberInitials: string;
  memberColor: string;
}) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!text.trim()) return;
    onPost(text.trim(), imagePreview || undefined);
    setText('');
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-sm font-700">Post to Your Homepage</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
              style={{ background: `${memberColor}22`, color: memberColor, border: `1.5px solid ${memberColor}55` }}
            >
              {memberInitials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Lock size={11} style={{ color: 'var(--muted-foreground)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Followers only · won&apos;t appear in the Pulpit</span>
              </div>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Test your material here. Your followers will see this..."
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border resize-none"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <p className="text-xs text-right mt-1" style={{ color: 'var(--muted-foreground)' }}>{text.length}/500</p>
            </div>
          </div>

          {imagePreview && (
            <div className="relative mb-3 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Post image preview" className="w-full max-h-48 object-cover rounded-xl" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-600 border transition-all hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <ImageIcon size={14} />
              Add Photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-600 border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                Cancel
              </button>
              <button
                disabled={!text.trim()}
                onClick={handlePost}
                className="px-4 py-2 rounded-lg text-xs font-700 transition-all disabled:opacity-50"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MembersHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [archiveSettingsOpen, setArchiveSettingsOpen] = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<MemberPost[]>(initialPosts);
  const [activeArchiveFolder, setActiveArchiveFolder] = useState<'all' | 'sinkers' | 'bobbers' | 'floaters' | 'bangers'>('all');

  const [archiveSettings, setArchiveSettings] = useState<ArchiveSettings>({
    sinkerThreshold: 0,
    bobberThreshold: 100,
    floaterThreshold: 500,
    bangerThreshold: 1000,
    sinkerName: 'Sinkers',
    bobberName: 'Bobbers',
    floaterName: 'Floaters',
    bangerName: 'Bangers',
  });

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/members/login');
    }
  }, [user, loading, router]);

  const displayName = user?.user_metadata?.full_name || 'Rev. Cacklesworth';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const memberColor = '#52B788';

  const memberData = {
    name: displayName,
    handle: user?.email?.split('@')[0] || 'cacklesworth',
    rank: 'Minister' as ClergryRank,
    initials,
    avatarColor: memberColor,
    coins: 1240,
    followers: 38000,
    following: 214,
    posts: posts.length,
  };

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

  const handleNewPost = (content: string, image?: string) => {
    const newPost: MemberPost = {
      id: `mp-${Date.now()}`,
      content,
      image,
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: 'just now',
      tag: 'New',
      tagColor: '#52B788',
      archiveFolder: 'sinkers',
    };
    setPosts((prev) => [newPost, ...prev]);
    toast.success('Posted to your homepage! Your followers can see this.');
  };

  const getFolderColor = (folder: string) => {
    const map: Record<string, string> = {
      sinkers: '#8A8070',
      bobbers: '#4EA0C0',
      floaters: '#52B788',
      bangers: '#D4AF37',
    };
    return map[folder] || 'var(--muted-foreground)';
  };

  const getFolderName = (folder: string) => {
    const map: Record<string, string> = {
      sinkers: archiveSettings.sinkerName,
      bobbers: archiveSettings.bobberName,
      floaters: archiveSettings.floaterName,
      bangers: archiveSettings.bangerName,
    };
    return map[folder] || folder;
  };

  const postsWithFolders = posts.map((p) => ({
    ...p,
    archiveFolder: getArchiveFolder(p.likes, archiveSettings),
  }));

  const filteredPosts = activeArchiveFolder === 'all'
    ? postsWithFolders
    : postsWithFolders.filter((p) => p.archiveFolder === activeArchiveFolder);

  const folderCounts = {
    sinkers: postsWithFolders.filter((p) => p.archiveFolder === 'sinkers').length,
    bobbers: postsWithFolders.filter((p) => p.archiveFolder === 'bobbers').length,
    floaters: postsWithFolders.filter((p) => p.archiveFolder === 'floaters').length,
    bangers: postsWithFolders.filter((p) => p.archiveFolder === 'bangers').length,
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)' }} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <InviteLinkGenerator
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        memberName={memberData.name}
        memberInitials={memberData.initials}
        memberColor={memberData.avatarColor}
        memberRank={memberData.rank}
        memberHandle={memberData.handle}
      />
      <ArchiveSettingsModal
        isOpen={archiveSettingsOpen}
        onClose={() => setArchiveSettingsOpen(false)}
        settings={archiveSettings}
        onSave={setArchiveSettings}
      />
      <NewPostModal
        isOpen={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        onPost={handleNewPost}
        memberInitials={memberData.initials}
        memberColor={memberData.avatarColor}
      />

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 2xl:px-16 py-4 sm:py-6">

        {/* ── Profile Header ── */}
        <div
          className="rounded-2xl border p-4 sm:p-6 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #141414 0%, #1a0800 60%, #141414 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 blob-gold opacity-15 pointer-events-none" />
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/profile-editor">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-800 flex-shrink-0 cursor-pointer hover:ring-2 transition-all relative"
                  style={{ background: `${memberData.avatarColor}22`, color: memberData.avatarColor, border: `2px solid ${memberData.avatarColor}55` }}
                >
                  {memberData.initials}
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
                    style={{ background: 'var(--primary)', borderColor: 'var(--card)', color: 'var(--primary-foreground)' }}
                  >
                    <Camera size={10} />
                  </div>
                </div>
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-base sm:text-xl font-800">{memberData.name}</h1>
                  <ClergryRankBadge rank={memberData.rank} size="sm" showIcon />
                </div>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  @{memberData.handle}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Lock size={11} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Followers-only feed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border"
                style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.3)' }}
              >
                <Coins size={13} style={{ color: 'var(--primary)' }} />
                <span className="font-mono-data font-700 text-xs sm:text-sm text-gold">{memberData.coins.toLocaleString()} CC</span>
              </div>
              <button
                onClick={() => setNewPostOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-700 transition-all duration-150 active:scale-95 gold-gradient"
                style={{ color: 'var(--primary-foreground)' }}
              >
                <Plus size={13} />
                <span>New Post</span>
              </button>
              <Link
                href="/profile-editor"
                className="p-2 rounded-xl border transition-all duration-150 hover:bg-muted"
                style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
                title="Edit your profile"
              >
                <Edit3 size={15} />
              </Link>
              <Link
                href="/settings"
                className="p-2 rounded-xl border transition-all duration-150 hover:bg-muted"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                title="Settings"
              >
                <Bell size={15} />
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="relative flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t flex-wrap" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Posts', value: memberData.posts },
              { label: 'Followers', value: `${(memberData.followers / 1000).toFixed(0)}K` },
              { label: 'Following', value: memberData.following },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-mono-data font-700 text-sm sm:text-base">{stat.value}</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 border transition-all hover:bg-muted"
                style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
              >
                <Globe size={12} />
                Go to Pulpit
              </Link>
            </div>
          </div>
        </div>

        {/* ── Homepage info banner ── */}
        <div
          className="rounded-xl border p-3 mb-5 flex items-start gap-3"
          style={{ background: 'rgba(82,183,136,0.06)', borderColor: 'rgba(82,183,136,0.25)' }}
        >
          <Lock size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#52B788' }} />
          <div>
            <p className="text-xs font-700" style={{ color: '#52B788' }}>Your Personal Homepage</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Posts here are <strong style={{ color: 'var(--foreground)' }}>followers-only</strong> and do not appear in the Pulpit community feed.
              Use this space to test material with your audience. To post to the community, go to the{' '}
              <Link href="/" className="underline" style={{ color: 'var(--primary)' }}>Pulpit</Link>.
            </p>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex gap-5 items-start">
          {/* Center — Posts + Archive */}
          <div className="flex-1 min-w-0">
            {/* Archive folder tabs */}
            <div
              className="rounded-2xl border p-4 mb-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Archive size={15} style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-700">My Archive</span>
                </div>
                <button
                  onClick={() => setArchiveSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-600 border transition-all hover:bg-muted"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                >
                  <Settings size={12} />
                  Settings
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveArchiveFolder('all')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-all"
                  style={{
                    background: activeArchiveFolder === 'all' ? 'var(--primary)' : 'var(--muted)',
                    borderColor: activeArchiveFolder === 'all' ? 'var(--primary)' : 'var(--border)',
                    color: activeArchiveFolder === 'all' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  }}
                >
                  All ({posts.length})
                </button>
                {(['sinkers', 'bobbers', 'floaters', 'bangers'] as const).map((folder) => {
                  const color = getFolderColor(folder);
                  const name = getFolderName(folder);
                  const count = folderCounts[folder];
                  return (
                    <button
                      key={folder}
                      onClick={() => setActiveArchiveFolder(folder)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-all"
                      style={{
                        background: activeArchiveFolder === folder ? `${color}22` : 'var(--muted)',
                        borderColor: activeArchiveFolder === folder ? color : 'var(--border)',
                        color: activeArchiveFolder === folder ? color : 'var(--muted-foreground)',
                      }}
                    >
                      {name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-4">
              {filteredPosts.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 flex flex-col items-center gap-3 text-center"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <Archive size={32} style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>No posts in this folder yet</p>
                  <button
                    onClick={() => setNewPostOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-700"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    Create Your First Post
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.has(post.id)}
                    saved={savedPosts.has(post.id)}
                    onLike={() => toggleLike(post.id)}
                    onSave={() => toggleSave(post.id)}
                    folderName={getFolderName(post.archiveFolder || 'sinkers')}
                    folderColor={getFolderColor(post.archiveFolder || 'sinkers')}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block w-80 2xl:w-96 flex-shrink-0 space-y-5">
            <MembersSidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="xl:hidden mt-6 space-y-5">
          <MembersSidebar />
        </div>
      </div>
    </AppLayout>
  );
}
