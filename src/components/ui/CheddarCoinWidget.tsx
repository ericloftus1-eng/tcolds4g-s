'use client';
import React, { useState, useId } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { toast } from 'sonner';

// Pre-computed reeded edge lines — static so SSR and client produce identical values
const REEDED_LINES = Array.from({ length: 36 }).map((_, i) => {
  const angle = (i / 36) * Math.PI * 2;
  return {
    x1: parseFloat((50 + 43 * Math.cos(angle)).toFixed(4)),
    y1: parseFloat((50 + 43 * Math.sin(angle)).toFixed(4)),
    x2: parseFloat((50 + 47 * Math.cos(angle)).toFixed(4)),
    y2: parseFloat((50 + 47 * Math.sin(angle)).toFixed(4)),
    stroke: i % 2 === 0 ? '#C8960A' : '#7A5800',
  };
});

interface CheddarCoinWidgetProps {
  recipientName: string;
  recipientRank?: string;
  compact?: boolean;
}

// The actual coin SVG component — face side (pressed cheddar wedge) — enhanced 3D
function CheddarCoinFace({ size = 48, className = '' }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const ids = {
    coinGrad3D: `coinGrad3D_${uid}`,
    rimGrad: `rimGrad_${uid}`,
    wedgeFaceGrad: `wedgeFaceGrad_${uid}`,
    wedgeTopGrad: `wedgeTopGrad_${uid}`,
    specular: `specular_${uid}`,
    coinShadow: `coinShadow_${uid}`,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={ids.coinGrad3D} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFF0A0" />
          <stop offset="18%" stopColor="#FFD700" />
          <stop offset="45%" stopColor="#DAA520" />
          <stop offset="72%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#7A5800" />
        </radialGradient>
        <radialGradient id={ids.rimGrad} cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="transparent" />
          <stop offset="100%" stopColor="#3D2B00" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id={ids.wedgeFaceGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD060" />
          <stop offset="50%" stopColor="#E8A020" />
          <stop offset="100%" stopColor="#B87010" />
        </linearGradient>
        <linearGradient id={ids.wedgeTopGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE080" />
          <stop offset="100%" stopColor="#D4900A" />
        </linearGradient>
        <radialGradient id={ids.specular} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.coinShadow} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#3D2B00" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Outer shadow ring for depth */}
      <circle cx="50" cy="51" r="47" fill="#3D2B00" opacity="0.35" />

      {/* Outer coin rim — dark gold */}
      <circle cx="50" cy="50" r="47" fill={`url(#${ids.rimGrad})`} />
      <circle cx="50" cy="50" r="47" fill="#9A6E00" />

      {/* Reeded edge — milled coin texture */}
      {REEDED_LINES.map((line, i) => (
        <line
          key={i}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={line.stroke}
          strokeWidth="1.4"
        />
      ))}

      {/* Main coin face — 3D sphere shading */}
      <circle cx="50" cy="50" r="43" fill={`url(#${ids.coinGrad3D})`} filter={`url(#${ids.coinShadow})`} />

      {/* Inner rim groove — engraved line */}
      <circle cx="50" cy="50" r="38.5" fill="none" stroke="#8B6200" strokeWidth="1.2" opacity="0.8" />
      <circle cx="50" cy="50" r="39.5" fill="none" stroke="#FFD060" strokeWidth="0.5" opacity="0.4" />

      {/* Cheddar wedge — embossed 3D relief */}
      <g transform="translate(50,51) scale(0.75)">
        {/* Wedge shadow/base for depth */}
        <path
          d="M-28,12 L0,-30 L28,12 Z"
          fill="#7A4A00"
          opacity="0.5"
          transform="translate(1.5, 2)"
        />
        {/* Wedge front face */}
        <path
          d="M-28,12 L0,-30 L28,12 Z"
          fill={`url(#${ids.wedgeFaceGrad})`}
          stroke="#A06010"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Wedge top face — lighter, catching light */}
        <path
          d="M-28,12 L-20,18 L20,18 L28,12 L0,-30 Z"
          fill={`url(#${ids.wedgeTopGrad})`}
          stroke="#A06010"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Left side face — darker for 3D */}
        <path
          d="M-28,12 L-20,18 L0,-30 Z"
          fill="#C07010"
          opacity="0.4"
        />
        {/* Cheese holes — deep recessed */}
        <ellipse cx="-8" cy="-4" rx="3.8" ry="3.2" fill="#7A4A00" opacity="0.75" />
        <ellipse cx="-8" cy="-4" rx="2.8" ry="2.2" fill="#5A3500" opacity="0.6" />
        <ellipse cx="10" cy="2" rx="2.8" ry="2.4" fill="#7A4A00" opacity="0.75" />
        <ellipse cx="10" cy="2" rx="1.8" ry="1.6" fill="#5A3500" opacity="0.6" />
        <ellipse cx="-2" cy="7" rx="2.2" ry="2" fill="#7A4A00" opacity="0.65" />
        <ellipse cx="-2" cy="7" rx="1.4" ry="1.2" fill="#5A3500" opacity="0.55" />
        {/* Highlight streak on wedge face */}
        <path d="M-16,-8 L-6,-26 L2,-26 L-8,-8 Z" fill="white" opacity="0.18" />
        <path d="M-10,-12 L-4,-22 L0,-22 L-5,-12 Z" fill="white" opacity="0.12" />
        {/* Top edge highlight */}
        <path d="M-20,18 L20,18" stroke="white" strokeWidth="0.8" opacity="0.25" />
      </g>

      {/* "CC" text — engraved look */}
      <text
        x="50"
        y="83"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="800"
        fontFamily="monospace"
        fill="#6B4A00"
        letterSpacing="3"
      >
        CC
      </text>
      {/* CC text highlight */}
      <text
        x="49.5"
        y="82.5"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="800"
        fontFamily="monospace"
        fill="#FFD060"
        letterSpacing="3"
        opacity="0.5"
      >
        CC
      </text>

      {/* Specular highlight — top-left shine */}
      <circle cx="50" cy="50" r="43" fill={`url(#${ids.specular})`} />

      {/* Top-left bright glint */}
      <ellipse cx="30" cy="26" rx="9" ry="5" fill="white" opacity="0.22" transform="rotate(-30, 30, 26)" />
      <ellipse cx="28" cy="24" rx="4" ry="2.5" fill="white" opacity="0.35" transform="rotate(-30, 28, 24)" />
    </svg>
  );
}

// Flip side — melting cheddar — enhanced 3D
function CheddarCoinBack({ size = 48, className = '' }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const ids = {
    coinGradBack3D: `coinGradBack3D_${uid}`,
    specularBack: `specularBack_${uid}`,
    meltGrad: `meltGrad_${uid}`,
    dripGrad: `dripGrad_${uid}`,
    coinShadowBack: `coinShadowBack_${uid}`,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={ids.coinGradBack3D} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFF0A0" />
          <stop offset="18%" stopColor="#FFD700" />
          <stop offset="45%" stopColor="#DAA520" />
          <stop offset="72%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#7A5800" />
        </radialGradient>
        <radialGradient id={ids.specularBack} cx="35%" cy="30%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.meltGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE060" />
          <stop offset="50%" stopColor="#F0B030" />
          <stop offset="100%" stopColor="#C07010" />
        </linearGradient>
        <linearGradient id={ids.dripGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0B030" />
          <stop offset="100%" stopColor="#A06010" />
        </linearGradient>
        <filter id={ids.coinShadowBack} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#3D2B00" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Outer shadow ring */}
      <circle cx="50" cy="51" r="47" fill="#3D2B00" opacity="0.35" />
      {/* Outer rim */}
      <circle cx="50" cy="50" r="47" fill="#9A6E00" />

      {/* Reeded edge */}
      {REEDED_LINES.map((line, i) => (
        <line
          key={i}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={line.stroke}
          strokeWidth="1.4"
        />
      ))}

      {/* Main coin face */}
      <circle cx="50" cy="50" r="43" fill={`url(#${ids.coinGradBack3D})`} filter={`url(#${ids.coinShadowBack})`} />

      {/* Inner rim groove */}
      <circle cx="50" cy="50" r="38.5" fill="none" stroke="#8B6200" strokeWidth="1.2" opacity="0.8" />
      <circle cx="50" cy="50" r="39.5" fill="none" stroke="#FFD060" strokeWidth="0.5" opacity="0.4" />

      {/* Melting cheese — 3D blob with depth */}
      <g transform="translate(50,46)">
        {/* Blob shadow */}
        <path
          d="M-22,-18 C-26,-10 -28,0 -24,8 C-20,16 -10,20 0,20 C10,20 20,16 24,8 C28,0 26,-10 22,-18 C16,-24 -16,-24 -22,-18 Z"
          fill="#7A4A00"
          opacity="0.4"
          transform="translate(2, 3)"
        />
        {/* Main melted blob */}
        <path
          d="M-22,-18 C-26,-10 -28,0 -24,8 C-20,16 -10,20 0,20 C10,20 20,16 24,8 C28,0 26,-10 22,-18 C16,-24 -16,-24 -22,-18 Z"
          fill={`url(#${ids.meltGrad})`}
          stroke="#A06010"
          strokeWidth="1.2"
        />
        {/* Drip 1 — left */}
        <path
          d="M-13,18 C-14,23 -15,30 -13,34 C-11,38 -8,37 -8,33 C-8,29 -9,23 -10,18 Z"
          fill={`url(#${ids.dripGrad})`}
          stroke="#A06010"
          strokeWidth="0.8"
        />
        {/* Drip 2 — center */}
        <path
          d="M5,19 C4,25 3,33 5,37 C7,41 10,40 10,36 C10,32 9,25 8,19 Z"
          fill={`url(#${ids.dripGrad})`}
          stroke="#A06010"
          strokeWidth="0.8"
        />
        {/* Drip 3 — right */}
        <path
          d="M17,14 C17,19 16,26 18,29 C20,32 23,31 22,28 C21,25 20,18 20,14 Z"
          fill={`url(#${ids.dripGrad})`}
          stroke="#A06010"
          strokeWidth="0.8"
        />
        {/* Drip tips — rounded ends */}
        <ellipse cx="-10.5" cy="34" rx="2.5" ry="2" fill="#A06010" />
        <ellipse cx="7.5" cy="37" rx="2.5" ry="2" fill="#A06010" />
        <ellipse cx="20" cy="28.5" rx="2" ry="1.8" fill="#A06010" />
        {/* Cheese holes in melt */}
        <ellipse cx="4" cy="-2" rx="3.2" ry="2.8" fill="#7A4A00" opacity="0.6" />
        <ellipse cx="4" cy="-2" rx="2" ry="1.8" fill="#5A3500" opacity="0.5" />
        <ellipse cx="-10" cy="5" rx="2.5" ry="2.2" fill="#7A4A00" opacity="0.6" />
        <ellipse cx="-10" cy="5" rx="1.5" ry="1.3" fill="#5A3500" opacity="0.5" />
        {/* Shine on melt blob */}
        <ellipse cx="-8" cy="-10" rx="8" ry="4.5" fill="white" opacity="0.22" transform="rotate(-20,-8,-10)" />
        <ellipse cx="-6" cy="-11" rx="4" ry="2" fill="white" opacity="0.3" transform="rotate(-20,-6,-11)" />
      </g>

      {/* "10 CC = $1" text */}
      <text
        x="50"
        y="85"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="monospace"
        fill="#6B4A00"
        letterSpacing="0.5"
      >
        10 CC = $1
      </text>
      <text
        x="49.5"
        y="84.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="monospace"
        fill="#FFD060"
        letterSpacing="0.5"
        opacity="0.45"
      >
        10 CC = $1
      </text>

      {/* Specular highlight */}
      <circle cx="50" cy="50" r="43" fill={`url(#${ids.specularBack})`} />
      {/* Top-left glint */}
      <ellipse cx="30" cy="26" rx="9" ry="5" fill="white" opacity="0.22" transform="rotate(-30, 30, 26)" />
      <ellipse cx="28" cy="24" rx="4" ry="2.5" fill="white" opacity="0.35" transform="rotate(-30, 28, 24)" />
    </svg>
  );
}

// Standalone coin display with flip on hover
export function CheddarCoinDisplay({ size = 48 }: { size?: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size, perspective: '600px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      title="Cheddar Coin — 10 CC = $1 USD"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div style={{ position: 'absolute', backfaceVisibility: 'hidden', width: '100%', height: '100%' }}>
          <CheddarCoinFace size={size} />
        </div>
        <div style={{ position: 'absolute', backfaceVisibility: 'hidden', width: '100%', height: '100%', transform: 'rotateY(180deg)' }}>
          <CheddarCoinBack size={size} />
        </div>
      </div>
    </div>
  );
}

export default function CheddarCoinWidget({
  recipientName,
  recipientRank,
  compact = false,
}: CheddarCoinWidgetProps) {
  const [amount, setAmount] = useState(50);
  const [donating, setDonating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const presets = [10, 25, 50, 100, 250];

  const handleDonate = async () => {
    setDonating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDonating(false);
    setShowModal(false);
    toast.success(`🧀 ${amount} CC passed the collection plate to ${recipientName}!`);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 active:scale-95 hover:opacity-90"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <CheddarCoinFace size={14} />
          Tithe
        </button>
        {showModal && (
          <DonateModal
            recipientName={recipientName}
            recipientRank={recipientRank}
            amount={amount}
            setAmount={setAmount}
            presets={presets}
            donating={donating}
            onDonate={handleDonate}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-600 text-sm transition-all duration-150 active:scale-95 coin-shine"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        <CheddarCoinFace size={18} />
        Pass the Collection Plate
      </button>
      {showModal && (
        <DonateModal
          recipientName={recipientName}
          recipientRank={recipientRank}
          amount={amount}
          setAmount={setAmount}
          presets={presets}
          donating={donating}
          onDonate={handleDonate}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function DonateModal({
  recipientName,
  recipientRank,
  amount,
  setAmount,
  presets,
  donating,
  onDonate,
  onClose,
}: {
  recipientName: string;
  recipientRank?: string;
  amount: number;
  setAmount: (v: number) => void;
  presets: number[];
  donating: boolean;
  onDonate: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl fade-in-up"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CheddarCoinDisplay size={72} />
          </div>
          <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Hover coin to flip · 10 CC = $1 USD</p>
          <h3 className="font-700 text-lg">Pass the Collection Plate</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Tithe to{' '}
            <span style={{ color: 'var(--primary)' }} className="font-600">
              {recipientName}
            </span>
            {recipientRank && (
              <span style={{ color: 'var(--muted-foreground)' }}> · {recipientRank}</span>
            )}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Tax-free income for ordained clergy 🧀
          </p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {presets.map((p) => (
            <button
              key={`preset-${p}`}
              onClick={() => setAmount(p)}
              className="flex-1 min-w-[3rem] py-1.5 rounded-lg text-xs font-600 transition-all duration-150 active:scale-95"
              style={{
                background: amount === p ? 'var(--primary)' : 'var(--muted)',
                color: amount === p ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                border: `1px solid ${amount === p ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {p} CC
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border p-3 mb-4"
          style={{ borderColor: 'var(--border)', background: 'var(--input)' }}
        >
          <button
            onClick={() => setAmount(Math.max(1, amount - 10))}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 text-center">
            <span className="font-mono-data font-700 text-2xl" style={{ color: 'var(--primary)' }}>
              {amount}
            </span>
            <span className="text-sm ml-1" style={{ color: 'var(--muted-foreground)' }}>
              CC
            </span>
          </div>
          <button
            onClick={() => setAmount(amount + 10)}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Plus size={14} />
          </button>
        </div>

        <p className="text-xs text-center mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Your balance:{' '}
          <span className="font-mono-data font-600" style={{ color: 'var(--primary)' }}>
            1,240 CC
          </span>
          <span className="ml-2" style={{ color: 'var(--muted-foreground)' }}>
            (≈ $124.00 USD)
          </span>
        </p>

        <button
          onClick={onDonate}
          disabled={donating}
          className="w-full py-3 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {donating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Blessing the coins...
            </>
          ) : (
            <>
              <CheddarCoinFace size={16} />
              Tithe {amount} CC
            </>
          )}
        </button>
      </div>
    </div>
  );
}