'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { User, Bell, Shield, Palette, Globe, LogOut, ChevronRight, Camera, Check, Moon, Sun, Volume2, VolumeX, Coins, Heart, Radio, Trophy, Crown, Users, Vote, Zap, Save } from 'lucide-react';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';

type SettingsSection = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'account';

const sidebarItems: { id: SettingsSection; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Name, bio, avatar, rank' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'What alerts you receive' },
  { id: 'privacy', label: 'Privacy', icon: Shield, desc: 'Who sees your content' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme and display' },
  { id: 'account', label: 'Account', icon: Globe, desc: 'Login, security, data' },
];

const notifToggles = [
  { id: 'blessings', label: 'Blessings on your sermons', icon: Heart, color: '#E07B39' },
  { id: 'coins', label: 'Cheddar Coin tips received', icon: Coins, color: '#D4AF37' },
  { id: 'live', label: 'Live Mass starting soon', icon: Radio, color: '#52B788' },
  { id: 'lottery', label: 'Holy Lottery draws', icon: Trophy, color: '#E07B39' },
  { id: 'ordination', label: 'Rank-up milestones', icon: Crown, color: '#D4AF37' },
  { id: 'follow', label: 'New congregation members', icon: Users, color: '#52B788' },
  { id: 'election', label: 'Community elections', icon: Vote, color: '#7B4EA0' },
];

const privacyToggles = [
  { id: 'showCC', label: 'Show CC balance publicly', desc: 'Others can see your Cheddar Coin total' },
  { id: 'showCong', label: 'Show congregation count', desc: 'Display your follower count on profile' },
  { id: 'allowTips', label: 'Allow CC tips from anyone', desc: 'Anyone can send you Cheddar Coins' },
  { id: 'showOnline', label: 'Show online status', desc: 'Let friends see when you\'re active' },
  { id: 'indexProfile', label: 'Appear in member search', desc: 'Show up in trending and search results' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState('Deacon Thunderpants');
  const [handle, setHandle] = useState('thunderpants');
  const [bio, setBio] = useState('Ordained comedian. Preaching punchlines since 2019. Holy Roast champion two years running.');
  const [location, setLocation] = useState('The Sacred Stage, Nashville TN');

  // Notification toggles
  const [notifState, setNotifState] = useState<Record<string, boolean>>(
    Object.fromEntries(notifToggles.map((n) => [n.id, true]))
  );

  // Privacy toggles
  const [privacyState, setPrivacyState] = useState<Record<string, boolean>>(
    Object.fromEntries(privacyToggles.map((p) => [p.id, true]))
  );

  // Appearance
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.25)', color: 'var(--primary)' }}>
              Settings
            </span>
          </div>
          <h1 className="text-hero-xl text-gold">Church Settings</h1>
          <p className="text-sm font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Manage your profile, notifications, and account preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div
            className="lg:col-span-1 rounded-2xl border overflow-hidden h-fit"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted border-b last:border-b-0"
                style={{
                  borderColor: 'var(--border)',
                  background: activeSection === item.id ? 'rgba(139,26,26,0.1)' : 'transparent',
                  borderLeft: activeSection === item.id ? '3px solid var(--primary)' : '3px solid transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: activeSection === item.id ? 'rgba(139,26,26,0.2)' : 'var(--muted)',
                    border: `1px solid ${activeSection === item.id ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <item.icon size={14} style={{ color: activeSection === item.id ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-700" style={{ color: activeSection === item.id ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{item.desc}</p>
                </div>
                <ChevronRight size={12} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">

            {/* PROFILE */}
            {activeSection === 'profile' && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Profile Manager</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>How the congregation sees you</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-800"
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
                      >
                        DT
                      </div>
                      <button
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors hover:opacity-90"
                        style={{ background: 'var(--primary)', borderColor: 'var(--card)', color: 'var(--primary-foreground)' }}
                      >
                        <Camera size={12} />
                      </button>
                    </div>
                    <div>
                      <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Profile Photo</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>JPG, PNG or GIF. Max 5MB.</p>
                      <button className="mt-2 text-xs font-600 px-3 py-1.5 rounded-lg border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Display Name</label>
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors"
                        style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Handle</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>@</span>
                        <input
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm border outline-none transition-colors"
                          style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none transition-colors"
                      style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{bio.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors"
                      style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                  </div>

                  {/* CC Balance display */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl border"
                    style={{ background: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.25)' }}
                  >
                    <CheddarCoinDisplay size={36} />
                    <div>
                      <p className="text-xs font-700" style={{ color: 'var(--foreground)' }}>Your Cheddar Coin Balance</p>
                      <p className="text-2xl font-900 font-mono-data text-gold">8,240 CC</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Platform currency — earned through content &amp; community
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Notification Preferences</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Choose what the congregation can interrupt you with</p>
                </div>
                <div className="p-6 space-y-3">
                  {notifToggles.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border transition-colors"
                      style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}
                        >
                          <item.icon size={14} style={{ color: item.color }} />
                        </div>
                        <span className="text-sm font-600" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                      </div>
                      <button
                        onClick={() => setNotifState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                        style={{ background: notifState[item.id] ? 'var(--primary)' : 'var(--border)' }}
                      >
                        <span
                          className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                          style={{
                            background: 'white',
                            transform: notifState[item.id] ? 'translateX(22px)' : 'translateX(2px)',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRIVACY */}
            {activeSection === 'privacy' && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Privacy Controls</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Control what the congregation can see</p>
                </div>
                <div className="p-6 space-y-3">
                  {privacyToggles.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border"
                      style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-600" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setPrivacyState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                        style={{ background: privacyState[item.id] ? 'var(--primary)' : 'var(--border)' }}
                      >
                        <span
                          className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                          style={{
                            background: 'white',
                            transform: privacyState[item.id] ? 'translateX(22px)' : 'translateX(2px)',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {activeSection === 'appearance' && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Appearance</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Customize how TCoLDS looks for you</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm font-700 mb-3" style={{ color: 'var(--foreground)' }}>Theme</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-150"
                          style={{
                            background: theme === t ? 'rgba(139,26,26,0.1)' : 'var(--muted)',
                            borderColor: theme === t ? 'var(--primary)' : 'var(--border)',
                          }}
                        >
                          {t === 'dark' ? <Moon size={18} style={{ color: '#7B4EA0' }} /> : <Sun size={18} style={{ color: '#D4AF37' }} />}
                          <span className="text-sm font-700 capitalize" style={{ color: 'var(--foreground)' }}>{t} Mode</span>
                          {theme === t && <Check size={14} className="ml-auto" style={{ color: 'var(--primary)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <Volume2 size={16} style={{ color: '#52B788' }} /> : <VolumeX size={16} style={{ color: 'var(--muted-foreground)' }} />}
                      <div>
                        <p className="text-sm font-600" style={{ color: 'var(--foreground)' }}>Sound Effects</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Notification sounds and UI audio</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="relative w-11 h-6 rounded-full transition-colors duration-200"
                      style={{ background: soundEnabled ? 'var(--primary)' : 'var(--border)' }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                        style={{ background: 'white', transform: soundEnabled ? 'translateX(22px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-600" style={{ color: 'var(--foreground)' }}>Compact Mode</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tighter spacing for more content</p>
                    </div>
                    <button
                      onClick={() => setCompactMode(!compactMode)}
                      className="relative w-11 h-6 rounded-full transition-colors duration-200"
                      style={{ background: compactMode ? 'var(--primary)' : 'var(--border)' }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                        style={{ background: 'white', transform: compactMode ? 'translateX(22px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Account &amp; Security</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address</label>
                      <input
                        type="email"
                        defaultValue="deacon@tcolds.church"
                        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                        style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>New Password</label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                        style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-2xl border p-5"
                  style={{ background: 'rgba(139,26,26,0.06)', borderColor: 'rgba(139,26,26,0.3)' }}
                >
                  <h3 className="font-700 text-sm mb-1" style={{ color: 'var(--primary)' }}>Danger Zone</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>These actions are permanent and cannot be undone.</p>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-700 border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                      <LogOut size={12} />
                      Sign Out
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-700 border transition-colors" style={{ borderColor: 'rgba(139,26,26,0.5)', color: 'var(--primary)' }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeSection !== 'account' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 hover:opacity-90"
                  style={{ background: saved ? '#52B788' : 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  {saved ? <Check size={14} /> : <Save size={14} />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
