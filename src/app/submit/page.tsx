'use client';
import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Upload, Video, Flame, Moon, Leaf, Radio, Church, X, CheckCircle, AlertCircle, Tag, FileVideo, Eye, Lock, Globe, Mic } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';



const destinations = [
  {
    id: 'mass-sermons',
    label: 'Featured Videos',
    sublabel: 'The Pulpit — Main community feed',
    icon: Flame,
    gradient: 'linear-gradient(135deg, #1a0a0a, #3d1a00)',
    borderColor: 'var(--primary)',
    accentColor: 'var(--primary)',
    description: 'Reach the full community. Best for stand-up clips, sketches, and comedy videos.',
    badge: 'Main Stage',
  },
  {
    id: 'the-basement',
    label: 'The Basement',
    sublabel: 'Dark comedy zone — 18+ unfiltered',
    icon: Moon,
    gradient: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)',
    borderColor: '#7B4EA0',
    accentColor: '#A855F7',
    description: 'For dark, vulgar, blasphemous, and no-holds-barred comedy. No filter required.',
    badge: '18+ Dark',
  },
  {
    id: 'green-room',
    label: 'The Green Room',
    sublabel: 'Clergy-exclusive lounge content',
    icon: Leaf,
    gradient: 'linear-gradient(135deg, #0a1a0a, #0d2e0d)',
    borderColor: '#52B788',
    accentColor: '#52B788',
    description: 'Exclusive content for ordained clergy members. Perks, behind-the-scenes, and private sets.',
    badge: 'Clergy Only',
  },
  {
    id: 'live-mass',
    label: 'Live Show',
    sublabel: 'Schedule a live performance',
    icon: Radio,
    gradient: 'linear-gradient(135deg, #1a0a0a, #2e0a0a)',
    borderColor: 'var(--secondary)',
    accentColor: 'var(--secondary)',
    description: 'Schedule a live set. Your followers will be notified before you go live.',
    badge: 'Live',
  },
  {
    id: 'entrance',
    label: 'Featured Showcase',
    sublabel: 'Featured in the lobby showcase',
    icon: Church,
    gradient: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    borderColor: 'var(--border)',
    accentColor: 'var(--muted-foreground)',
    description: 'Highlighted for new visitors and first-time community members.',
    badge: 'Featured',
  },
];

const contentTags = [
  'Stand-Up', 'Roast', 'Dark Skit', 'Open Mic', 'Improv', 'Parody',
  'Sermon', 'Live Set', 'Confessional', 'Blasphemy', 'Crowd Work', 'Original',
];

const visibilityOptions = [
  { id: 'public', label: 'Public', icon: Globe, desc: 'Visible to all congregation members' },
  { id: 'clergy', label: 'Clergy Only', icon: Lock, desc: 'Restricted to ordained ministers' },
  { id: 'unlisted', label: 'Unlisted', icon: Eye, desc: 'Only accessible via direct link' },
];

interface UploadState {
  file: File | null;
  preview: string | null;
  progress: number;
  uploading: boolean;
  uploaded: boolean;
}

export default function SubmitPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<UploadState>({
    file: null,
    preview: null,
    progress: 0,
    uploading: false,
    uploaded: false,
  });
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('public');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are accepted, holy one.');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error('File too large. Max 500MB per sermon.');
      return;
    }
    const preview = URL.createObjectURL(file);
    setUpload({ file, preview, progress: 0, uploading: true, uploaded: false });

    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setUpload((prev) => ({ ...prev, progress: 100, uploading: false, uploaded: true }));
        toast.success('Video received by the Holy Upload Server 🙏');
      } else {
        setUpload((prev) => ({ ...prev, progress: Math.round(prog) }));
      }
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upload.uploaded) { toast.error('Please upload a video first.'); return; }
    if (!selectedDestination) { toast.error('Choose a destination for your sermon.'); return; }
    if (!title.trim()) { toast.error('Give your sermon a title.'); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Your sermon has been submitted to the congregation! 🎤');
  };

  const destObj = destinations.find((d) => d.id === selectedDestination);

  if (submitted) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div
            className="max-w-md w-full rounded-2xl border p-10 text-center"
            style={{ background: 'var(--card)', borderColor: 'var(--primary)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              <CheckCircle size={36} style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <h2 className="text-2xl font-800 mb-2" style={{ color: 'var(--foreground)' }}>
              Sermon Submitted!
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
              <span className="font-600" style={{ color: 'var(--primary)' }}>&ldquo;{title}&rdquo;</span> is now in the review queue for{' '}
              <span className="font-600" style={{ color: destObj?.accentColor }}>
                {destObj?.label}
              </span>.
            </p>
            <p className="text-xs mb-8" style={{ color: 'var(--muted-foreground)' }}>
              The Holy Moderation Council will review your content within 24 hours. You&apos;ll receive a notification once it&apos;s live.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUpload({ file: null, preview: null, progress: 0, uploading: false, uploaded: false });
                  setTitle('');
                  setDescription('');
                  setSelectedTags([]);
                  setSelectedDestination('');
                  setVisibility('public');
                }}
                className="w-full py-3 rounded-xl font-700 text-sm transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
              >
                Submit Another Sermon
              </button>
              <a
                href="/"
                className="w-full py-3 rounded-xl font-600 text-sm text-center transition-all duration-200 hover:bg-muted block"
                style={{ color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
              >
                Back to The Pulpit
              </a>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-screen-lg mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            <Mic size={20} style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-800" style={{ color: 'var(--foreground)' }}>
              Submit a Video
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Upload your video and choose where to share it
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left column — upload + details */}
            <div className="lg:col-span-3 flex flex-col gap-5">

              {/* Video Upload Zone */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <FileVideo size={15} style={{ color: 'var(--primary)' }} />
                    Video File
                  </h2>
                </div>
                <div className="p-5">
                  {!upload.file ? (
                    <div
                      className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 px-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'scale-[1.01]' : ''}`}
                      style={{
                        borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
                        background: dragOver ? 'rgba(212,175,55,0.05)' : 'var(--muted)',
                      }}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))' }}
                      >
                        <Upload size={24} style={{ color: 'var(--primary)' }} />
                      </div>
                      <p className="font-700 text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                        Drop your sermon here
                      </p>
                      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                        or click to browse your holy archives
                      </p>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-600"
                        style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', border: '1px solid rgba(212,175,55,0.2)' }}
                      >
                        MP4, MOV, WebM · Max 500MB
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      {/* Video preview */}
                      <div className="relative bg-black aspect-video">
                        <video
                          src={upload.preview ?? undefined}
                          className="w-full h-full object-contain"
                          controls={upload.uploaded}
                          muted
                        />
                        {upload.uploading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                            <div className="w-48 mb-3">
                              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                                <span>Uploading to the Holy Server...</span>
                                <span className="font-mono-data" style={{ color: 'var(--primary)' }}>{upload.progress}%</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ width: `${upload.progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {upload.uploaded && (
                          <div
                            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-700"
                            style={{ background: 'rgba(0,0,0,0.8)', color: '#4ade80' }}
                          >
                            <CheckCircle size={11} />
                            Uploaded
                          </div>
                        )}
                      </div>
                      {/* File info */}
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--muted)' }}>
                        <div className="flex items-center gap-2 min-w-0">
                          <Video size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span className="text-xs font-600 truncate" style={{ color: 'var(--foreground)' }}>
                            {upload.file.name}
                          </span>
                          <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                            ({(upload.file.size / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUpload({ file: null, preview: null, progress: 0, uploading: false, uploaded: false })}
                          className="p-1 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div
                className="rounded-2xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Video Details</h2>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-600 mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                      Title <span style={{ color: 'var(--secondary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your sermon a holy title..."
                      maxLength={80}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 focus:ring-1"
                      style={{
                        background: 'var(--input)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                      }}
                    />
                    <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>
                      {title.length}/80
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-600 mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's this sermon about? Set the congregation's expectations..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 resize-none focus:ring-1"
                      style={{
                        background: 'var(--input)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                      }}
                    />
                    <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted-foreground)' }}>
                      {description.length}/500
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div
                className="rounded-2xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Tag size={14} style={{ color: 'var(--primary)' }} />
                    Tags
                    <span className="text-xs font-400 ml-auto" style={{ color: 'var(--muted-foreground)' }}>
                      {selectedTags.length}/5 selected
                    </span>
                  </h2>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {contentTags.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-3 py-1.5 rounded-full text-xs font-600 transition-all duration-150"
                          style={{
                            background: active ? 'rgba(212,175,55,0.15)' : 'var(--muted)',
                            color: active ? 'var(--primary)' : 'var(--muted-foreground)',
                            border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — destination + visibility + submit */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Destination Selector */}
              <div
                className="rounded-2xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>
                    Choose Destination <span style={{ color: 'var(--secondary)' }}>*</span>
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    Where should this sermon preach?
                  </p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {destinations.map((dest) => {
                    const Icon = dest.icon;
                    const active = selectedDestination === dest.id;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setSelectedDestination(dest.id)}
                        className="w-full text-left rounded-xl p-3 transition-all duration-150 hover:scale-[1.01]"
                        style={{
                          background: active ? dest.gradient : 'var(--muted)',
                          border: `1.5px solid ${active ? dest.borderColor : 'transparent'}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: active ? 'rgba(255,255,255,0.1)' : 'var(--card)',
                              border: `1px solid ${active ? dest.borderColor : 'var(--border)'}`,
                            }}
                          >
                            <Icon size={15} style={{ color: active ? dest.accentColor : 'var(--muted-foreground)' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-700"
                                style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                              >
                                {dest.label}
                              </span>
                              <span
                                className="text-xs px-1.5 py-0.5 rounded-full font-600 flex-shrink-0"
                                style={{
                                  background: active ? `${dest.accentColor}22` : 'var(--card)',
                                  color: active ? dest.accentColor : 'var(--muted-foreground)',
                                  border: `1px solid ${active ? dest.accentColor : 'var(--border)'}`,
                                  fontSize: '9px',
                                }}
                              >
                                {dest.badge}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                              {dest.sublabel}
                            </p>
                          </div>
                          {active && (
                            <CheckCircle size={14} style={{ color: dest.accentColor, flexShrink: 0 }} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Destination description */}
                {destObj && (
                  <div
                    className="mx-4 mb-4 p-3 rounded-xl text-xs"
                    style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)', color: 'var(--muted-foreground)' }}
                  >
                    <AlertCircle size={11} className="inline mr-1.5" style={{ color: 'var(--primary)' }} />
                    {destObj.description}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div
                className="rounded-2xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Visibility</h2>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {visibilityOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = visibility === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setVisibility(opt.id)}
                        className="w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all duration-150"
                        style={{
                          background: active ? 'rgba(212,175,55,0.08)' : 'var(--muted)',
                          border: `1.5px solid ${active ? 'var(--primary)' : 'transparent'}`,
                        }}
                      >
                        <Icon size={14} style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)', flexShrink: 0 }} />
                        <div>
                          <p className="text-xs font-700" style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                            {opt.label}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                            {opt.desc}
                          </p>
                        </div>
                        {active && <CheckCircle size={13} className="ml-auto" style={{ color: 'var(--primary)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div
                className="rounded-2xl border p-5"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {/* Checklist */}
                <div className="flex flex-col gap-2 mb-5">
                  {[
                    { label: 'Video uploaded', done: upload.uploaded },
                    { label: 'Destination selected', done: !!selectedDestination },
                    { label: 'Title added', done: title.trim().length > 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: item.done ? 'rgba(74,222,128,0.15)' : 'var(--muted)', border: `1px solid ${item.done ? '#4ade80' : 'var(--border)'}` }}
                      >
                        {item.done && <CheckCircle size={10} style={{ color: '#4ade80' }} />}
                      </div>
                      <span className="text-xs" style={{ color: item.done ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting || upload.uploading}
                  className="w-full py-3.5 rounded-xl font-700 text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Submitting to the Council...
                    </>
                  ) : (
                    <>
                      <Mic size={15} />
                      Submit Video
                    </>
                  )}
                </button>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
                  Reviewed by the moderation team within 24h
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
