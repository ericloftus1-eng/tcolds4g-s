import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const siteUrl = 'https://tcolds4g-s-tc-o-lds-rrn-100.vercel.app';

export const metadata: Metadata = {
  title: 'TCoLDS — A Community of Comedy',
  description:
    'TCoLDS is a community for comedians and comedy fans. Share videos, connect with creators, and earn Cheddar Coin.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    url: `${siteUrl}/entrance`,
    siteName: 'TCoLDS — A Community of Comedy',
    title: 'TCoLDS — A Community of Comedy',
    description:
      'Discover comedy, share your work, and connect with creators. Free to join.',
    images: [
      {
        url: `${siteUrl}/assets/images/app_logo.png`,
        width: 1200,
        height: 630,
        alt: 'TCoLDS logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TCoLDS — A Community of Comedy',
    description:
      'Discover comedy, share your work, and connect with creators. Free to join.',
    images: [`${siteUrl}/assets/images/app_logo.png`],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={plusJakartaSans.className}>
        {/* Hidden SVG for CC melting drip filter */}
        <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
          <defs>
            <filter id="cc-drip-filter" x="-20%" y="-20%" width="140%" height="160%">
              <feTurbulence type="turbulence" baseFrequency="0.04 0.06" numOctaves="3" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="warped" />
              <feMorphology in="warped" operator="dilate" radius="1" result="drip" />
              <feComposite in="drip" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>
        </svg>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
