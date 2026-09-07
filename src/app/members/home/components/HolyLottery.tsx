'use client';
import React, { useState, useEffect } from 'react';
import { Ticket, Crown, X, Dice1, RefreshCw, Wand2, Laugh } from 'lucide-react';
import { toast } from 'sonner';

const pastWinners = [
  { id: 'w1', name: 'Bishop Snortley', initials: 'BS', color: '#D4AF37', change: 'Turned all buttons into cheese emojis for 6 hours', date: '3 days ago' },
  { id: 'w2', name: 'Rev. Cacklesworth', initials: 'RC', color: '#52B788', change: 'Made the entire site Comic Sans for 2 hours', date: '1 week ago' },
  { id: 'w3', name: 'Deacon Wheezington', initials: 'DW', color: '#7B4EA0', change: 'Added a fog machine effect to every page load', date: '2 weeks ago' },
];

const aiEditIdeas = [
  '🧀 Replace all icons with cheese emojis',
  '🎺 Add a vuvuzela sound to every click',
  '🌈 Make the entire UI Comic Sans',
  '🔥 Set everything on fire (visually)',
  '🎭 Swap all member names with clergy puns',
  '🎪 Add a circus tent background',
  '👻 Make all text slowly fade in and out',
  '🎸 Play air guitar animation on hover',
  '🧙 Add wizard hat to every avatar',
  '🎉 Confetti on every page load',
];

interface HolyLotteryProps {
  compact?: boolean;
}

export default function HolyLottery({ compact = false }: HolyLotteryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState('14:32:07');
  const [currentIdea, setCurrentIdea] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdea((prev) => (prev + 1) % aiEditIdeas.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterLottery = () => {
    if (ticketCount <= 0) {
      toast.error('No tickets remaining! Buy more to enter.');
      return;
    }
    setTicketCount((prev) => prev - 1);
    toast.success('🎟️ Holy ticket submitted! May the congregation bless your entry.');
  };

  const handleRollWinner = async () => {
    setRolling(true);
    setWinner(null);
    await new Promise((r) => setTimeout(r, 2000));
    const names = ['Rev. Punchline McGee', 'Sister Snickerdoodle', 'Archbishop Thunderpants', 'Friar Tuck-and-Roll'];
    setWinner(names[Math.floor(Math.random() * names.length)]);
    setRolling(false);
  };

  if (compact) {
    return (
      <div
        className="rounded-2xl border p-4 cursor-pointer transition-all duration-150 hover:border-opacity-80"
        style={{ background: 'linear-gradient(135deg, #0e0818, #180a1a)', borderColor: '#7B4EA0' }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Ticket size={14} style={{ color: '#7B4EA0' }} />
            <span className="text-xs font-700" style={{ color: 'var(--foreground)' }}>Holy Lottery</span>
          </div>
          <span className="text-xs font-mono-data font-600" style={{ color: '#7B4EA0' }}>{timeLeft}</span>
        </div>
        <p className="text-xs font-500 mb-2" style={{ color: 'var(--foreground)', opacity: 0.75 }}>
          Win full AI editing control of the platform 🎭
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ticketCount} tickets left</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleEnterLottery(); }}
            className="text-xs font-700 px-3 py-1 rounded-lg transition-all duration-150 active:scale-95"
            style={{ background: '#7B4EA0', color: 'white' }}
          >
            Enter
          </button>
        </div>

        {isOpen && <HolyLotteryModal onClose={() => setIsOpen(false)} ticketCount={ticketCount} onEnter={handleEnterLottery} rolling={rolling} winner={winner} onRoll={handleRollWinner} currentIdea={currentIdea} timeLeft={timeLeft} />}
      </div>
    );
  }

  return (
    <>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e0818 0%, #180a1a 50%, #0e0818 100%)', borderColor: '#7B4EA0' }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: 'rgba(123,78,160,0.3)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(123,78,160,0.3)', border: '1px solid #7B4EA0' }}
              >
                <Ticket size={16} style={{ color: '#7B4EA0' }} />
              </div>
              <div>
                <h3 className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Holy Lottery</h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Weekly draw · AI editing control</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Next draw in</p>
              <p className="font-mono-data font-700 text-sm" style={{ color: '#7B4EA0' }}>{timeLeft}</p>
            </div>
          </div>
        </div>

        {/* Prize description */}
        <div className="p-5">
          <div
            className="rounded-xl border p-4 mb-4"
            style={{ background: 'rgba(123,78,160,0.08)', borderColor: 'rgba(123,78,160,0.3)' }}
          >
            <div className="flex items-start gap-3">
              <Wand2 size={18} style={{ color: '#7B4EA0' }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-700 mb-1" style={{ color: 'var(--foreground)' }}>
                  🎭 Win Full AI Editing Control
                </p>
                <p className="text-xs font-500 leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                  The winner gets <strong style={{ color: '#7B4EA0' }}>24 hours of AI-powered platform editing</strong> — change colors, fonts, button text, add animations, mess with the layout. The congregation watches in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Rotating idea preview */}
          <div
            className="rounded-xl border p-3 mb-4 flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}
          >
            <Laugh size={14} style={{ color: '#7B4EA0' }} />
            <p className="text-xs font-500 italic" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              Past winner idea: <span style={{ color: '#7B4EA0' }}>{aiEditIdeas[currentIdea]}</span>
            </p>
          </div>

          {/* Ticket entry */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-xs font-600 mb-1" style={{ color: 'var(--foreground)' }}>Your tickets this round</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(ticketCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-5 rounded flex items-center justify-center"
                    style={{ background: 'rgba(123,78,160,0.3)', border: '1px solid #7B4EA0' }}
                  >
                    <Ticket size={10} style={{ color: '#7B4EA0' }} />
                  </div>
                ))}
                {ticketCount === 0 && (
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No tickets</span>
                )}
              </div>
            </div>
            <button
              onClick={handleEnterLottery}
              disabled={ticketCount <= 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 disabled:opacity-50"
              style={{ background: '#7B4EA0', color: 'white' }}
            >
              <Ticket size={14} />
              Enter ({ticketCount} left)
            </button>
          </div>

          {/* Past winners */}
          <div>
            <p className="text-xs font-700 mb-2 flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
              <Crown size={11} style={{ color: '#D4AF37' }} />
              Recent Winners
            </p>
            <div className="space-y-2">
              {pastWinners.map((w) => (
                <div
                  key={w.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                    style={{ background: `${w.color}22`, color: w.color, border: `1.5px solid ${w.color}55` }}
                  >
                    {w.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600" style={{ color: 'var(--foreground)' }}>{w.name}</p>
                    <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{w.change}</p>
                    <p className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{w.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin roll (demo) */}
          <button
            onClick={handleRollWinner}
            disabled={rolling}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-700 border transition-all duration-150 hover:bg-muted disabled:opacity-60"
            style={{ borderColor: 'rgba(123,78,160,0.4)', color: '#7B4EA0' }}
          >
            {rolling ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Drawing winner...
              </>
            ) : (
              <>
                <Dice1 size={12} />
                Demo: Draw Winner Now
              </>
            )}
          </button>
          {winner && (
            <div
              className="mt-3 p-3 rounded-xl border text-center"
              style={{ background: 'rgba(123,78,160,0.15)', borderColor: '#7B4EA0' }}
            >
              <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>🎉 This week's winner:</p>
              <p className="font-800 text-sm mt-0.5" style={{ color: '#7B4EA0' }}>{winner}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>24 hours of AI editing control granted</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function HolyLotteryModal({
  onClose,
  ticketCount,
  onEnter,
  rolling,
  winner,
  onRoll,
  currentIdea,
  timeLeft,
}: {
  onClose: () => void;
  ticketCount: number;
  onEnter: () => void;
  rolling: boolean;
  winner: string | null;
  onRoll: () => void;
  currentIdea: number;
  timeLeft: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl border shadow-2xl p-6 fade-in-up"
        style={{ background: 'linear-gradient(135deg, #0e0818, #180a1a)', borderColor: '#7B4EA0' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
          <X size={16} />
        </button>
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(123,78,160,0.3)', border: '1px solid #7B4EA0' }}>
            <Ticket size={24} style={{ color: '#7B4EA0' }} />
          </div>
          <h3 className="font-700 text-lg" style={{ color: 'var(--foreground)' }}>Holy Lottery</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Next draw: {timeLeft}</p>
        </div>
        <p className="text-sm font-500 text-center mb-4" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
          Win <strong style={{ color: '#7B4EA0' }}>24 hours of AI editing control</strong> over the entire TCoLDS platform. Chaos is encouraged.
        </p>
        <div className="rounded-xl border p-3 mb-4 text-center" style={{ background: 'rgba(123,78,160,0.08)', borderColor: 'rgba(123,78,160,0.3)' }}>
          <p className="text-xs italic" style={{ color: '#7B4EA0' }}>{aiEditIdeas[currentIdea]}</p>
        </div>
        <button
          onClick={onEnter}
          disabled={ticketCount <= 0}
          className="w-full py-3 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: '#7B4EA0', color: 'white' }}
        >
          <Ticket size={16} />
          Enter Lottery ({ticketCount} tickets left)
        </button>
      </div>
    </div>
  );
}
