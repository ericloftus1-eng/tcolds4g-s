'use client';
import React, { useState, useRef, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';
import {
  Coins,
  Crown,
  Flame,
  TrendingUp,
  Star,
  Zap,
  Award,
  ChevronRight,
  Lock,
  CheckCircle,
  ArrowUp,
  Sparkles,
  Users,
  Upload,
  X,
  ImageIcon,
  RefreshCw,
  RotateCcw,
  Sliders,
} from 'lucide-react';

// ─── Tier definitions ────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'medium',
    name: 'Medium Cheddar',
    abbr: 'MC',
    tagline: 'The First Slice',
    desc: 'Your first minted coin. Proof you showed up, cracked a joke, and the congregation laughed.',
    minCC: 500,
    color: '#E8A020',
    glow: 'rgba(232,160,32,0.35)',
    border: 'rgba(232,160,32,0.5)',
    bg: 'rgba(232,160,32,0.08)',
    perks: ['Personal coin minted to your profile', 'Medium Cheddar badge on posts', 'Access to MC holders lounge'],
    coinColor1: '#FFD060',
    coinColor2: '#C07010',
    coinShadow: '#7A4A00',
    multiplier: '1×',
    holders: 1842,
  },
  {
    id: 'sharp',
    name: 'Sharp Cheddar',
    abbr: 'SC',
    tagline: 'The Aged Reserve',
    desc: 'Aged to perfection. Your coin carries real weight — the congregation knows your name.',
    minCC: 5000,
    color: '#D4AF37',
    glow: 'rgba(212,175,55,0.4)',
    border: 'rgba(212,175,55,0.55)',
    bg: 'rgba(212,175,55,0.1)',
    perks: ['Upgraded coin design with gold rim', 'Sharp Cheddar badge + profile glow', 'Coin value multiplier 2.5×', 'Priority merch queue access'],
    coinColor1: '#FFE080',
    coinColor2: '#B8860B',
    coinShadow: '#5A3A00',
    multiplier: '2.5×',
    holders: 614,
  },
  {
    id: 'extra-sharp',
    name: 'Extra Sharp Cheddar',
    abbr: 'ESC',
    tagline: 'The Gold Standard',
    desc: 'The rarest cut. Your coin is the platform gold standard — Cheddar Coin itself bows to you.',
    minCC: 25000,
    color: '#FF9F1C',
    glow: 'rgba(255,159,28,0.45)',
    border: 'rgba(255,159,28,0.6)',
    bg: 'rgba(255,159,28,0.1)',
    perks: ['Legendary animated coin on profile', 'Extra Sharp badge + animated border', 'Coin value multiplier 5×', 'Big Cheese title eligibility', 'Governance vote weight ×3', 'Exclusive ESC holder elections'],
    coinColor1: '#FFF0A0',
    coinColor2: '#E07B00',
    coinShadow: '#3D2000',
    multiplier: '5×',
    holders: 87,
  },
];

// ─── Coin filter presets ──────────────────────────────────────────────────────
const COIN_FILTERS = [
  {
    id: 'tarnished',
    label: 'Tarnished',
    desc: 'Faded & aged with depth',
    emoji: '🪙',
    svgFilter: (uid: string) => (
      <filter id={`heads-filter-${uid}`} colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
        {/* Desaturate slightly and darken edges for tarnished look */}
        <feColorMatrix type="saturate" values="0.72" result="desat" />
        <feColorMatrix
          in="desat"
          type="matrix"
          result="tarnish"
          values="0.88 0.05 0.02 0 0.040.04 0.82 0.04 0 0.020.02 0.03 0.78 0 0.010 0 0 1 0"
        />
        {/* Add a subtle vignette-like darkening via composite */}
        <feBlend in="tarnish" in2="tarnish" mode="normal" result="out" />
      </filter>
    ),
    overlayOpacity: 0.22,
    overlayColor: '#3b2800',
  },
  {
    id: 'patina',
    label: 'Patina',
    desc: 'Green-bronze oxidized',
    emoji: '🟢',
    svgFilter: (uid: string) => (
      <filter id={`heads-filter-${uid}`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0.6" result="desat" />
        <feColorMatrix
          in="desat"
          type="matrix"
          result="patina"
          values="0.7 0.1 0.05 0 0.020.05 0.85 0.15 0 0.060.05 0.15 0.75 0 0.040 0 0 1 0"
        />
      </filter>
    ),
    overlayOpacity: 0.18,
    overlayColor: '#1a4a2a',
  },
  {
    id: 'burnished',
    label: 'Burnished',
    desc: 'Deep warm copper glow',
    emoji: '🔥',
    svgFilter: (uid: string) => (
      <filter id={`heads-filter-${uid}`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="1.3" result="sat" />
        <feColorMatrix
          in="sat"
          type="matrix"
          result="burnish"
          values="1.1 0.08 0 0 0.060.02 0.88 0 0 0.010 0 0.72 0 00 0 0 1 0"
        />
      </filter>
    ),
    overlayOpacity: 0.15,
    overlayColor: '#7a2800',
  },
  {
    id: 'silver',
    label: 'Silver',
    desc: 'Cool metallic sheen',
    emoji: '⚪',
    svgFilter: (uid: string) => (
      <filter id={`heads-filter-${uid}`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0.2" result="desat" />
        <feColorMatrix
          in="desat"
          type="matrix"
          result="silver"
          values="0.9 0.05 0.05 0 0.080.05 0.9 0.05 0 0.080.05 0.05 0.95 0 0.10 0 0 1 0"
        />
      </filter>
    ),
    overlayOpacity: 0.1,
    overlayColor: '#c0c8d8',
  },
  {
    id: 'none',
    label: 'Original',
    desc: 'No filter applied',
    emoji: '✨',
    svgFilter: (_uid: string) => null,
    overlayOpacity: 0,
    overlayColor: 'transparent',
  },
];

// ─── Big Cheese leaderboard ───────────────────────────────────────────────────
const BIG_CHEESES = [
  { rank: 1, name: 'Archbishop Thunderpants', handle: 'thunderpants', initials: 'AT', color: '#E07B39', tier: 'extra-sharp', coinValue: '142,800 CC', title: 'The Big Cheese', crown: true },
  { rank: 2, name: 'Rev. Punchline McGee', handle: 'punchlinemcgee', initials: 'PM', color: '#D4AF37', tier: 'extra-sharp', coinValue: '98,400 CC', title: 'Grand Fromage', crown: false },
  { rank: 3, name: 'Sister Snickerdoodle', handle: 'snickerdoodle', initials: 'SS', color: '#52B788', tier: 'extra-sharp', coinValue: '76,200 CC', title: 'Cheese Whisperer', crown: false },
  { rank: 4, name: 'Bishop Snortley', handle: 'snortley', initials: 'BS', color: '#7B4EA0', tier: 'sharp', coinValue: '61,500 CC', title: 'Sharp Operator', crown: false },
  { rank: 5, name: 'Deacon Wheezington', handle: 'wheezington', initials: 'DW', color: '#4EA0C0', tier: 'sharp', coinValue: '44,100 CC', title: 'Aged to Perfection', crown: false },
];

const MY_COIN_BALANCE = 1240;

// ─── Minting cost logic ───────────────────────────────────────────────────────
const FIRST_MINT_COST = 500;
const SUBSEQUENT_MINT_COST = 287;

function getMintCost(mintedCount: number): number {
  return mintedCount === 0 ? FIRST_MINT_COST : SUBSEQUENT_MINT_COST;
}

// ─── Popularity-based coin value ──────────────────────────────────────────────
// Popularity score is derived from platform activity (posts, blessings, followers, etc.)
// For display purposes, we show how popularity affects coin value
const POPULARITY_TIERS = [
  { label: 'Newcomer', minScore: 0, multiplier: 1.0, color: '#888', desc: 'Just getting started' },
  { label: 'Rising', minScore: 100, multiplier: 1.5, color: '#52B788', desc: 'Gaining congregation attention' },
  { label: 'Known', minScore: 500, multiplier: 2.2, color: '#4EA0C0', desc: 'The congregation knows your name' },
  { label: 'Popular', minScore: 1500, multiplier: 3.5, color: '#D4AF37', desc: 'A beloved figure in the pews' },
  { label: 'Legendary', minScore: 5000, multiplier: 6.0, color: '#FF9F1C', desc: 'Platform icon — your coin is gold' },
];

function getPopularityTier(score: number) {
  let result = POPULARITY_TIERS[0];
  for (const tier of POPULARITY_TIERS) {
    if (score >= tier.minScore) result = tier;
  }
  return result;
}

// ─── Tier coin SVG (heads) ────────────────────────────────────────────────────
function TierCoinSVG({
  tier,
  size = 80,
  imageUrl,
  coinFilter,
}: {
  tier: typeof TIERS[0];
  size?: number;
  imageUrl?: string | null;
  coinFilter?: typeof COIN_FILTERS[0] | null;
}) {
  const uid = `${tier.id}-${size}`;
  const clipId = `clip-${uid}`;
  const filterId = `heads-filter-${uid}`;
  const filterDef = coinFilter && coinFilter.id !== 'none' ? coinFilter.svgFilter(uid) : null;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`tcg-${uid}`} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor={tier.coinColor1} />
          <stop offset="45%" stopColor={tier.color} />
          <stop offset="100%" stopColor={tier.coinShadow} />
        </radialGradient>
        <radialGradient id={`tcs-${uid}`} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {/* Tarnish vignette gradient for depth */}
        <radialGradient id={`tvign-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a0d00" stopOpacity="0.55" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="43" />
        </clipPath>
        {filterDef}
      </defs>
      {/* Shadow */}
      <circle cx="50" cy="52" r="46" fill={tier.coinShadow} opacity="0.4" />
      {/* Rim */}
      <circle cx="50" cy="50" r="47" fill={tier.coinColor2} />
      {/* Face — apply tarnish filter to the base gradient when filter active */}
      <circle
        cx="50"
        cy="50"
        r="43"
        fill={`url(#tcg-${uid})`}
        filter={filterDef ? `url(#${filterId})` : undefined}
      />
      {/* Custom image overlay */}
      {imageUrl && (
        <image
          href={imageUrl}
          x="7"
          y="7"
          width="86"
          height="86"
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
          opacity="0.85"
          filter={filterDef ? `url(#${filterId})` : undefined}
        />
      )}
      {/* Tarnish depth overlay — darkens edges for aged depth effect */}
      {coinFilter && coinFilter.id !== 'none' && (
        <>
          <circle
            cx="50"
            cy="50"
            r="43"
            fill={`url(#tvign-${uid})`}
            clipPath={`url(#${clipId})`}
          />
          {/* Subtle color tint overlay for the filter style */}
          <circle
            cx="50"
            cy="50"
            r="43"
            fill={coinFilter.overlayColor}
            opacity={coinFilter.overlayOpacity}
            clipPath={`url(#${clipId})`}
          />
          {/* Scratch/texture lines for aged feel */}
          <line x1="18" y1="32" x2="28" y2="38" stroke="white" strokeWidth="0.4" opacity="0.08" clipPath={`url(#${clipId})`} />
          <line x1="65" y1="20" x2="72" y2="30" stroke="white" strokeWidth="0.3" opacity="0.06" clipPath={`url(#${clipId})`} />
          <line x1="72" y1="65" x2="80" y2="72" stroke="white" strokeWidth="0.35" opacity="0.07" clipPath={`url(#${clipId})`} />
        </>
      )}
      {/* Inner groove */}
      <circle cx="50" cy="50" r="38.5" fill="none" stroke={tier.coinShadow} strokeWidth="1.2" opacity="0.7" />
      {/* Abbr text — only show if no image */}
      {!imageUrl && (
        <>
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="monospace" fill={tier.coinShadow} letterSpacing="1">{tier.abbr}</text>
          <text x="49.5" y="54.5" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="monospace" fill={tier.coinColor1} letterSpacing="1" opacity="0.6">{tier.abbr}</text>
        </>
      )}
      {/* Specular */}
      <circle cx="50" cy="50" r="43" fill={`url(#tcs-${uid})`} />
      <ellipse cx="30" cy="26" rx="9" ry="5" fill="white" opacity="0.2" transform="rotate(-30, 30, 26)" />
    </svg>
  );
}

// ─── Tails coin SVG (sepia style) ────────────────────────────────────────────
function TailsCoinSVG({ tier, size = 80, imageUrl }: { tier: typeof TIERS[0]; size?: number; imageUrl?: string | null }) {
  const clipId = `tails-clip-${tier.id}-${size}`;
  const filterId = `sepia-duotone-${tier.id}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`tails-g-${tier.id}`} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#d4b483" />
          <stop offset="45%" stopColor="#9a7040" />
          <stop offset="100%" stopColor="#4a3010" />
        </radialGradient>
        <radialGradient id={`tails-s-${tier.id}`} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="43" />
        </clipPath>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            result="grayscale"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
          <feComponentTransfer colorInterpolationFilters="sRGB" result="duotone">
            <feFuncR type="table" tableValues="0.231 0.961" />
            <feFuncG type="table" tableValues="0.122 0.875" />
            <feFuncB type="table" tableValues="0.000 0.627" />
            <feFuncA type="table" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </defs>
      {/* Shadow */}
      <circle cx="50" cy="52" r="46" fill="#2a1800" opacity="0.45" />
      {/* Rim */}
      <circle cx="50" cy="50" r="47" fill="#7a5020" />
      {/* Face base */}
      <circle cx="50" cy="50" r="43" fill={`url(#tails-g-${tier.id})`} />
      {imageUrl ? (
        <image
          href={imageUrl}
          x="7"
          y="7"
          width="86"
          height="86"
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${filterId})`}
        />
      ) : (
        <>
          <circle cx="50" cy="50" r="38.5" fill="none" stroke="#4a3010" strokeWidth="1.2" opacity="0.8" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="#c8a060" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 2" />
          <line x1="50" y1="28" x2="50" y2="72" stroke="#c8a060" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <line x1="32" y1="42" x2="68" y2="42" stroke="#c8a060" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M 36 58 Q 50 68 64 58" stroke="#c8a060" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M 40 62 Q 50 70 60 62" stroke="#c8a060" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
          <text x="50" y="84" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="#c8a060" letterSpacing="1.5" opacity="0.8">{tier.abbr}</text>
        </>
      )}
      <circle cx="50" cy="50" r="38.5" fill="none" stroke="#4a3010" strokeWidth="1.2" opacity="0.5" />
      <circle cx="50" cy="50" r="43" fill={`url(#tails-s-${tier.id})`} />
      <ellipse cx="30" cy="26" rx="9" ry="5" fill="white" opacity="0.15" transform="rotate(-30, 30, 26)" />
    </svg>
  );
}

// ─── Coin Detail Modal ────────────────────────────────────────────────────────
function CoinDetailModal({
  tier,
  imageUrl,
  coinFilter,
  onClose,
}: {
  tier: typeof TIERS[0];
  imageUrl: string | null;
  coinFilter: typeof COIN_FILTERS[0] | null;
  onClose: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ background: 'var(--card)', borderColor: tier.border, boxShadow: `0 0 80px ${tier.glow}, 0 0 160px ${tier.glow}` }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)', background: `${tier.color}0d` }}
        >
          <div>
            <h2 className="font-800 text-base" style={{ color: 'var(--foreground)' }}>{tier.name}</h2>
            <p className="text-xs font-600" style={{ color: tier.color }}>
              {isFlipped ? 'Tails — Sepia Edition' : `Heads — ${coinFilter && coinFilter.id !== 'none' ? coinFilter.label : 'Your Coin'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-muted"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center gap-6">
          {/* 3D Flip coin */}
          <div style={{ perspective: '800px', width: 200, height: 200 }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Heads face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: `drop-shadow(0 0 24px ${tier.glow})`,
                }}
              >
                <TierCoinSVG tier={tier} size={200} imageUrl={imageUrl} coinFilter={coinFilter} />
              </div>
              {/* Tails face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 0 24px rgba(160,120,60,0.5))',
                }}
              >
                <TailsCoinSVG tier={tier} size={200} imageUrl={imageUrl} />
              </div>
            </div>
          </div>

          {/* Side label */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: isFlipped ? '#9a7040' : tier.color }} />
            <span className="text-sm font-700" style={{ color: isFlipped ? '#c8a060' : tier.color }}>
              {isFlipped ? 'Tails — Sepia Edition' : `Heads — ${coinFilter && coinFilter.id !== 'none' ? coinFilter.label + ' ' + coinFilter.emoji : 'Your Image'}`}
            </span>
          </div>

          {/* Flip button */}
          <button
            onClick={handleFlip}
            disabled={isAnimating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-sm transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.coinColor2})`, color: '#0a0a0a' }}
          >
            <RotateCcw size={14} className={isAnimating ? 'animate-spin' : ''} />
            Flip Coin
          </button>

          {/* Coin info */}
          <div
            className="w-full rounded-xl border p-3 grid grid-cols-3 gap-3 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
          >
            <div>
              <p className="text-xs font-600 mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Tier</p>
              <p className="text-sm font-800" style={{ color: tier.color }}>{tier.abbr}</p>
            </div>
            <div>
              <p className="text-xs font-600 mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Multiplier</p>
              <p className="text-sm font-800" style={{ color: 'var(--foreground)' }}>{tier.multiplier}</p>
            </div>
            <div>
              <p className="text-xs font-600 mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Status</p>
              <p className="text-sm font-800" style={{ color: '#52B788' }}>Minted ✓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mint Modal ───────────────────────────────────────────────────────────────
function MintModal({
  tier,
  onClose,
  onConfirm,
  mintCost,
}: {
  tier: typeof TIERS[0];
  onClose: () => void;
  onConfirm: (imageUrl: string | null, coinFilter: typeof COIN_FILTERS[0]) => void;
  mintCost: number;
}) {
  const [step, setStep] = useState<'image' | 'filter'>('image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [minting, setMinting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<typeof COIN_FILTERS[0]>(COIN_FILTERS[0]); // default: tarnished
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleMint = async () => {
    setMinting(true);
    await new Promise((r) => setTimeout(r, 1800));
    onConfirm(uploadedImage, selectedFilter);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{ background: 'var(--card)', borderColor: tier.border, boxShadow: `0 0 60px ${tier.glow}` }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)', background: `${tier.color}0d` }}
        >
          <div className="flex items-center gap-3">
            <TierCoinSVG tier={tier} size={36} imageUrl={uploadedImage} coinFilter={step === 'filter' ? selectedFilter : null} />
            <div>
              <h2 className="font-800 text-base" style={{ color: 'var(--foreground)' }}>Mint {tier.name}</h2>
              <p className="text-xs" style={{ color: tier.color }}>
                {step === 'image' ? 'Step 1 — Choose your image' : 'Step 2 — Customize your coin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-muted"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 text-xs font-700 px-2.5 py-1 rounded-full"
            style={{
              background: step === 'image' ? `${tier.color}22` : 'var(--muted)',
              color: step === 'image' ? tier.color : 'var(--muted-foreground)',
              border: `1px solid ${step === 'image' ? tier.color + '55' : 'var(--border)'}`,
            }}
          >
            <ImageIcon size={10} />
            Image
          </div>
          <ChevronRight size={12} style={{ color: 'var(--muted-foreground)' }} />
          <div
            className="flex items-center gap-1.5 text-xs font-700 px-2.5 py-1 rounded-full"
            style={{
              background: step === 'filter' ? `${tier.color}22` : 'var(--muted)',
              color: step === 'filter' ? tier.color : 'var(--muted-foreground)',
              border: `1px solid ${step === 'filter' ? tier.color + '55' : 'var(--border)'}`,
            }}
          >
            <Sliders size={10} />
            Style
          </div>
        </div>

        <div className="p-6 space-y-5">
          {step === 'image' ? (
            <>
              {/* Coin preview */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative flex items-center justify-center rounded-full"
                  style={{ width: 140, height: 140, boxShadow: `0 0 40px ${tier.glow}, 0 0 80px ${tier.glow}` }}
                >
                  <TierCoinSVG tier={tier} size={140} imageUrl={uploadedImage} coinFilter={null} />
                </div>
                <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                  {uploadedImage ? 'Your custom coin preview' : 'Default coin design'}
                </p>
              </div>

              {/* Image upload */}
              <div>
                <p className="text-sm font-700 mb-2" style={{ color: 'var(--foreground)' }}>
                  <ImageIcon size={13} className="inline mr-1.5" style={{ color: tier.color }} />
                  Custom Coin Image <span className="font-500 text-xs" style={{ color: 'var(--muted-foreground)' }}>(optional)</span>
                </p>

                {uploadedImage ? (
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ borderColor: tier.border, background: tier.bg }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border"
                      style={{ borderColor: tier.border }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedImage} alt="Coin image preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>Image uploaded ✓</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>This image will appear on your coin face</p>
                    </div>
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="flex items-center gap-1.5 text-xs font-600 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-muted"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <RefreshCw size={11} />
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    className="relative rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isDragging ? tier.color : 'var(--border)',
                      background: isDragging ? tier.bg : 'transparent',
                    }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}33` }}
                    >
                      <Upload size={18} style={{ color: tier.color }} />
                    </div>
                    <p className="text-sm font-700 text-center" style={{ color: 'var(--foreground)' }}>Drop your image here</p>
                    <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>or click to browse · PNG, JPG, GIF, WebP</p>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </div>
                )}
              </div>

              {/* Next step button */}
              <button
                onClick={() => setStep('filter')}
                className="w-full py-3 rounded-xl font-800 text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.coinColor2})`, color: '#0a0a0a' }}
              >
                <Sliders size={15} />
                Next — Choose Coin Style
              </button>
            </>
          ) : (
            <>
              {/* Filter preview */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative flex items-center justify-center rounded-full transition-all duration-300"
                  style={{ width: 140, height: 140, boxShadow: `0 0 40px ${tier.glow}, 0 0 80px ${tier.glow}` }}
                >
                  <TierCoinSVG tier={tier} size={140} imageUrl={uploadedImage} coinFilter={selectedFilter} />
                </div>
                <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                  {selectedFilter.emoji} {selectedFilter.label} — {selectedFilter.desc}
                </p>
              </div>

              {/* Filter options */}
              <div>
                <p className="text-sm font-700 mb-3 flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                  <Sliders size={13} style={{ color: tier.color }} />
                  Coin Finish
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {COIN_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFilter(f)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200"
                      style={{
                        borderColor: selectedFilter.id === f.id ? tier.color : 'var(--border)',
                        background: selectedFilter.id === f.id ? `${tier.color}18` : 'var(--muted)',
                        boxShadow: selectedFilter.id === f.id ? `0 0 10px ${tier.glow}` : 'none',
                      }}
                    >
                      <div style={{ width: 40, height: 40 }}>
                        <TierCoinSVG tier={tier} size={40} imageUrl={uploadedImage} coinFilter={f} />
                      </div>
                      <span
                        className="text-xs font-700 leading-tight text-center"
                        style={{ color: selectedFilter.id === f.id ? tier.color : 'var(--muted-foreground)', fontSize: '9px' }}
                      >
                        {f.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost info */}
              <div
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
              >
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                  <CheddarCoinDisplay size={16} />
                  <span className="font-600">Minting cost</span>
                </div>
                <span className="font-800 font-mono-data text-sm" style={{ color: tier.color }}>
                  {mintCost.toLocaleString()} CC
                </span>
              </div>

              {/* Back + Confirm */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('image')}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-700 text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleMint}
                  disabled={minting}
                  className="flex-1 py-3 rounded-xl font-800 text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: minting ? 'var(--muted)' : `linear-gradient(135deg, ${tier.color}, ${tier.coinColor2})`,
                    color: minting ? 'var(--muted-foreground)' : '#0a0a0a',
                  }}
                >
                  {minting ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Minting your coin…
                    </>
                  ) : (
                    <>
                      <Coins size={15} />
                      Confirm &amp; Mint {tier.abbr} Coin
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                Your coin will appear on your profile immediately after minting.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tier card ────────────────────────────────────────────────────────────────
function TierCard({
  tier,
  isActive,
  mintedImageUrl,
  mintedFilter,
  mintCost,
  onMint,
  onViewDetail,
}: {
  tier: typeof TIERS[0];
  isActive: boolean;
  mintedImageUrl: string | null;
  mintedFilter: typeof COIN_FILTERS[0] | null;
  mintCost: number;
  onMint: () => void;
  onViewDetail: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const locked = MY_COIN_BALANCE < mintCost;

  return (
    <div
      className="relative rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: hovered && !locked ? tier.bg : 'var(--card)',
        borderColor: isActive ? tier.color : hovered ? tier.border : 'var(--border)',
        boxShadow: isActive ? `0 0 24px ${tier.glow}` : hovered && !locked ? `0 0 32px ${tier.glow}` : 'none',
        transform: hovered && !locked ? 'translateY(-3px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Minted badge */}
      {isActive && (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-800"
          style={{ background: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}55` }}
        >
          <CheckCircle size={10} />
          Minted
        </div>
      )}

      {/* Tier header band */}
      <div
        className="px-5 pt-5 pb-4 border-b"
        style={{ borderColor: 'var(--border)', background: `${tier.color}10` }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-800 px-2 py-0.5 rounded-full"
                style={{ background: `${tier.color}22`, color: tier.color }}
              >
                {tier.abbr}
              </span>
              {tier.id === 'extra-sharp' && (
                <span
                  className="text-xs font-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(255,159,28,0.15)', color: '#FF9F1C' }}
                >
                  <Crown size={10} />
                  Big Cheese Eligible
                </span>
              )}
            </div>
            <h3 className="font-800 text-lg leading-tight" style={{ color: 'var(--foreground)' }}>{tier.name}</h3>
            <p className="text-xs font-600 mt-0.5" style={{ color: tier.color }}>{tier.tagline}</p>
          </div>
          {/* Coin is clickable when minted */}
          <div
            className={isActive ? 'cursor-pointer transition-transform hover:scale-110 active:scale-95' : ''}
            onClick={isActive ? onViewDetail : undefined}
            title={isActive ? 'Tap to view coin detail' : undefined}
          >
            <TierCoinSVG tier={tier} size={72} imageUrl={isActive ? mintedImageUrl : null} coinFilter={isActive ? mintedFilter : null} />
            {isActive && (
              <p className="text-center text-xs font-600 mt-1" style={{ color: tier.color, fontSize: '9px' }}>Tap to view</p>
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.8 }}>{tier.desc}</p>
      </div>

      {/* Stats row */}
      <div className="px-5 py-3 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Mint Cost</p>
          <p className="font-800 font-mono-data text-sm" style={{ color: tier.color }}>{mintCost.toLocaleString()} CC</p>
        </div>
        <div className="w-px h-8 self-center" style={{ background: 'var(--border)' }} />
        <div>
          <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Value Multiplier</p>
          <p className="font-800 font-mono-data text-sm" style={{ color: 'var(--foreground)' }}>{tier.multiplier}</p>
        </div>
        <div className="w-px h-8 self-center" style={{ background: 'var(--border)' }} />
        <div>
          <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Holders</p>
          <p className="font-800 font-mono-data text-sm" style={{ color: 'var(--foreground)' }}>{tier.holders.toLocaleString()}</p>
        </div>
      </div>

      {/* Perks */}
      <div className="px-5 py-4 flex-1">
        <p className="text-xs font-700 mb-2.5 uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>What you get</p>
        <ul className="space-y-1.5">
          {tier.perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
              <span style={{ color: 'var(--foreground)', opacity: 0.85 }}>{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mint CTA */}
      <div className="px-5 pb-5">
        {isActive ? (
          <button
            onClick={onViewDetail}
            className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-700 justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: `${tier.color}18`, color: tier.color, border: `1px solid ${tier.color}44` }}
          >
            <CheckCircle size={13} />
            {tier.abbr} Coin Minted — Tap to View ✓
          </button>
        ) : locked ? (
          <div
            className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-700 justify-center"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
          >
            <Lock size={13} />
            Need {(mintCost - MY_COIN_BALANCE).toLocaleString()} more CC
          </div>
        ) : (
          <button
            onClick={onMint}
            className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-700 justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.coinColor2})`, color: '#0a0a0a' }}
          >
            <Coins size={14} />
            Mint {tier.abbr} Coin — {mintCost.toLocaleString()} CC
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MintPage() {
  const [mintedTiers, setMintedTiers] = useState<Record<string, { imageUrl: string | null; filter: typeof COIN_FILTERS[0] }>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMintedTierId, setLastMintedTierId] = useState<string | null>(null);
  const [modalTier, setModalTier] = useState<typeof TIERS[0] | null>(null);
  const [detailTier, setDetailTier] = useState<typeof TIERS[0] | null>(null);

  const mintedCount = Object.keys(mintedTiers).length;
  // Popularity score — in a real app this would come from the user's profile/stats
  // For now we use a mock score that reflects platform activity
  const MY_POPULARITY_SCORE = 320;
  const popularityTier = getPopularityTier(MY_POPULARITY_SCORE);

  const handleOpenModal = (tierId: string) => {
    const tier = TIERS.find((t) => t.id === tierId);
    if (tier) setModalTier(tier);
  };

  const handleOpenDetail = (tierId: string) => {
    const tier = TIERS.find((t) => t.id === tierId);
    if (tier) setDetailTier(tier);
  };

  const handleConfirmMint = (imageUrl: string | null, coinFilter: typeof COIN_FILTERS[0]) => {
    if (!modalTier) return;
    setMintedTiers((prev) => ({ ...prev, [modalTier.id]: { imageUrl, filter: coinFilter } }));
    setLastMintedTierId(modalTier.id);
    setModalTier(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const activeTier = TIERS.find((t) => t.id === lastMintedTierId);

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* ── Hero ── */}
        <div
          className="relative rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: 'rgba(212,175,55,0.5)', minHeight: '220px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0d00 40%, #0a0a14 100%)' }}
          />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.12) 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />

          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className="text-xs font-700 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  <Coins size={11} />
                  Member Coin Minting
                </span>
                <span
                  className="text-xs font-700 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{ background: 'rgba(255,159,28,0.12)', color: '#FF9F1C', border: '1px solid rgba(255,159,28,0.25)' }}
                >
                  <Crown size={11} />
                  Big Cheese Title
                </span>
              </div>
              <h1 className="text-hero-xl text-gold mb-3 leading-tight">
                Mint Your<br />Cheddar Coin
              </h1>
              <p className="text-base font-500 max-w-lg mb-5" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
                Your personal coin is a status symbol — the more popular you are on the platform, the higher your minted coin's value rises.{' '}
                <strong className="text-gold">CC is the gold standard.</strong> Earn enough and claim the legendary{' '}
                <strong style={{ color: '#FF9F1C' }}>Big Cheese</strong> title.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-700"
                  style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}
                >
                  <CheddarCoinDisplay size={18} />
                  Your Balance: 1,240 CC
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-700"
                  style={{ borderColor: `${popularityTier.color}44`, background: `${popularityTier.color}12`, color: popularityTier.color }}
                >
                  <TrendingUp size={13} />
                  Popularity: {popularityTier.label} ({MY_POPULARITY_SCORE} pts)
                </div>
              </div>
            </div>

            {/* Stacked coins visual */}
            <div className="flex-shrink-0 flex items-end gap-2">
              {TIERS.map((t, i) => (
                <div
                  key={t.id}
                  className="flex flex-col items-center gap-1"
                  style={{ transform: `translateY(${(2 - i) * 8}px)` }}
                >
                  <TierCoinSVG
                    tier={t}
                    size={i === 2 ? 80 : i === 1 ? 64 : 52}
                    imageUrl={mintedTiers[t.id]?.imageUrl ?? null}
                    coinFilter={mintedTiers[t.id]?.filter ?? null}
                  />
                  <span className="text-xs font-700" style={{ color: t.color, fontSize: '10px' }}>{t.abbr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mint success toast ── */}
        {showSuccess && activeTier && (
          <div
            className="mb-6 rounded-2xl border p-4 flex items-center gap-4"
            style={{ background: `${activeTier.color}12`, borderColor: activeTier.border }}
          >
            <TierCoinSVG
              tier={activeTier}
              size={48}
              imageUrl={mintedTiers[activeTier.id]?.imageUrl ?? null}
              coinFilter={mintedTiers[activeTier.id]?.filter ?? null}
            />
            <div>
              <p className="font-800 text-base" style={{ color: activeTier.color }}>
                🎉 {activeTier.name} Coin Minted!
              </p>
              <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                Your personal coin is now live on your profile. The more popular you become, the more your coin is worth.
              </p>
            </div>
            <CheckCircle size={24} className="ml-auto flex-shrink-0" style={{ color: activeTier.color }} />
          </div>
        )}

        {/* ── Popularity & Coin Value Panel ── */}
        <div
          className="mb-8 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: `${popularityTier.color}0a`, borderColor: `${popularityTier.color}33` }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${popularityTier.color}20`, border: `2px solid ${popularityTier.color}44` }}
            >
              <Star size={22} style={{ color: popularityTier.color }} />
            </div>
            <div>
              <p className="text-xs font-600 uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Your Popularity</p>
              <p className="font-800 text-lg leading-tight" style={{ color: popularityTier.color }}>{popularityTier.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{MY_POPULARITY_SCORE} popularity points</p>
            </div>
          </div>
          <div className="w-px h-12 hidden sm:block self-center" style={{ background: 'var(--border)' }} />
          <div className="flex-1">
            <p className="text-sm font-600 mb-1" style={{ color: 'var(--foreground)' }}>
              Coin Value Multiplier: <strong style={{ color: popularityTier.color }}>{popularityTier.multiplier}×</strong>
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {popularityTier.desc}. Your minted coins are worth <strong style={{ color: popularityTier.color }}>{popularityTier.multiplier}×</strong> their base value. Grow your popularity by posting, earning blessings, and engaging the congregation.
            </p>
          </div>
          <div className="w-px h-12 hidden sm:block self-center" style={{ background: 'var(--border)' }} />
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-600 mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Next mint cost</p>
            <p className="font-800 font-mono-data text-xl" style={{ color: mintedCount === 0 ? '#D4AF37' : '#52B788' }}>
              {getMintCost(mintedCount).toLocaleString()} CC
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {mintedCount === 0 ? 'First coin' : `Coin #${mintedCount + 1} — loyalty price`}
            </p>
          </div>
        </div>

        {/* ── Pricing info banner ── */}
        <div
          className="mb-8 rounded-xl border p-4 flex items-start gap-3"
          style={{ background: 'rgba(82,183,136,0.06)', borderColor: 'rgba(82,183,136,0.25)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(82,183,136,0.15)', border: '1px solid rgba(82,183,136,0.3)' }}
          >
            <Coins size={15} style={{ color: '#52B788' }} />
          </div>
          <div>
            <p className="text-sm font-700 mb-0.5" style={{ color: '#52B788' }}>Minting Pricing</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Your <strong style={{ color: 'var(--foreground)' }}>first coin costs 500 CC</strong>. Once you've minted your first coin, all subsequent coins cost just <strong style={{ color: 'var(--foreground)' }}>287 CC</strong> — a loyalty discount for committed congregation members. Coin <em>value</em> is determined by your popularity on the platform, not the minting cost.
            </p>
          </div>
        </div>

        {/* ── How it works — bento ── */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-5 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            How Coin Minting Works
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Coins, color: '#D4AF37', title: 'Earn CC', desc: 'Get Cheddar Coin by performing, getting blessed, and engaging the congregation.' },
              { icon: ArrowUp, color: '#52B788', title: 'Hit a Tier', desc: 'Reach 500, 5k, or 25k CC to unlock Medium, Sharp, or Extra Sharp denomination.' },
              { icon: Zap, color: '#E07B39', title: 'Mint Your Coin', desc: 'First coin costs 500 CC. Every coin after that is just 287 CC — loyalty pricing.' },
              { icon: TrendingUp, color: '#FF9F1C', title: 'Value = Popularity', desc: 'Your coin\'s value rises with your popularity on the platform — not your CC balance.' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-4 relative overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div
                  className="text-5xl font-900 font-mono-data absolute top-2 right-3 opacity-[0.07] select-none"
                  style={{ color: item.color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <h3 className="font-700 text-sm mb-1" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Denomination tiers ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-display-lg flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Coins size={18} style={{ color: 'var(--primary)' }} />
              CC Denominations
            </h2>
            <span className="text-xs font-600 px-3 py-1 rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              3 tiers · {(TIERS.reduce((a, t) => a + t.holders, 0)).toLocaleString()} total holders
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((tier, idx) => {
              // First unminted tier uses first-mint cost if no coins minted yet,
              // otherwise all unminted tiers use subsequent cost
              const tierMintCost = getMintCost(mintedCount + idx > 0 ? mintedCount : 0);
              return (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  isActive={tier.id in mintedTiers}
                  mintedImageUrl={mintedTiers[tier.id]?.imageUrl ?? null}
                  mintedFilter={mintedTiers[tier.id]?.filter ?? null}
                  mintCost={tierMintCost}
                  onMint={() => handleOpenModal(tier.id)}
                  onViewDetail={() => handleOpenDetail(tier.id)}
                />
              );
            })}
          </div>
        </div>

        {/* ── Popularity value scale ── */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-5 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <TrendingUp size={18} style={{ color: '#52B788' }} />
            Coin Value &amp; Popularity Scale
          </h2>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: 'var(--border)', background: 'rgba(82,183,136,0.05)' }}
            >
              <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>How popularity affects your coin's value</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>The more the congregation loves you, the more your minted coin is worth</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {POPULARITY_TIERS.map((pt) => {
                const isCurrentTier = pt.label === popularityTier.label;
                return (
                  <div
                    key={pt.label}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{ background: isCurrentTier ? `${pt.color}0d` : 'transparent' }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: pt.color, boxShadow: isCurrentTier ? `0 0 8px ${pt.color}` : 'none' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-700 text-sm" style={{ color: isCurrentTier ? pt.color : 'var(--foreground)' }}>{pt.label}</span>
                        {isCurrentTier && (
                          <span
                            className="text-xs font-700 px-2 py-0.5 rounded-full"
                            style={{ background: `${pt.color}22`, color: pt.color, border: `1px solid ${pt.color}44` }}
                          >
                            You are here
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pt.desc} · {pt.minScore}+ popularity pts</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-800 font-mono-data text-sm" style={{ color: pt.color }}>{pt.multiplier}× value</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Big Cheese leaderboard ── */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-5 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Crown size={18} style={{ color: '#FF9F1C' }} />
            The Big Cheese Board
          </h2>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div
              className="px-5 py-4 border-b flex items-center gap-3"
              style={{ borderColor: 'var(--border)', background: 'rgba(255,159,28,0.06)' }}
            >
              <Crown size={16} style={{ color: '#FF9F1C' }} />
              <div>
                <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Top Extra Sharp Cheddar Holders</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Ranked by minted coin value · Season 3</p>
              </div>
              <div
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700"
                style={{ background: 'rgba(255,159,28,0.15)', color: '#FF9F1C', border: '1px solid rgba(255,159,28,0.3)' }}
              >
                <Flame size={11} />
                Live Rankings
              </div>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {BIG_CHEESES.map((member) => {
                const memberTier = TIERS.find((t) => t.id === member.tier);
                return (
                  <div
                    key={member.rank}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div
                      className="w-8 text-center font-900 font-mono-data text-sm flex-shrink-0"
                      style={{ color: member.rank === 1 ? '#FF9F1C' : member.rank === 2 ? '#D4AF37' : member.rank === 3 ? '#C0A060' : 'var(--muted-foreground)' }}
                    >
                      #{member.rank}
                    </div>
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-800"
                        style={{ background: `${member.color}22`, color: member.color, border: `2px solid ${member.color}55` }}
                      >
                        {member.initials}
                      </div>
                      {member.crown && (
                        <div
                          className="absolute -top-2 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#FF9F1C', border: '2px solid var(--card)' }}
                        >
                          <Crown size={10} fill="#0a0a0a" stroke="none" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>{member.name}</span>
                        {member.crown && (
                          <span
                            className="text-xs font-800 px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,159,28,0.2)', color: '#FF9F1C', border: '1px solid rgba(255,159,28,0.4)' }}
                          >
                            👑 The Big Cheese
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        @{member.handle} · {member.title}
                      </p>
                    </div>
                    {memberTier && (
                      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                        <TierCoinSVG tier={memberTier} size={28} />
                        <span className="text-xs font-700" style={{ color: memberTier.color }}>{memberTier.abbr}</span>
                      </div>
                    )}
                    <div className="text-right flex-shrink-0">
                      <p className="font-800 font-mono-data text-sm text-gold">{member.coinValue}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>coin value</p>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} className="flex-shrink-0" />
                  </div>
                );
              })}
            </div>

            <div
              className="px-5 py-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
            >
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Users size={12} />
                87 Extra Sharp holders · Rankings update every 24h
              </div>
              <div className="flex items-center gap-1.5 text-xs font-600" style={{ color: '#FF9F1C' }}>
                <Star size={11} />
                Season 3 ends in 14 days
              </div>
            </div>
          </div>
        </div>

        {/* ── Big Cheese explainer ── */}
        <div
          className="rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(255,159,28,0.06) 0%, rgba(212,175,55,0.04) 100%)', borderColor: 'rgba(255,159,28,0.3)' }}
        >
          <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl" style={{ background: 'rgba(255,159,28,0.12)', border: '2px solid rgba(255,159,28,0.3)' }}>
            <Crown size={40} style={{ color: '#FF9F1C' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-800 text-xl" style={{ color: '#FF9F1C' }}>The Big Cheese Title</h3>
              <Award size={16} style={{ color: '#FF9F1C' }} />
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
              Reach Extra Sharp Cheddar status and you become eligible for the <strong style={{ color: '#FF9F1C' }}>Big Cheese</strong> — the highest honor in the congregation. The Big Cheese is elected each season by ESC holders. It's not just a title, it's governance power, platform legend status, and the right to say you run this cheese board.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,159,28,0.12)', color: '#FF9F1C', border: '1px solid rgba(255,159,28,0.25)' }}>
                <Zap size={11} />
                3× governance vote weight
              </div>
              <div className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                <Star size={11} />
                Seasonal elections by ESC holders
              </div>
              <div className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(82,183,136,0.1)', color: '#52B788', border: '1px solid rgba(82,183,136,0.25)' }}>
                <Crown size={11} />
                Animated profile crown
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Mint Modal ── */}
      {modalTier && (
        <MintModal
          tier={modalTier}
          mintCost={getMintCost(mintedCount)}
          onClose={() => setModalTier(null)}
          onConfirm={handleConfirmMint}
        />
      )}

      {/* ── Coin Detail Modal ── */}
      {detailTier && (
        <CoinDetailModal
          tier={detailTier}
          imageUrl={mintedTiers[detailTier.id]?.imageUrl ?? null}
          coinFilter={mintedTiers[detailTier.id]?.filter ?? null}
          onClose={() => setDetailTier(null)}
        />
      )}
    </AppLayout>
  );
}
