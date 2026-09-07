'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Printer, Download, Coins, Radio, Crown, Star, Users, Flame, ArrowLeft } from 'lucide-react';

// ── TCoLDS Combined Logo (Church + 3 Masks) ─────────────────────────────────
function TCoLDSCombinedLogo({ width = 320, height = 200 }: { width?: number; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a1a 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1.5px solid #D4AF3744',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 0 60px rgba(212,175,55,0.05)',
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,26,26,0.18), transparent 70%)', pointerEvents: 'none' }} />

      {/* Church image — bottom-left anchor */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '55%', height: '70%', zIndex: 1 }}>
        <Image
          src="/assets/images/IMG_20260902_232218616_HDR-EDIT-1788522219308.jpg"
          alt="TCoLDS church building"
          fill
          className="object-cover"
          style={{ filter: 'sepia(0.4) saturate(1.3) hue-rotate(-8deg) brightness(0.7)', borderBottomLeftRadius: '14px' }}
          sizes={`${Math.round(width * 0.55)}px`}
        />
        {/* Gradient fade right edge of church */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, #0a0a0a 100%)' }} />
      </div>

      {/* Mask 1 — plain laughing, left side, mid-height */}
      <div style={{ position: 'absolute', left: '8%', top: '8%', width: '38%', zIndex: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/image-1788524868867.png"
          alt="Laughing mask"
          style={{
            width: '100%',
            height: 'auto',
            mixBlendMode: 'screen',
            filter: 'sepia(0.2) saturate(1.4) brightness(0.78) hue-rotate(5deg) drop-shadow(0 4px 16px rgba(212,175,55,0.35))',
          }}
        />
      </div>

      {/* Mask 2 — manic, center, tilted, overlapping mask 1 right cheek */}
      <div style={{ position: 'absolute', left: '30%', top: '18%', width: '36%', zIndex: 3, transform: 'rotate(8deg)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/image-1788525128539.png"
          alt="Manic mask"
          style={{
            width: '100%',
            height: 'auto',
            mixBlendMode: 'screen',
            filter: 'sepia(0.25) saturate(1.6) brightness(0.72) hue-rotate(10deg) drop-shadow(0 6px 20px rgba(139,26,26,0.5))',
          }}
        />
      </div>

      {/* Mask 3 — cry-laughing, right side, slightly higher */}
      <div style={{ position: 'absolute', right: '4%', top: '4%', width: '34%', zIndex: 4 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/image-1788525147722.png"
          alt="Cry-laughing mask"
          style={{
            width: '100%',
            height: 'auto',
            mixBlendMode: 'screen',
            filter: 'sepia(0.15) saturate(1.4) brightness(0.76) hue-rotate(-5deg) drop-shadow(0 6px 20px rgba(212,175,55,0.4))',
          }}
        />
      </div>

      {/* Gold top border accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)', zIndex: 10 }} />
    </div>
  );
}

// ── TCoLDS Logo Mark (SVG) ───────────────────────────────────────────────────
function TCoLDSLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
      <circle cx="32" cy="32" r="22" fill="#D4AF3715" stroke="#D4AF37" strokeWidth="1" />
      <rect x="30" y="10" width="4" height="20" rx="1" fill="#D4AF37" />
      <rect x="24" y="16" width="16" height="3" rx="1" fill="#D4AF37" />
      <path d="M20 30 L20 46 L44 46 L44 30 L32 22 Z" fill="#D4AF3722" stroke="#D4AF37" strokeWidth="1" />
      <rect x="28" y="38" width="8" height="8" rx="1" fill="#D4AF37" opacity="0.7" />
      <rect x="22" y="34" width="5" height="5" rx="1" fill="#E07B39" opacity="0.8" />
      <rect x="37" y="34" width="5" height="5" rx="1" fill="#E07B39" opacity="0.8" />
      <path d="M18 26 Q12 32 18 38" stroke="#E07B39" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M46 26 Q52 32 46 38" stroke="#E07B39" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── QR Code SVG ──────────────────────────────────────────────────────────────
function QRCode({ size = 80, fgColor = '#D4AF37', bgColor = 'transparent' }: { size?: number; fgColor?: string; bgColor?: string }) {
  const modules = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1],
    [0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,1,1,1,1],
  ];
  const cellSize = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill={bgColor} />
      {modules.map((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill={fgColor} />
          ) : null
        )
      )}
    </svg>
  );
}

// ── Business Card Front ──────────────────────────────────────────────────────
function BusinessCardFront() {
  return (
    <div
      className="business-card relative overflow-hidden flex flex-col justify-between"
      style={{
        width: '3.5in',
        height: '2in',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a00 50%, #0d0d0d 100%)',
        borderRadius: '12px',
        padding: '18px 22px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
        border: '1px solid #D4AF3744',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)' }} />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <TCoLDSLogo size={36} />
          <div>
            <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', lineHeight: 1 }}>TCoLDS</p>
            <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '8px', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase', marginTop: '2px' }}>
              The Church of Laughterday Saints
            </p>
          </div>
        </div>
        <div style={{ background: '#D4AF3722', border: '1px solid #D4AF3755', borderRadius: '6px', padding: '4px 8px' }}>
          <Crown size={12} style={{ color: '#D4AF37' }} />
        </div>
      </div>

      <div className="text-center" style={{ margin: '4px 0' }}>
        <p style={{ color: '#E07B39', fontWeight: 700, fontSize: '11px', fontStyle: 'italic', letterSpacing: '0.04em' }}>
          &ldquo;Where Laughter is the Gospel&rdquo;
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '10px', opacity: 0.9 }}>tcolds-41gim97.public.builtwithrocket.new</p>
          <p style={{ color: '#D4AF37', fontWeight: 500, fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Join the Congregation — It&apos;s Free</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio size={11} style={{ color: '#E07B39' }} />
          <Coins size={11} style={{ color: '#D4AF37' }} />
          <Star size={11} style={{ color: '#D4AF37' }} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)' }} />
    </div>
  );
}

// ── Business Card Back ───────────────────────────────────────────────────────
function BusinessCardBack() {
  return (
    <div
      className="business-card relative overflow-hidden"
      style={{
        width: '3.5in',
        height: '2in',
        background: 'linear-gradient(135deg, #1a0a00 0%, #0d0d0d 60%, #1a0a00 100%)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
        border: '1px solid #D4AF3744',
        fontFamily: '"DM Sans", sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AF37, #E07B39, #D4AF37, transparent)' }} />

      <div className="relative z-10 flex flex-col justify-center" style={{ flex: 1 }}>
        <div className="flex items-center gap-2 mb-2">
          <TCoLDSLogo size={40} />
          <div>
            <p style={{ color: '#D4AF37', fontWeight: 900, fontSize: '16px', letterSpacing: '0.08em', lineHeight: 1 }}>TCoLDS</p>
            <p style={{ color: '#E07B39', fontWeight: 600, fontSize: '7.5px', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>
              Comedy · Community · Clergy
            </p>
          </div>
        </div>
        <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '8.5px', opacity: 0.65, lineHeight: 1.5, marginBottom: '8px' }}>
          Get ordained. Earn Cheddar Coins. Watch live comedy masses. Rise through the clergy ranks.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#D4AF3720', border: '1px solid #D4AF3750', borderRadius: '4px', padding: '3px 8px', width: 'fit-content' }}>
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '8px', letterSpacing: '0.02em' }}>tcolds-41gim97.public.builtwithrocket.new</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1.5" style={{ flexShrink: 0 }}>
        <div style={{ background: '#ffffff', borderRadius: '6px', padding: '5px' }}>
          <QRCode size={72} fgColor="#0d0d0d" bgColor="#ffffff" />
        </div>
        <p style={{ color: '#D4AF37', fontWeight: 600, fontSize: '7px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>
          Scan to Join
        </p>
      </div>
    </div>
  );
}

// ── Half-Page Flyer ──────────────────────────────────────────────────────────
function HalfPageFlyer() {
  return (
    <div
      className="flyer relative overflow-hidden flex flex-col"
      style={{
        width: '5.5in',
        height: '8.5in',
        background: '#0d0d0d',
        borderRadius: '12px',
        fontFamily: '"DM Sans", sans-serif',
        boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
        border: '1px solid #D4AF3733',
      }}
    >
      {/* Header band */}
      <div style={{ background: 'linear-gradient(135deg, #1a0a00, #2a1000)', padding: '28px 36px 20px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #D4AF37, #E07B39, #D4AF37)' }} />

        <div className="relative z-10">
          {/* Combined logo — church + masks */}
          <div className="flex justify-center mb-4">
            <TCoLDSCombinedLogo width={320} height={160} />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div>
              <p style={{ color: '#D4AF37', fontWeight: 900, fontSize: '22px', letterSpacing: '0.06em', lineHeight: 1 }}>TCoLDS</p>
              <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '10px', opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>The Church of Laughterday Saints</p>
            </div>
          </div>

          <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: '26px', lineHeight: 1.1, marginBottom: '8px' }}>
            Where Laughter<br />
            <span style={{ color: '#E07B39' }}>is the Gospel.</span>
          </h1>
          <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '11px', opacity: 0.7, lineHeight: 1.5 }}>
            A comedy platform where you get ordained, earn Cheddar Coins, and watch the funniest people on the internet preach.
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ padding: '20px 36px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {[
            { icon: Crown, color: '#D4AF37', title: 'Get Ordained', desc: 'Rise through clergy ranks from Deacon to Archbishop' },
            { icon: Coins, color: '#D4AF37', title: 'Earn Cheddar Coins', desc: 'Real platform currency for engagement & donations' },
            { icon: Radio, color: '#E07B39', title: 'Live Masses', desc: 'Watch & participate in live comedy sermons' },
            { icon: Flame, color: '#E07B39', title: 'The Pulpit', desc: 'Discover the hottest comedy content daily' },
            { icon: Users, color: '#52B788', title: 'Congregation', desc: 'Join 94,000+ members in the holy comedy community' },
            { icon: Star, color: '#52B788', title: 'Holy Lottery', desc: 'Win platform editing control for 24 hours' },
          ].map((feat) => (
            <div key={feat.title} style={{ background: '#ffffff08', border: '1px solid #ffffff12', borderRadius: '10px', padding: '10px' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <feat.icon size={14} style={{ color: feat.color }} />
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '11px' }}>{feat.title}</p>
              </div>
              <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '9.5px', opacity: 0.55, lineHeight: 1.4 }}>{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ background: '#D4AF3711', border: '1px solid #D4AF3733', borderRadius: '10px', padding: '10px 18px', display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
          {[
            { val: '12,480', label: 'Ordained Clergy' },
            { val: '94,200', label: 'Congregation' },
            { val: '4.2M', label: 'CC in Circulation' },
            { val: '3,310', label: 'Masses Held' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '14px', lineHeight: 1 }}>{s.val}</p>
              <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '8px', opacity: 0.5, marginTop: '3px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA with QR code */}
        <div style={{ background: 'linear-gradient(135deg, #D4AF37, #E07B39)', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#0d0d0d', fontWeight: 900, fontSize: '14px', marginBottom: '3px' }}>Join the Congregation — Free</p>
            <p style={{ color: '#0d0d0d', fontWeight: 600, fontSize: '10px', opacity: 0.75, marginBottom: '5px' }}>tcolds-41gim97.public.builtwithrocket.new</p>
            <p style={{ color: '#0d0d0d', fontWeight: 500, fontSize: '9px', opacity: 0.65 }}>Sign up in seconds. Get ordained immediately. No credit card needed.</p>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ background: '#ffffff', borderRadius: '6px', padding: '5px' }}>
              <QRCode size={60} fgColor="#0d0d0d" bgColor="#ffffff" />
            </div>
            <p style={{ color: '#0d0d0d', fontWeight: 700, fontSize: '7.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to Join</p>
          </div>
        </div>

        <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '8px', opacity: 0.35, textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          The Church of Laughterday Saints · Comedy Platform · Est. 2024
        </p>
      </div>
    </div>
  );
}

// ── Full-Page Flyer ──────────────────────────────────────────────────────────
function FullPageFlyer() {
  return (
    <div
      className="flyer relative overflow-hidden flex flex-col"
      style={{
        width: '8.5in',
        height: '11in',
        background: '#0d0d0d',
        borderRadius: '12px',
        fontFamily: '"DM Sans", sans-serif',
        boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
        border: '1px solid #D4AF3733',
      }}
    >
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #D4AF37, #E07B39, #D4AF37, #E07B39, #D4AF37)', flexShrink: 0 }} />

      {/* Hero section */}
      <div style={{ background: 'linear-gradient(160deg, #1a0a00 0%, #0d0d0d 55%, #1a0a00 100%)', padding: '40px 64px 32px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, #D4AF3722, transparent 70%)' }} />

        <div className="relative z-10 flex gap-10 items-center">
          {/* Combined logo left */}
          <div style={{ flexShrink: 0 }}>
            <TCoLDSCombinedLogo width={360} height={220} />
          </div>

          {/* Text right */}
          <div style={{ flex: 1 }}>
            <p style={{ color: '#D4AF37', fontWeight: 900, fontSize: '36px', letterSpacing: '0.08em', lineHeight: 1, marginBottom: '4px' }}>TCoLDS</p>
            <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '12px', opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>The Church of Laughterday Saints</p>
            <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: '42px', lineHeight: 1.05, marginBottom: '14px' }}>
              Where Laughter<br />
              <span style={{ color: '#E07B39' }}>is the Gospel.</span>
            </h1>
            <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '14px', opacity: 0.65, lineHeight: 1.6 }}>
              A comedy platform where you get ordained, earn Cheddar Coins, rise through clergy ranks, and watch the funniest people on the internet preach the holy word of comedy.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '32px 64px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Features — asymmetric bento layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '14px' }}>
          <div style={{ background: '#D4AF3710', border: '1px solid #D4AF3730', borderRadius: '14px', padding: '20px', gridRow: '1 / 3' }}>
            <Crown size={22} style={{ color: '#D4AF37', marginBottom: '10px' }} />
            <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '16px', marginBottom: '6px' }}>Get Ordained</p>
            <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '12px', opacity: 0.6, lineHeight: 1.6 }}>
              Rise from Deacon to Archbishop. Each rank unlocks new powers, perks, and platform privileges. Your comedy journey starts the moment you sign up.
            </p>
          </div>
          {[
            { icon: Coins, color: '#D4AF37', title: 'Cheddar Coins', desc: 'Earn CC for every interaction. Spend on perks, donate, or cash out.' },
            { icon: Radio, color: '#E07B39', title: 'Live Masses', desc: 'Tune in to live comedy sermons and interact in real time.' },
            { icon: Flame, color: '#E07B39', title: 'The Pulpit', desc: 'Discover the hottest sermons and comedy content curated daily.' },
            { icon: Star, color: '#52B788', title: 'Holy Lottery', desc: 'Win full platform editing control for 24 hours. Anything goes.' },
          ].map((feat) => (
            <div key={feat.title} style={{ background: '#ffffff07', border: '1px solid #ffffff10', borderRadius: '12px', padding: '16px' }}>
              <div className="flex items-center gap-2 mb-2">
                <feat.icon size={15} style={{ color: feat.color }} />
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px' }}>{feat.title}</p>
              </div>
              <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '11px', opacity: 0.5, lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background: '#D4AF3710', border: '1px solid #D4AF3730', borderRadius: '12px', padding: '16px 32px', display: 'flex', justifyContent: 'space-around' }}>
          {[
            { val: '12,480', label: 'Ordained Clergy' },
            { val: '94,200', label: 'Active Congregation' },
            { val: '4.2M', label: 'CC in Circulation' },
            { val: '3,310', label: 'Masses Held' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p style={{ color: '#D4AF37', fontWeight: 900, fontSize: '24px', lineHeight: 1 }}>{s.val}</p>
              <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '11px', opacity: 0.45, marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ borderLeft: '3px solid #E07B39', paddingLeft: '20px' }}>
          <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', fontStyle: 'italic', opacity: 0.8, lineHeight: 1.5 }}>
            &ldquo;Archbishop Thunderpants is preaching. 3,847 watching. This is the most holy thing I&apos;ve ever witnessed.&rdquo;
          </p>
          <p style={{ color: '#E07B39', fontWeight: 600, fontSize: '11px', marginTop: '6px' }}>— Rev. Cacklesworth, Ordained Minister</p>
        </div>

        {/* CTA banner with QR code */}
        <div style={{ background: 'linear-gradient(135deg, #D4AF37, #E07B39)', borderRadius: '14px', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#0d0d0d', fontWeight: 900, fontSize: '20px', marginBottom: '5px' }}>Join the Congregation — It&apos;s Free</p>
            <p style={{ color: '#0d0d0d', fontWeight: 600, fontSize: '12px', opacity: 0.75, marginBottom: '8px' }}>Sign up in seconds. Get ordained immediately. No credit card needed.</p>
            <div style={{ display: 'inline-flex', background: '#0d0d0d', borderRadius: '8px', padding: '8px 16px' }}>
              <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '13px' }}>tcolds-41gim97.public.builtwithrocket.new</p>
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '8px' }}>
              <QRCode size={80} fgColor="#0d0d0d" bgColor="#ffffff" />
            </div>
            <p style={{ color: '#0d0d0d', fontWeight: 700, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scan to Join</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '10px 64px', borderTop: '1px solid #ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <p style={{ color: '#ffffff', fontWeight: 400, fontSize: '9px', opacity: 0.3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          The Church of Laughterday Saints · Comedy Platform · Est. 2024
        </p>
        <div className="flex items-center gap-3">
          <Radio size={10} style={{ color: '#E07B39', opacity: 0.5 }} />
          <Coins size={10} style={{ color: '#D4AF37', opacity: 0.5 }} />
          <Crown size={10} style={{ color: '#D4AF37', opacity: 0.5 }} />
        </div>
      </div>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #D4AF37, #E07B39, #D4AF37)', flexShrink: 0 }} />
    </div>
  );
}

// ── Flyer Logo Card (standalone logo for flyers) ─────────────────────────────
function FlyerLogoCard() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="no-print text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>
        TCoLDS Combined Logo — Church &amp; Masks
      </p>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <TCoLDSCombinedLogo width={480} height={300} />
        <div className="text-center">
          <p style={{ color: '#D4AF37', fontWeight: 900, fontSize: '32px', letterSpacing: '0.1em', lineHeight: 1 }}>TCoLDS</p>
          <p style={{ color: 'var(--muted-foreground)', fontWeight: 500, fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>The Church of Laughterday Saints</p>
          <p style={{ color: '#E07B39', fontWeight: 600, fontSize: '12px', fontStyle: 'italic', marginTop: '8px' }}>&ldquo;No Comedy is Bad Comedy&rdquo;</p>
        </div>
      </div>
      <p className="no-print text-xs text-center max-w-sm" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
        Use this logo on flyers, posters, and promotional materials. Click &quot;Print / Save PDF&quot; to export.
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
type MaterialType = 'logo' | 'business-card' | 'half-flyer' | 'full-flyer';

export default function PrintMaterialsPage() {
  const [active, setActive] = useState<MaterialType>('logo');

  const handlePrint = () => {
    window.print();
  };

  const tabs: { id: MaterialType; label: string; desc: string }[] = [
    { id: 'logo', label: 'Flyer Logo', desc: 'Church + Masks combined logo' },
    { id: 'business-card', label: 'Business Cards', desc: '3.5" × 2" — Standard size' },
    { id: 'half-flyer', label: 'Half-Page Flyer', desc: '5.5" × 8.5" — Handout size' },
    { id: 'full-flyer', label: 'Full-Page Flyer', desc: '8.5" × 11" — Letter size' },
  ];

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @media print {
          body * { visibility: hidden !important; }
          .print-zone, .print-zone * { visibility: visible !important; }
          .print-zone {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            z-index: 9999 !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: 'var(--background)', paddingTop: '80px' }}>
        {/* Header */}
        <div className="no-print" style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)', padding: '20px 24px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Link href="/entrance" className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                <ArrowLeft size={14} />
                Back
              </Link>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Print Materials</span>
            </div>
            <div className="flex items-start justify-between gap-4 mt-3">
              <div>
                <h1 className="text-xl font-800" style={{ color: 'var(--foreground)' }}>TCoLDS Print Materials</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  Select a design, then click <strong>Print / Save as PDF</strong> — use your browser&apos;s print dialog to save as PDF.
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700 transition-all hover:opacity-90 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E07B39)', color: '#0d0d0d' }}
              >
                <Printer size={16} />
                Print / Save PDF
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className="flex flex-col items-start px-4 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: active === tab.id ? 'var(--primary)' : 'var(--background)',
                    color: active === tab.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: `1px solid ${active === tab.id ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <span className="text-sm font-700">{tab.label}</span>
                  <span className="text-xs opacity-60">{tab.desc}</span>
                </button>
              ))}
            </div>

            {/* Print tip */}
            <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: '#D4AF3711', border: '1px solid #D4AF3733' }}>
              <Download size={14} style={{ color: '#D4AF37', marginTop: '1px', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                <strong>To save as PDF:</strong> Click &quot;Print / Save PDF&quot; → In the print dialog, set <em>Destination</em> to <em>&quot;Save as PDF&quot;</em> → Click Save.
                For business cards, set paper size to 4×6 or use a card template. For flyers, use Letter (8.5×11).
              </p>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {active === 'logo' && (
            <div className="print-zone flex justify-center">
              <FlyerLogoCard />
            </div>
          )}

          {active === 'business-card' && (
            <div>
              <p className="no-print text-sm font-600 mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Business Card Preview — Front &amp; Back
              </p>
              <div className="print-zone flex flex-wrap gap-8 items-start">
                <div>
                  <p className="no-print text-xs font-600 mb-3 uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Front</p>
                  <BusinessCardFront />
                </div>
                <div>
                  <p className="no-print text-xs font-600 mb-3 uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Back</p>
                  <BusinessCardBack />
                </div>
              </div>
              <p className="no-print text-xs mt-6" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                Tip: Print on 4×6 card stock and cut, or use a business card printing service (Vistaprint, Canva Print, etc.) with these dimensions.
              </p>
            </div>
          )}

          {active === 'half-flyer' && (
            <div>
              <p className="no-print text-sm font-600 mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Half-Page Flyer Preview — 5.5&quot; × 8.5&quot;
              </p>
              <div className="print-zone">
                <HalfPageFlyer />
              </div>
              <p className="no-print text-xs mt-6" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                Tip: Print on Letter paper and cut in half, or print directly on 5.5×8.5 paper.
              </p>
            </div>
          )}

          {active === 'full-flyer' && (
            <div>
              <p className="no-print text-sm font-600 mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Full-Page Flyer Preview — 8.5&quot; × 11&quot; Letter
              </p>
              <div className="print-zone">
                <FullPageFlyer />
              </div>
              <p className="no-print text-xs mt-6" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                Tip: Print on standard Letter paper. Works great as a poster or handout.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
