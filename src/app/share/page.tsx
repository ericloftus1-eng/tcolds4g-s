'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AppLogo from '@/components/ui/AppLogo';
import {
  Copy,
  Check,
  Mail,
  Share2,
  MessageCircle,
} from 'lucide-react';

const SITE_URL = 'https://tcolds3821.builtwithrocket.new/entrance';
const SHARE_TITLE = '⛪ The Church of Laughterday Saints — Where Comedy is the Religion';
const SHARE_DESC =
  "I just joined The Church of Laughterday Saints — a comedy platform where laughter is the gospel and you can actually get ordained. 😂 Earn Cheddar Coins, rise through clergy ranks, and watch the funniest people on the internet preach. Come join the congregation — it's free!";

interface Platform {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
  getUrl: () => string;
}

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export default function SharePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = SITE_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const platforms: Platform[] = [
    {
      id: 'twitter',
      name: 'X / Twitter',
      color: '#000000',
      hoverColor: '#1a1a1a',
      icon: <TwitterIcon />,
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${SHARE_TITLE}\n\n${SHARE_DESC}\n\n👉 ${SITE_URL}`
        )}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#1877F2',
      hoverColor: '#0d6efd',
      icon: <FacebookIcon />,
      getUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(SHARE_DESC)}`,
    },
    {
      id: 'reddit',
      name: 'Reddit',
      color: '#FF4500',
      hoverColor: '#e03d00',
      icon: <RedditIcon />,
      getUrl: () =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(SITE_URL)}&title=${encodeURIComponent(SHARE_TITLE)}`,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: '#25D366',
      hoverColor: '#1ebe5a',
      icon: <WhatsAppIcon />,
      getUrl: () =>
        `https://wa.me/?text=${encodeURIComponent(`${SHARE_DESC}\n\n👉 ${SITE_URL}`)}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: '#0A66C2',
      hoverColor: '#0958a8',
      icon: <LinkedInIcon />,
      getUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#E1306C',
      hoverColor: '#c42762',
      icon: <InstagramIcon />,
      getUrl: () => {
        handleCopy();
        return null as unknown as string;
      },
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      color: '#010101',
      hoverColor: '#2a2a2a',
      icon: <TikTokIcon />,
      getUrl: () => {
        handleCopy();
        return null as unknown as string;
      },
    },
    {
      id: 'email',
      name: 'Email',
      color: '#6B7280',
      hoverColor: '#4B5563',
      icon: <Mail className="w-5 h-5" />,
      getUrl: () =>
        `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(
          `${SHARE_DESC}\n\n👉 ${SITE_URL}`
        )}`,
    },
    {
      id: 'sms',
      name: 'SMS / iMessage',
      color: '#52B788',
      hoverColor: '#3d9e6e',
      icon: <MessageCircle className="w-5 h-5" />,
      getUrl: () =>
        `sms:?body=${encodeURIComponent(`${SHARE_DESC}\n\n👉 ${SITE_URL}`)}`,
    },
  ];

  const handleShare = (platform: Platform) => {
    if (platform.id === 'instagram' || platform.id === 'tiktok') {
      handleCopy();
      return;
    }
    const url = platform.getUrl();
    if (url) {
      window.open(url, '_blank', 'width=640,height=520,noopener,noreferrer');
    }
  };

  const instagramNote = 'Link copied! Paste it in your Instagram/TikTok bio or story.';

  return (
    <AppLayout>
      <div
        className="min-h-screen py-12 px-4"
        style={{ background: 'var(--background)' }}
      >
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'var(--card)', border: '2px solid var(--primary)' }}
              >
                <AppLogo size={52} />
              </div>
            </div>
            <h1
              className="text-3xl font-800 mb-2 tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Spread the Gospel 🕍
            </h1>
            <p className="text-base font-500 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              Share TCoLDS with your congregation. One tap — every platform.
            </p>
          </div>

          {/* Preview Card */}
          <div
            className="rounded-2xl border p-5 mb-8 flex gap-4 items-start"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <AppLogo size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 mb-0.5" style={{ color: 'var(--primary)' }}>
                tcolds3821.builtwithrocket.new
              </p>
              <p className="text-sm font-700 leading-snug mb-1" style={{ color: 'var(--foreground)' }}>
                ⛪ The Church of Laughterday Saints — Where Comedy is the Religion
              </p>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                Join 94,000+ congregation members. Get ordained, earn Cheddar Coins, and rise through the clergy ranks. Comedy is the gospel.
              </p>
            </div>
          </div>

          {/* Copy Link */}
          <div
            className="rounded-2xl border p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Share2 size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              <span
                className="flex-1 text-sm font-500 truncate font-mono"
                style={{ color: 'var(--foreground)' }}
              >
                {SITE_URL}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-700 transition-all duration-200 flex-shrink-0 w-full sm:w-auto"
              style={{
                background: copied ? '#52B788' : 'var(--primary)',
                color: '#fff',
              }}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* Platform Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-600 text-sm transition-all duration-150 active:scale-95 text-white"
                style={{ background: platform.color }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = platform.hoverColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = platform.color;
                }}
                title={
                  platform.id === 'instagram' || platform.id === 'tiktok'
                    ? instagramNote
                    : `Share on ${platform.name}`
                }
              >
                {platform.icon}
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Instagram / TikTok note */}
          <div
            className="rounded-xl border px-4 py-3 text-xs font-500 text-center"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--card)' }}
          >
            📋 <strong>Instagram & TikTok</strong> — clicking those buttons copies the link to your clipboard. Paste it in your bio, story, or DM.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
