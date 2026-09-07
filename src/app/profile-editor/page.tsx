'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Save, X, Edit3, MapPin, Link2, Mic, BookOpen, ArrowLeft, Flame, MessageCircle, Image as ImageIcon } from 'lucide-react';
import ClergryRankBadge, { ClergryRank } from '@/components/ui/ClergryRankBadge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ProfileFormData {
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  instagram: string;
  youtube: string;
  comedyStyle: string;
  avatarColor: string;
  bannerColor: string;
}

const comedyStyles = [
  'Stand-Up', 'Improv', 'Sketch Comedy', 'Dark Comedy', 'Roast Battles',
  'Crowd Work', 'Storytelling', 'Observational', 'Political', 'Self-Deprecating',
  'Absurdist', 'Dry Wit', 'Physical Comedy', 'Satirical'
];

const avatarColors = [
  '#52B788', '#D4AF37', '#CC2222', '#A855F7', '#38BDF8',
  '#E07B39', '#4EA0C0', '#7B4EA0', '#C9A227', '#FF4444',
];

const bannerGradients = [
  { label: 'Crimson Altar', value: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0000 100%)' },
  { label: 'Golden Pulpit', value: 'linear-gradient(135deg, #1a1200 0%, #3d2e00 50%, #1a1200 100%)' },
  { label: 'Midnight Mass', value: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%)' },
  { label: 'Sacred Green', value: 'linear-gradient(135deg, #001a0a 0%, #003d1a 50%, #001a0a 100%)' },
  { label: 'Infernal Blue', value: 'linear-gradient(135deg, #000a1a 0%, #001a3d 50%, #000a1a 100%)' },
  { label: 'Purgatory', value: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' },
];

const myPosts = [
  { id: 'mp1', content: 'My set bombed so hard last night that the venue\'s Yelp review now says "great acoustics for the sound of silence." I\'m framing it. It\'s art.', likes: 1847, comments: 143, timeAgo: '3h ago', tag: 'Field Report', tagColor: '#52B788' },
  { id: 'mp2', content: 'Blessed are the meek, for they shall inherit the earth. But not the good parts. Those go to the people who showed up early and grabbed the front row.', likes: 2910, comments: 188, timeAgo: '1d ago', tag: 'Beatitude', tagColor: '#C9A227' },
  { id: 'mp3', content: 'Just told my therapist I process trauma through comedy. She laughed. Then cried. Then laughed again. I think I cured her. You\'re welcome, science. 🙏', likes: 4821, comments: 312, timeAgo: '2d ago', tag: 'Confession', tagColor: '#CC2222' },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const defaultForm: ProfileFormData = {
  displayName: 'Rev. Cacklesworth',
  handle: 'cacklesworth',
  bio: 'Ordained Minister of the Church of Laughterday Saints. Preaching the gospel of bad jokes and worse timing since 2019. No comedy is bad comedy. 🙏',
  location: 'The Holy City of Punchlines',
  website: 'tcolds.org',
  twitter: 'cacklesworth',
  instagram: 'cacklesworth',
  youtube: '',
  comedyStyle: 'Stand-Up',
  avatarColor: '#52B788',
  bannerColor: bannerGradients[0].value,
};

export default function ProfileEditorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'sermons' | 'saved'>('posts');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileFormData>(defaultForm);
  const [saved, setSaved] = useState<ProfileFormData>(defaultForm);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/members/login');
    }
  }, [user, loading, router]);

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          const loaded: ProfileFormData = {
            displayName: data.full_name || user.user_metadata?.full_name || defaultForm.displayName,
            handle: data.handle || user.email?.split('@')[0] || defaultForm.handle,
            bio: defaultForm.bio,
            location: defaultForm.location,
            website: defaultForm.website,
            twitter: defaultForm.twitter,
            instagram: defaultForm.instagram,
            youtube: defaultForm.youtube,
            comedyStyle: defaultForm.comedyStyle,
            avatarColor: defaultForm.avatarColor,
            bannerColor: defaultForm.bannerColor,
          };
          setForm(loaded);
          setSaved(loaded);
          if (data.avatar_url) setAvatarPreview(data.avatar_url);
        } else {
          const fallback: ProfileFormData = {
            ...defaultForm,
            displayName: user.user_metadata?.full_name || defaultForm.displayName,
            handle: user.email?.split('@')[0] || defaultForm.handle,
          };
          setForm(fallback);
          setSaved(fallback);
        }
      } catch {
        const fallback: ProfileFormData = {
          ...defaultForm,
          displayName: user.user_metadata?.full_name || defaultForm.displayName,
          handle: user.email?.split('@')[0] || defaultForm.handle,
        };
        setForm(fallback);
        setSaved(fallback);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: form.displayName,
          handle: form.handle,
          avatar_url: avatarPreview || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) throw error;

      setSaved(form);
      setIsEditing(false);
      toast.success('Profile saved!');
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(saved);
    setIsEditing(false);
  };

  const rank: ClergryRank = 'Minister';

  if (loading || profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back nav */}
        <Link
          href="/members/home"
          className="inline-flex items-center gap-2 text-sm font-600 mb-5 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft size={15} />
          Back to Homepage
        </Link>

        {/* Hidden file inputs */}
        <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

        {/* Banner */}
        <div
          className="relative rounded-2xl overflow-hidden mb-0"
          style={{
            background: bannerPreview ? undefined : (isEditing ? form.bannerColor : saved.bannerColor),
            height: '140px',
          }}
        >
          {bannerPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerPreview} alt="Profile banner" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 blob-gold opacity-20 pointer-events-none" />
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-wrap gap-2 p-4 justify-center">
                {bannerGradients.map((bg) => (
                  <button
                    key={bg.label}
                    onClick={() => { setForm((f) => ({ ...f, bannerColor: bg.value })); setBannerPreview(null); }}
                    className="w-8 h-8 rounded-lg border-2 transition-all duration-150 hover:scale-110"
                    style={{
                      background: bg.value,
                      borderColor: form.bannerColor === bg.value && !bannerPreview ? 'white' : 'transparent',
                    }}
                    title={bg.label}
                  />
                ))}
                <button
                  onClick={() => bannerFileRef.current?.click()}
                  className="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
                  title="Upload banner photo"
                >
                  <ImageIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile card */}
        <div
          className="rounded-b-2xl border border-t-0 px-4 sm:px-6 pb-5"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-8 mb-4 flex-wrap gap-3">
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-800 border-4 flex-shrink-0 overflow-hidden"
                style={{
                  background: avatarPreview ? undefined : `${isEditing ? form.avatarColor : saved.avatarColor}22`,
                  color: isEditing ? form.avatarColor : saved.avatarColor,
                  borderColor: 'var(--card)',
                  border: `4px solid var(--card)`,
                  boxShadow: `0 0 0 2px ${isEditing ? form.avatarColor : saved.avatarColor}55`,
                }}
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  (isEditing ? form.displayName : saved.displayName).slice(0, 2).toUpperCase()
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => avatarFileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2"
                  style={{ background: 'var(--primary)', borderColor: 'var(--card)', color: 'var(--primary-foreground)' }}
                  title="Upload profile photo"
                >
                  <Camera size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-600 border transition-all duration-150"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--muted)' }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 disabled:opacity-60"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', minHeight: '40px' }}
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 border transition-all duration-150 hover:bg-muted"
                  style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
                >
                  <Edit3 size={14} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Avatar color picker (edit mode) */}
          {isEditing && (
            <div className="mb-4 p-3 rounded-xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-700 mb-2" style={{ color: 'var(--muted-foreground)' }}>Avatar Color (used when no photo)</p>
              <div className="flex gap-2 flex-wrap">
                {avatarColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                    className="w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110"
                    style={{ background: c, borderColor: form.avatarColor === c ? 'white' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Name & rank */}
          {isEditing ? (
            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>Display Name</label>
                  <input
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)', minHeight: '44px' }}
                    placeholder="Your display name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>@</span>
                    <input
                      value={form.handle}
                      onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border"
                      style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)', minHeight: '44px' }}
                      placeholder="yourhandle"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border resize-none"
                  style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="Tell your followers about yourself..."
                />
                <p className="text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>{form.bio.length}/200</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-700 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <MapPin size={11} /> Location
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)', minHeight: '44px' }}
                    placeholder="Your city"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-700 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Link2 size={11} /> Website
                  </label>
                  <input
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)', minHeight: '44px' }}
                    placeholder="yoursite.com"
                  />
                </div>
              </div>
              {/* Social links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'twitter', placeholder: 'twitter handle', color: '#1DA1F2' },
                  { key: 'instagram', placeholder: 'instagram handle', color: '#E1306C' },
                  { key: 'youtube', placeholder: 'youtube handle', color: '#FF0000' },
                ].map(({ key, placeholder, color }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-700 flex items-center gap-1" style={{ color }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      value={form[key as keyof ProfileFormData]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 border"
                      style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)', minHeight: '44px' }}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
              {/* Comedy style */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-700 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <Mic size={11} /> Comedy Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {comedyStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, comedyStyle: style }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-600 border transition-all duration-150"
                      style={{
                        borderColor: form.comedyStyle === style ? 'var(--primary)' : 'var(--border)',
                        background: form.comedyStyle === style ? 'rgba(139,26,26,0.15)' : 'var(--muted)',
                        color: form.comedyStyle === style ? 'var(--primary)' : 'var(--muted-foreground)',
                        minHeight: '36px',
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-lg sm:text-xl font-800">{saved.displayName}</h1>
                <ClergryRankBadge rank={rank} size="sm" showIcon />
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>@{saved.handle}</p>
              <p className="text-sm leading-relaxed mt-2 max-w-lg" style={{ color: 'var(--foreground)' }}>{saved.bio}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {saved.location && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <MapPin size={12} /> {saved.location}
                  </span>
                )}
                {saved.website && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--primary)' }}>
                    <Link2 size={12} /> {saved.website}
                  </span>
                )}
                {saved.twitter && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#1DA1F2' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5.3 4.4 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> @{saved.twitter}
                  </span>
                )}
                {saved.instagram && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#E1306C' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> @{saved.instagram}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-600 px-2 py-0.5 rounded-full" style={{ background: 'rgba(82,183,136,0.15)', color: '#52B788' }}>
                  <Mic size={10} className="inline mr-1" />{saved.comedyStyle}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 py-3 border-t border-b flex-wrap" style={{ borderColor: 'var(--border)' }}>
            {[
              { label: 'Posts', value: '47' },
              { label: 'Followers', value: '38K' },
              { label: 'Following', value: '214' },
              { label: 'Cheddar CC', value: '1,240' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-mono-data font-700 text-base">{stat.value}</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content tabs */}
        <div className="mt-5">
          <div
            className="flex p-1 rounded-xl mb-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {(['posts', 'sermons', 'saved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg text-xs font-700 transition-all duration-150 capitalize"
                style={{
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  minHeight: '40px',
                }}
              >
                {tab === 'posts' ? '🔥 Posts' : tab === 'sermons' ? '🎤 Sermons' : '🔖 Saved'}
              </button>
            ))}
          </div>

          {activeTab === 'posts' && (
            <div className="flex flex-col gap-4">
              {myPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border p-4 sm:p-5"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-600"
                      style={{ background: `${post.tagColor}22`, color: post.tagColor, border: `1px solid ${post.tagColor}44` }}
                    >
                      {post.tag}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{post.timeAgo}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>{post.content}</p>
                  <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Flame size={13} /> {formatNum(post.likes)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <MessageCircle size={13} /> {formatNum(post.comments)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'sermons' && (
            <div
              className="rounded-2xl border p-8 flex flex-col items-center gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <Mic size={32} style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>No sermons uploaded yet</p>
              <Link
                href="/upload-studio"
                className="px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Upload Your First Sermon
              </Link>
            </div>
          )}

          {activeTab === 'saved' && (
            <div
              className="rounded-2xl border p-8 flex flex-col items-center gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <BookOpen size={32} style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>No saved content yet</p>
              <Link
                href="/pulpit"
                className="px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Browse the Pulpit
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
