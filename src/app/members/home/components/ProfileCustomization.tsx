'use client';
import React, { useState } from 'react';
import { X, Palette, Type, Image, Check, Sparkles } from 'lucide-react';

interface ProfileCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberInitials: string;
}

const themeColors = [
  { id: 'crimson', label: 'Holy Crimson', value: '#8B1A1A', bg: '#1a0808' },
  { id: 'gold', label: 'Sacred Gold', value: '#D4AF37', bg: '#1a1500' },
  { id: 'emerald', label: 'Green Room', value: '#52B788', bg: '#081a10' },
  { id: 'purple', label: 'Bishop Purple', value: '#7B4EA0', bg: '#0e0818' },
  { id: 'orange', label: 'Hellfire Orange', value: '#E07B39', bg: '#1a0e08' },
  { id: 'blue', label: 'Holy Water Blue', value: '#4EA0C0', bg: '#081218' },
];

const bannerPatterns = [
  { id: 'flames', label: 'Holy Flames', emoji: '🔥' },
  { id: 'crosses', label: 'Sacred Crosses', emoji: '✝️' },
  { id: 'cheese', label: 'Cheddar Rain', emoji: '🧀' },
  { id: 'stars', label: 'Celestial', emoji: '⭐' },
  { id: 'waves', label: 'Congregation Waves', emoji: '🌊' },
  { id: 'none', label: 'Clean', emoji: '◻️' },
];

const clergyTitles = [
  'The Blessed',
  'The Unhinged',
  'The Holy Roaster',
  'Keeper of the Punchline',
  'Ordained Chaos Agent',
  'Sacred Jester',
  'The Congregation\'s Favorite',
  'Bringer of Holy Laughter',
  'The Bit Whisperer',
  'Defender of the Dark Joke',
];

export default function ProfileCustomization({
  isOpen,
  onClose,
  memberName,
  memberInitials,
}: ProfileCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'theme' | 'banner' | 'title' | 'bio'>('theme');
  const [selectedColor, setSelectedColor] = useState('crimson');
  const [selectedPattern, setSelectedPattern] = useState('flames');
  const [selectedTitle, setSelectedTitle] = useState(clergyTitles[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const activeColor = themeColors.find((c) => c.id === selectedColor) || themeColors[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'banner', label: 'Banner', icon: Image },
    { id: 'title', label: 'Title', icon: Sparkles },
    { id: 'bio', label: 'Bio', icon: Type },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden fade-in-up"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)', background: `${activeColor.bg}` }}
        >
          <div>
            <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Profile Customization</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Make your clergy profile uniquely yours</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Preview strip */}
        <div
          className="px-5 py-4 border-b flex items-center gap-3"
          style={{ borderColor: 'var(--border)', background: `${activeColor.value}12` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-800 flex-shrink-0"
            style={{ background: `${activeColor.value}22`, color: activeColor.value, border: `2px solid ${activeColor.value}66` }}
          >
            {memberInitials}
          </div>
          <div>
            <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>{memberName}</p>
            <p className="text-xs font-600" style={{ color: activeColor.value }}>
              {customTitle || selectedTitle}
            </p>
            {bio && (
              <p className="text-xs mt-0.5 font-500" style={{ color: 'var(--muted-foreground)' }}>
                {bio.slice(0, 60)}{bio.length > 60 ? '...' : ''}
              </p>
            )}
          </div>
          <div className="ml-auto text-xs font-600 px-2 py-1 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            Preview
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-600 transition-all duration-150 border-b-2"
              style={{
                borderBottomColor: activeTab === tab.id ? activeColor.value : 'transparent',
                color: activeTab === tab.id ? activeColor.value : 'var(--muted-foreground)',
              }}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 min-h-[200px]">
          {activeTab === 'theme' && (
            <div>
              <p className="text-xs font-600 mb-3" style={{ color: 'var(--muted-foreground)' }}>Choose your profile color theme</p>
              <div className="grid grid-cols-3 gap-2">
                {themeColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className="flex items-center gap-2 p-3 rounded-xl border transition-all duration-150"
                    style={{
                      background: selectedColor === color.id ? `${color.value}18` : 'var(--muted)',
                      borderColor: selectedColor === color.id ? color.value : 'var(--border)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: color.value }}
                    >
                      {selectedColor === color.id && <Check size={10} color="white" />}
                    </div>
                    <span className="text-xs font-600 text-left" style={{ color: 'var(--foreground)' }}>{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div>
              <p className="text-xs font-600 mb-3" style={{ color: 'var(--muted-foreground)' }}>Choose your profile banner pattern</p>
              <div className="grid grid-cols-3 gap-2">
                {bannerPatterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150"
                    style={{
                      background: selectedPattern === pattern.id ? `${activeColor.value}18` : 'var(--muted)',
                      borderColor: selectedPattern === pattern.id ? activeColor.value : 'var(--border)',
                    }}
                  >
                    <span className="text-2xl">{pattern.emoji}</span>
                    <span className="text-xs font-600" style={{ color: 'var(--foreground)' }}>{pattern.label}</span>
                    {selectedPattern === pattern.id && (
                      <Check size={12} style={{ color: activeColor.value }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'title' && (
            <div>
              <p className="text-xs font-600 mb-3" style={{ color: 'var(--muted-foreground)' }}>Choose or write your clergy title</p>
              <input
                type="text"
                placeholder="Write a custom title..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                maxLength={40}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none mb-3"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <p className="text-xs font-600 mb-2" style={{ color: 'var(--muted-foreground)' }}>Or pick a preset:</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {clergyTitles.map((title) => (
                  <button
                    key={title}
                    onClick={() => { setSelectedTitle(title); setCustomTitle(''); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-500 transition-all duration-150 border"
                    style={{
                      background: selectedTitle === title && !customTitle ? `${activeColor.value}18` : 'var(--muted)',
                      borderColor: selectedTitle === title && !customTitle ? activeColor.value : 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div>
              <p className="text-xs font-600 mb-3" style={{ color: 'var(--muted-foreground)' }}>Write your clergy bio (max 160 chars)</p>
              <textarea
                placeholder="Tell the congregation who you are. Keep it holy. Or don't."
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 160))}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>
                {bio.length}/160
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-600 border transition-all duration-150 hover:bg-muted"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 hover:opacity-90"
            style={{ background: activeColor.value, color: 'white' }}
          >
            {saved ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
