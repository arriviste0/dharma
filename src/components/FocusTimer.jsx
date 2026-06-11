import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Flame } from 'lucide-react';

const PRESETS = [5, 10, 20, 30, 45];

function playBell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [528, 480, 396];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.6;
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      osc.start(t);
      osc.stop(t + 2.5);
    });
  } catch {}
}

export default function FocusTimer({ onClose, onComplete }) {
  const [minutes, setMinutes] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      setTimeLeft(minutes * 60);
    }
  }, [minutes]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            playBell();
            onComplete?.({ date: new Date().toISOString().slice(0, 10), duration: minutes, completedAt: new Date().toISOString() });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      startedRef.current = true;
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    startedRef.current = false;
    setTimeLeft(minutes * 60);
  }

  function selectPreset(m) {
    if (running) return;
    setMinutes(m);
    startedRef.current = false;
    setTimeLeft(m * 60);
    setFinished(false);
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const total = minutes * 60;
  const progress = total > 0 ? 1 - timeLeft / total : 1;
  const r = 58;
  const circumference = 2 * Math.PI * r;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 z-10 page-transition"
        style={{
          background: 'linear-gradient(160deg, #0d0d1f 0%, #131325 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,132,60,0.15)' }}>
              <Flame size={14} style={{ color: '#E8843C' }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Focus Timer</div>
              <div className="text-[11px] text-stone-500">Undivided presence</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Preset pills */}
        <div className="flex gap-1.5 mb-6">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => selectPreset(m)}
              disabled={running}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${running ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{
                background: minutes === m ? '#E8843C' : 'rgba(255,255,255,0.06)',
                color: minutes === m ? '#fff' : '#6B7280',
              }}
            >
              {m}m
            </button>
          ))}
        </div>

        {/* Ring */}
        <div className="flex justify-center mb-5">
          <div className="relative w-36 h-36">
            <svg width="144" height="144" className="-rotate-90">
              <circle
                cx="72" cy="72" r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="7"
              />
              <circle
                cx="72" cy="72" r={r}
                fill="none"
                stroke={finished ? '#C9A961' : '#E8843C'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {finished ? (
                <div className="text-center">
                  <div className="text-3xl mb-0.5">🔔</div>
                  <div className="text-xs text-[#C9A961] font-semibold">Done</div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                    {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    {running ? 'focusing…' : startedRef.current ? 'paused' : `${minutes} min`}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Completion message */}
        {finished && (
          <div className="mb-4 px-3 py-2.5 rounded-xl text-center" style={{ background: 'rgba(201,169,97,0.08)', border: '1px solid rgba(201,169,97,0.2)' }}>
            <p className="font-verse italic text-sm text-[#C9A961] leading-relaxed">
              "The action is yours. The fruit belongs to dharma."
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#6B7280' }}
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>

          {finished ? (
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #2D3561, #5B6BAF)' }}
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex-1 h-12 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: running ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #E8843C, #C9A961)' }}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? 'Pause' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
