'use client';
import React, { useState, useRef, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Upload, Video, Image, X, Check, Globe, Lock, Users, Sparkles, Zap, Calendar, Eye, Play, AlertCircle, CloudUpload, Film, Music, BookOpen, Flame, Star, ArrowLeft, Plus, Trash2, LayoutDashboard } from 'lucide-react';

type ContentType = 'video' | 'sermon' | 'clip' | 'audio' | 'text';
type Visibility = 'public' | 'members' | 'private';
type ScheduleMode = 'now' | 'schedule';

interface UploadFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

const contentTypes: { id: ContentType; label: string; icon: React.ElementType; desc: string; color: string; accept: string }[] = [
  { id: 'video', label: 'Video Sermon', icon: Video, desc: 'Full-length comedy sets & sermons', color: '#4EA0C0', accept: 'video/*' },
  { id: 'clip', label: 'Holy Clip', icon: Film, desc: 'Short-form clips under 60 seconds', color: '#E07B39', accept: 'video/*' },
  { id: 'sermon', label: 'Text Sermon', icon: BookOpen, desc: 'Written comedy scripture & lore', color: '#7B4EA0', accept: '.txt,.doc,.docx' },
  { id: 'audio', label: 'Audio Riff', desc: 'Podcast-style audio content', icon: Music, color: '#52B788', accept: 'audio/*' },
];

const visibilityOptions: { id: Visibility; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'public', label: 'Public', icon: Globe, desc: 'Anyone can watch' },
  { id: 'members', label: 'Members Only', icon: Users, desc: 'Registered congregation' },
  { id: 'private', label: 'Private', icon: Lock, desc: 'Only you' },
];

const suggestedTags = ['#HolyRoast', '#OpenMic', '#Confession', '#Sermon', '#Basement', '#Ordained', '#Pulpit', '#Blessed', '#Uncut', '#LiveMass'];

export default function UploadStudioPage() {
  const [selectedType, setSelectedType] = useState<ContentType>('video');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [monetize, setMonetize] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((file: File) => {
    const newFile: UploadFile = { name: file.name, size: file.size, type: file.type, progress: 0, status: 'uploading' };
    setUploadedFile(newFile);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setUploadedFile((prev) => prev ? { ...prev, progress: 100, status: 'done' } : null);
      } else {
        setUploadedFile((prev) => prev ? { ...prev, progress: Math.round(prog) } : null);
      }
    }, 200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file);
  }, [simulateUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file);
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const addTag = (tag: string) => {
    const clean = tag.startsWith('#') ? tag : `#${tag}`;
    if (!tags.includes(clean) && tags.length < 8) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    setSubmitted(true);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-screen-md mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(82,183,136,0.15)', border: '2px solid #52B788' }}
          >
            <Check size={36} style={{ color: '#52B788' }} />
          </div>
          <h1 className="text-hero-xl text-gold mb-3">Sermon Submitted!</h1>
          <p className="text-sm font-500 mb-8 max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
            <strong style={{ color: 'var(--foreground)' }}>&ldquo;{title}&rdquo;</strong> has been blessed and is{' '}
            {scheduleMode === 'schedule' ? 'scheduled for publishing' : 'now live for the congregation'}.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/creator-dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <LayoutDashboard size={15} />
              View Dashboard
            </Link>
            <button
              onClick={() => { setSubmitted(false); setTitle(''); setDescription(''); setTags([]); setUploadedFile(null); setThumbnailPreview(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700 border transition-all duration-150 hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Plus size={15} />
              Upload Another
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/creator-dashboard" className="flex items-center gap-1.5 text-xs font-600 hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                <ArrowLeft size={13} />
                Creator Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.25)', color: 'var(--primary)' }}>
                Upload Studio
              </span>
            </div>
            <h1 className="text-hero-xl text-gold">Preach to the Masses</h1>
            <p className="text-sm font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Upload your content and let the congregation be blessed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/creator-dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-600 border transition-all duration-150 hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT — Upload + Metadata */}
          <div className="xl:col-span-2 space-y-5">

            {/* Content Type Selector */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Content Type</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>What kind of sermon are you delivering?</p>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contentTypes.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedType(ct.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 hover:scale-[1.02]"
                    style={{
                      borderColor: selectedType === ct.id ? ct.color : 'var(--border)',
                      background: selectedType === ct.id ? `${ct.color}12` : 'var(--muted)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${ct.color}20`, border: `1.5px solid ${ct.color}44` }}
                    >
                      <ct.icon size={18} style={{ color: ct.color }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-700" style={{ color: selectedType === ct.id ? ct.color : 'var(--foreground)' }}>{ct.label}</p>
                      <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{ct.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Upload File</h2>
              </div>
              <div className="p-5">
                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center gap-4 py-14 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
                      background: dragOver ? 'rgba(139,26,26,0.06)' : 'var(--muted)',
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: dragOver ? 'rgba(139,26,26,0.15)' : 'rgba(139,26,26,0.08)', border: '1.5px solid var(--primary)' }}
                    >
                      <CloudUpload size={28} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="text-center">
                      <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>
                        {dragOver ? 'Drop it like it\'s holy' : 'Drag & drop your sermon here'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        or <span style={{ color: 'var(--primary)', fontWeight: 700 }}>browse files</span> — MP4, MOV, MP3, PDF up to 2GB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl border"
                    style={{ background: 'var(--muted)', borderColor: uploadedFile.status === 'done' ? '#52B788' : 'var(--border)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: uploadedFile.status === 'done' ? 'rgba(82,183,136,0.15)' : 'rgba(78,160,192,0.15)' }}
                    >
                      {uploadedFile.status === 'done' ? (
                        <Check size={18} style={{ color: '#52B788' }} />
                      ) : (
                        <CloudUpload size={18} style={{ color: '#4EA0C0' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-700 truncate" style={{ color: 'var(--foreground)' }}>{uploadedFile.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatBytes(uploadedFile.size)}</p>
                      {uploadedFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${uploadedFile.progress}%`, background: 'var(--primary)' }}
                            />
                          </div>
                          <p className="text-xs mt-1 font-mono-data" style={{ color: 'var(--muted-foreground)' }}>{uploadedFile.progress}%</p>
                        </div>
                      )}
                      {uploadedFile.status === 'done' && (
                        <p className="text-xs mt-0.5 font-600" style={{ color: '#52B788' }}>Upload complete — blessed ✓</p>
                      )}
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Sermon Details</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Give your content a title, description, and tags</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>
                    Title <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. &quot;Thou Shalt Not Bomb&quot; — Sunday Massacre Set"
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    maxLength={120}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>{title.length}/120</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell the congregation what this sermon is about..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none transition-colors"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    maxLength={500}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>{description.length}/500</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--foreground)' }}>
                    Tags <span className="font-400" style={{ color: 'var(--muted-foreground)' }}>(up to 8)</span>
                  </label>
                  <div
                    className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border min-h-[44px]"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)' }}
                  >
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-600"
                        style={{ background: 'rgba(139,26,26,0.2)', color: 'var(--primary)', border: '1px solid rgba(139,26,26,0.3)' }}
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {tags.length < 8 && (
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={tags.length === 0 ? 'Add tags...' : ''}
                        className="flex-1 min-w-[80px] bg-transparent text-xs outline-none"
                        style={{ color: 'var(--foreground)' }}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {suggestedTags.filter((t) => !tags.includes(t)).slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-2 py-0.5 rounded-lg text-xs font-600 border transition-colors hover:bg-muted"
                        style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Thumbnail</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>The face of your sermon — 16:9 recommended</p>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div
                    className="w-40 h-24 rounded-xl border flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    {thumbnailPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <Image size={20} style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-600 mb-2" style={{ color: 'var(--foreground)' }}>Custom Thumbnail</p>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                      JPG or PNG, max 2MB. A great thumbnail gets 3× more clicks from the congregation.
                    </p>
                    <button
                      onClick={() => thumbInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 border transition-colors hover:bg-muted"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      <Upload size={12} />
                      {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </button>
                    <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbSelect} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Publish Settings */}
          <div className="space-y-5">

            {/* Publish Panel */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Publish</h2>
              </div>
              <div className="p-5 space-y-4">

                {/* Visibility */}
                <div>
                  <label className="block text-xs font-700 mb-2" style={{ color: 'var(--foreground)' }}>Visibility</label>
                  <div className="space-y-2">
                    {visibilityOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setVisibility(opt.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-150 text-left"
                        style={{
                          borderColor: visibility === opt.id ? 'var(--primary)' : 'var(--border)',
                          background: visibility === opt.id ? 'rgba(139,26,26,0.08)' : 'var(--muted)',
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: visibility === opt.id ? 'rgba(139,26,26,0.2)' : 'var(--border)' }}
                        >
                          <opt.icon size={13} style={{ color: visibility === opt.id ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                        </div>
                        <div>
                          <p className="text-xs font-700" style={{ color: visibility === opt.id ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{opt.label}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{opt.desc}</p>
                        </div>
                        {visibility === opt.id && (
                          <Check size={13} className="ml-auto flex-shrink-0" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-xs font-700 mb-2" style={{ color: 'var(--foreground)' }}>When to Preach</label>
                  <div className="flex gap-2 mb-3">
                    {(['now', 'schedule'] as ScheduleMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setScheduleMode(mode)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 border transition-all duration-150"
                        style={{
                          borderColor: scheduleMode === mode ? 'var(--primary)' : 'var(--border)',
                          background: scheduleMode === mode ? 'rgba(139,26,26,0.1)' : 'var(--muted)',
                          color: scheduleMode === mode ? 'var(--primary)' : 'var(--muted-foreground)',
                        }}
                      >
                        {mode === 'now' ? <Flame size={12} /> : <Calendar size={12} />}
                        {mode === 'now' ? 'Publish Now' : 'Schedule'}
                      </button>
                    ))}
                  </div>
                  {scheduleMode === 'schedule' && (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                        style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                        style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="space-y-2.5 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { label: 'Enable Monetization', desc: 'Earn CC from this content', state: monetize, set: setMonetize, color: '#D4AF37' },
                    { label: 'Allow Comments', desc: 'Let congregation respond', state: allowComments, set: setAllowComments, color: '#52B788' },
                  ].map((toggle) => (
                    <div key={toggle.label} className="flex items-center justify-between pt-2.5">
                      <div>
                        <p className="text-xs font-700" style={{ color: 'var(--foreground)' }}>{toggle.label}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{toggle.desc}</p>
                      </div>
                      <button
                        onClick={() => toggle.set(!toggle.state)}
                        className="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
                        style={{ background: toggle.state ? toggle.color : 'var(--border)' }}
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                          style={{ background: 'white', left: toggle.state ? '22px' : '2px' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Publish Button */}
                <button
                  onClick={handlePublish}
                  disabled={!title.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  <Sparkles size={15} />
                  {scheduleMode === 'schedule' ? 'Schedule Sermon' : 'Publish Sermon'}
                </button>
                {!title.trim() && (
                  <p className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <AlertCircle size={11} />
                    Add a title to publish
                  </p>
                )}
              </div>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-700 text-sm flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                  <Eye size={13} />
                  Preview
                </h2>
              </div>
              <div className="p-4">
                <div
                  className="w-full aspect-video rounded-xl flex items-center justify-center mb-3 overflow-hidden"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  {thumbnailPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnailPreview} alt="Content preview thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Play size={24} style={{ color: 'var(--muted-foreground)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No thumbnail yet</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-700 leading-snug" style={{ color: title ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {title || 'Your sermon title will appear here'}
                </p>
                {description && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded font-600" style={{ background: 'rgba(139,26,26,0.15)', color: 'var(--primary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div
              className="rounded-2xl border p-4"
              style={{ background: 'rgba(212,175,55,0.05)', borderColor: 'rgba(212,175,55,0.2)' }}
            >
              <p className="text-xs font-700 flex items-center gap-1.5 mb-2" style={{ color: '#D4AF37' }}>
                <Star size={12} />
                Preacher Tips
              </p>
              <ul className="space-y-1.5">
                {[
                  'Titles with numbers get 40% more clicks',
                  'Upload on Fri–Sun for peak congregation traffic',
                  'Tags help the algorithm bless your content',
                  'Custom thumbnails triple your click-through rate',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span style={{ color: '#D4AF37', flexShrink: 0 }}>·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
