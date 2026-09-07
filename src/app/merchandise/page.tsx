'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';
import { ShoppingBag, TrendingUp, Coins, Crown, Heart, Package, CheckCircle, Sparkles, ArrowRight, Shirt, Coffee, Tag } from 'lucide-react';

const featuredMembers = [
  {
    id: 'm1',
    name: 'Archbishop Thunderpants',
    handle: 'thunderpants',
    initials: 'AT',
    color: '#E07B39',
    rank: 'Archbishop',
    items: 4,
    totalSold: 1240,
    earned: '86,800 CC',
    products: [
      { id: 'p1', name: '"Thou Shalt Not Bomb" Tee', price: 250, type: 'Shirt', hot: true },
      { id: 'p2', name: 'Holy Thunderpants Mug', price: 150, type: 'Mug', hot: false },
    ],
  },
  {
    id: 'm2',
    name: 'Rev. Cacklesworth',
    handle: 'cacklesworth',
    initials: 'RC',
    color: '#52B788',
    rank: 'Minister',
    items: 2,
    totalSold: 680,
    earned: '47,600 CC',
    products: [
      { id: 'p3', name: 'Cacklesworth Clergy Hoodie', price: 400, type: 'Hoodie', hot: true },
      { id: 'p4', name: '"Blessed Be the Punchline" Poster', price: 120, type: 'Print', hot: false },
    ],
  },
  {
    id: 'm3',
    name: 'Bishop Snortley',
    handle: 'snortley',
    initials: 'BS',
    color: '#D4AF37',
    rank: 'Bishop',
    items: 3,
    totalSold: 420,
    earned: '29,400 CC',
    products: [
      { id: 'p5', name: 'Snortley Sticker Pack', price: 80, type: 'Stickers', hot: false },
      { id: 'p6', name: '"Bishop Mode" Cap', price: 200, type: 'Hat', hot: true },
    ],
  },
];

const productTypeIcons: Record<string, React.ElementType> = {
  Shirt: Shirt,
  Hoodie: Shirt,
  Mug: Coffee,
  Print: Tag,
  Stickers: Tag,
  Hat: Crown,
};

const howItWorks = [
  {
    step: '01',
    title: 'Top Members Qualify',
    desc: 'Clergy ranked Minister and above with 10k+ congregation members are eligible for merch production.',
    color: '#D4AF37',
  },
  {
    step: '02',
    title: 'We Clear It Together',
    desc: 'TCoLDS works with you to design and approve every product. Nothing ships without your blessing.',
    color: '#52B788',
  },
  {
    step: '03',
    title: 'We Produce & Fulfill',
    desc: 'Platform handles printing, packaging, and shipping. You preach — we handle the logistics.',
    color: '#7B4EA0',
  },
  {
    step: '04',
    title: '70% Profit in Cheddar Coin',
    desc: 'You earn 70% of every sale, paid directly to your CC wallet. Cheddar Coin is platform currency — earned, spent, and given back within TCoLDS.',
    color: '#E07B39',
  },
];

export default function MerchandisePage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: 'var(--primary)', minHeight: '240px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0800 50%, #0a0a14 100%)' }}
          />
          <div className="absolute top-0 right-0 w-80 h-80 blob-gold opacity-20 pointer-events-none" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.3)', color: 'var(--primary)' }}>
                  Member Merchandise
                </span>
              </div>
              <h1 className="text-hero-xl text-gold mb-3">Holy Merch Drop</h1>
              <p className="text-base font-500 max-w-lg mb-4" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
                Official merchandise from TCoLDS's top clergy. Every purchase supports your favorite comedians directly — they earn <strong className="text-gold">70% profit in Cheddar Coin</strong>.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)' }}>
                  <CheddarCoinDisplay size={20} />
                  <span className="text-sm font-700 text-gold cc-melt" data-text="CC">CC</span>
                  <span className="text-sm font-700 text-gold ml-1">Platform Currency</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.04)' }}>
                  <CheckCircle size={14} style={{ color: '#52B788' }} />
                  <span className="text-sm font-600" style={{ color: 'var(--foreground)' }}>Member-approved designs</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <CheddarCoinDisplay size={96} />
              <p className="text-xs font-600 text-center" style={{ color: 'var(--muted-foreground)' }}>Hover to flip</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-5 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border p-5 relative overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div
                  className="text-4xl font-900 font-mono-data absolute top-3 right-4 opacity-10 select-none"
                  style={{ color: step.color }}
                >
                  {step.step}
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${step.color}22`, border: `1px solid ${step.color}44` }}
                >
                  <span className="text-xs font-800 font-mono-data" style={{ color: step.color }}>{step.step}</span>
                </div>
                <h3 className="font-700 text-sm mb-1.5" style={{ color: 'var(--foreground)' }}>{step.title}</h3>
                <p className="text-xs font-500 leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Member Stores */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-display-lg flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              Top Member Stores
            </h2>
          </div>

          <div className="space-y-6">
            {featuredMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {/* Member header */}
                <div
                  className="p-5 border-b flex items-center justify-between gap-4"
                  style={{ borderColor: 'var(--border)', background: `${member.color}08` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-800 flex-shrink-0"
                      style={{ background: `${member.color}22`, color: member.color, border: `2px solid ${member.color}55` }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-700 text-base" style={{ color: 'var(--foreground)' }}>{member.name}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-600"
                          style={{ background: `${member.color}22`, color: member.color }}
                        >
                          {member.rank}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        @{member.handle} · {member.items} products · {member.totalSold.toLocaleString()} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Total Earned</p>
                    <p className="font-800 font-mono-data text-gold">{member.earned}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>platform currency</p>
                  </div>
                </div>

                {/* Products */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.products.map((product) => {
                    const PIcon = productTypeIcons[product.type] || Package;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 hover:border-opacity-60 cursor-pointer"
                        style={{
                          background: product.hot ? 'rgba(139,26,26,0.06)' : 'var(--muted)',
                          borderColor: product.hot ? 'rgba(139,26,26,0.3)' : 'var(--border)',
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${member.color}18`, border: `1px solid ${member.color}33` }}
                        >
                          <PIcon size={18} style={{ color: member.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-600 truncate" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                            {product.hot && <Heart size={11} fill="var(--secondary)" stroke="none" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-700 font-mono-data" style={{ color: 'var(--primary)' }}>{product.price} CC</span>
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cheddar Coin</span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-600"
                              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: '10px' }}
                            >
                              {product.type}
                            </span>
                          </div>
                        </div>
                        <button
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-700 transition-all duration-150 active:scale-95 hover:opacity-90"
                          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                          Buy
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apply for Merch */}
        <div
          className="rounded-2xl border p-6 mb-8"
          style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a0800)', borderColor: 'var(--primary)' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,26,26,0.3)', border: '1px solid var(--primary)' }}
              >
                <Crown size={22} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 className="font-700 text-lg text-gold mb-1">Want Your Own Merch Line?</h3>
                <p className="text-sm font-500 max-w-lg" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
                  Clergy ranked <strong style={{ color: 'var(--foreground)' }}>Minister or above</strong> with 10k+ congregation members can apply. We'll work with you on designs, clear everything together, and you keep <strong className="text-gold">70% of every sale in Cheddar Coin</strong>.
                </p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  {['Minister+ rank required', '10k+ congregation', 'Design approval required', '70% CC profit'].map((req) => (
                    <div key={req} className="flex items-center gap-1.5">
                      <CheckCircle size={12} style={{ color: '#52B788' }} />
                      <span className="text-xs font-600" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setApplyOpen(!applyOpen)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
            >
              Apply for Merch
              <ArrowRight size={14} />
            </button>
          </div>

          {applyOpen && (
            <div
              className="mt-5 pt-5 border-t"
              style={{ borderColor: 'rgba(139,26,26,0.3)' }}
            >
              <p className="text-sm font-600 mb-3" style={{ color: 'var(--foreground)' }}>Submit your merch application</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Your clergy name / handle"
                  className="px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <input
                  type="text"
                  placeholder="Merch idea (e.g. T-shirt, mug, poster)"
                  className="px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <textarea
                placeholder="Describe your merch concept and why your congregation would love it..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none mb-3"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <button
                className="px-5 py-2.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 hover:opacity-90"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onClick={() => { setApplyOpen(false); }}
              >
                Submit Application
              </button>
            </div>
          )}
        </div>

        {/* Profit breakdown */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-700 text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Coins size={14} style={{ color: 'var(--primary)' }} />
            Profit Split Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Member Profit', pct: '70%', desc: 'Paid in Cheddar Coin to your wallet', color: '#52B788' },
              { label: 'Platform & Production', pct: '20%', desc: 'Covers printing, shipping & fulfillment', color: '#4EA0C0' },
              { label: 'TCoLDS Fund', pct: '10%', desc: 'Goes to the congregation charity pool', color: '#D4AF37' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl border"
                style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
              >
                <p className="text-2xl font-900 font-mono-data mb-1" style={{ color: item.color }}>{item.pct}</p>
                <p className="text-sm font-700 mb-1" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 font-500" style={{ color: 'var(--muted-foreground)' }}>
            All CC earnings are platform currency — earned through content, tips, and community. Minimum payout threshold: 500 CC. Processed weekly to your CC wallet.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
