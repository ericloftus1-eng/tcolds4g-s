'use client';

import React, { memo } from 'react';
import Image from 'next/image';

interface AppLogoProps {
  src?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  size = 64,
  className = '',
  onClick,
}: AppLogoProps) {
  const containerClass = ['flex items-center', onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '', className].filter(Boolean).join(' ');

  // For small sizes (topbar), show the composite logo: church + 3 masks stacked
  if (size <= 48) {
    return (
      <div className={containerClass} onClick={onClick} style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
        {/* Church image — main background anchor, left-bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '72%',
            height: '72%',
            zIndex: 1,
            filter: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg) brightness(0.85)',
          }}
        >
          <Image
            src="/assets/images/IMG_20260902_232218616_HDR-EDIT-1788522219308.jpg"
            alt="TCoLDS church"
            fill
            className="object-cover rounded-sm"
            sizes={`${size}px`}
            priority
          />
        </div>

        {/* Mask 1 — plain laughing, top-left, small */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '44%',
            height: '44%',
            zIndex: 2,
            filter: 'sepia(0.15) saturate(1.1) brightness(0.88) drop-shadow(0 1px 3px rgba(212,175,55,0.5))',
          }}
        >
          <Image
            src="/assets/images/image-1788524868867.png"
            alt="Laughing mask"
            fill
            className="object-contain"
            sizes={`${Math.round(size * 0.44)}px`}
            priority
          />
        </div>

        {/* Mask 2 — manic, top-center, tilted */}
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '28%',
            width: '42%',
            height: '42%',
            zIndex: 3,
            transform: 'rotate(8deg)',
            filter: 'sepia(0.2) saturate(1.3) hue-rotate(8deg) brightness(0.85) drop-shadow(0 1px 4px rgba(139,26,26,0.6))',
          }}
        >
          <Image
            src="/assets/images/image-1788525128539.png"
            alt="Manic mask"
            fill
            className="object-contain"
            sizes={`${Math.round(size * 0.42)}px`}
            priority
          />
        </div>

        {/* Mask 3 — cry-laughing, top-right, slightly higher */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '40%',
            zIndex: 4,
            filter: 'sepia(0.1) saturate(1.2) hue-rotate(-6deg) brightness(0.9) drop-shadow(0 1px 4px rgba(212,175,55,0.5))',
          }}
        >
          <Image
            src="/assets/images/image-1788525147722.png"
            alt="Cry-laughing mask"
            fill
            className="object-contain"
            sizes={`${Math.round(size * 0.4)}px`}
            priority
          />
        </div>
      </div>
    );
  }

  // Larger sizes — full composite with more detail
  return (
    <div className={containerClass} onClick={onClick} style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Church — background anchor */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '75%',
          height: '75%',
          zIndex: 1,
          filter: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg) brightness(0.82)',
        }}
      >
        <Image
          src="/assets/images/IMG_20260902_232218616_HDR-EDIT-1788522219308.jpg"
          alt="TCoLDS church"
          fill
          className="object-cover rounded"
          sizes={`${size}px`}
          priority
        />
      </div>

      {/* Mask 1 — plain laughing, top-left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '46%',
          height: '46%',
          zIndex: 2,
          filter: 'sepia(0.15) saturate(1.1) brightness(0.88) drop-shadow(0 2px 6px rgba(212,175,55,0.5))',
        }}
      >
        <Image
          src="/assets/images/image-1788524868867.png"
          alt="Laughing mask"
          fill
          className="object-contain"
          sizes={`${Math.round(size * 0.46)}px`}
          priority
        />
      </div>

      {/* Mask 2 — manic, top-center, tilted */}
      <div
        style={{
          position: 'absolute',
          top: '2%',
          left: '30%',
          width: '44%',
          height: '44%',
          zIndex: 3,
          transform: 'rotate(9deg)',
          filter: 'sepia(0.2) saturate(1.3) hue-rotate(8deg) brightness(0.85) drop-shadow(0 2px 8px rgba(139,26,26,0.55))',
        }}
      >
        <Image
          src="/assets/images/image-1788525128539.png"
          alt="Manic mask"
          fill
          className="object-contain"
          sizes={`${Math.round(size * 0.44)}px`}
          priority
        />
      </div>

      {/* Mask 3 — cry-laughing, top-right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '42%',
          height: '42%',
          zIndex: 4,
          filter: 'sepia(0.1) saturate(1.2) hue-rotate(-6deg) brightness(0.9) drop-shadow(0 2px 8px rgba(212,175,55,0.5))',
        }}
      >
        <Image
          src="/assets/images/image-1788525147722.png"
          alt="Cry-laughing mask"
          fill
          className="object-contain"
          sizes={`${Math.round(size * 0.42)}px`}
          priority
        />
      </div>
    </div>
  );
});

export default AppLogo;
