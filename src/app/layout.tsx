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

const siteUrl = 'https://tcolds3821.builtwithrocket.new';

export const metadata: Metadata = {
  title: 'TCoLDS — The Church of Laughterday Saints',
  description:
    'Join the congregation. The Church of Laughterday Saints is the social media platform where comedy is the religion and laughter is the gospel. Earn Cheddar Coins, get ordained, and rise through the clergy.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    url: `${siteUrl}/entrance`,
    siteName: 'TCoLDS — The Church of Laughterday Saints',
    title: '⛪ The Church of Laughterday Saints — Where Comedy is the Religion',
    description:
      'Join 94,000+ congregation members. Get ordained, earn Cheddar Coins, and rise through the clergy ranks. Comedy is the gospel. Laughter is salvation. Come as you are. 👉 It\'s free.',
    images: [
      {
        url: `${siteUrl}/assets/images/app_logo.png`,
        width: 1200,
        height: 630,
        alt: 'TCoLDS — The Church of Laughterday Saints logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '⛪ The Church of Laughterday Saints — Where Comedy is the Religion',
    description:
      'Join 94,000+ congregation members. Get ordained, earn Cheddar Coins, and rise through the clergy ranks. Comedy is the gospel. Laughter is salvation. 👉 Free to join.',
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

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ftcolds3821back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></head>
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