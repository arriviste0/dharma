import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MandalaBg from '../components/svgs/MandalaBg';

// ─── Phase order ────────────────────────────────────────────────────────────
// dark → stars → figures → dialogue → verse → ready → closing → done
const PHASE_TIMINGS = [
  { phase: 'stars',    delay: 500  },
  { phase: 'figures',  delay: 1400 },
  { phase: 'dialogue', delay: 2600 },
  { phase: 'verse',    delay: 4200 },
  { phase: 'ready',    delay: 5800 },
];

// ─── Krishna silhouette ──────────────────────────────────────────────────────
function KrishnaSVG({ style }) {
  return (
    <svg viewBox="0 0 120 260" xmlns="http://www.w3.org/2000/svg" style={style}>
      {/* Halo rings */}
      <circle cx="60" cy="52" r="42" fill="none" stroke="#C9A961" strokeWidth="0.6" opacity="0.2"/>
      <circle cx="60" cy="52" r="34" fill="none" stroke="#C9A961" strokeWidth="0.5" opacity="0.15"/>

      {/* Peacock feather */}
      <path d="M60 18 Q60 6 60 0" stroke="#5A8A8A" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx="60" cy="-1" rx="7" ry="10" fill="none" stroke="#C9A961" strokeWidth="1.4" opacity="0.85"/>
      <ellipse cx="60" cy="0" rx="3.5" ry="5.5" fill="#5A8A8A" opacity="0.75"/>
      <circle cx="60" cy="0" r="1.8" fill="#1e2240"/>
      <circle cx="59" cy="-1" r="0.8" fill="white" opacity="0.5"/>

      {/* Crown */}
      <path d="M38 20 L46 11 L52 18 L60 9 L68 18 L74 11 L82 20"
        stroke="#C9A961" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Head */}
      <ellipse cx="60" cy="38" rx="21" ry="24" fill="#3B5BA5"/>

      {/* Face hint – eyes */}
      <circle cx="53" cy="35" r="2" fill="#C9A961" opacity="0.45"/>
      <circle cx="67" cy="35" r="2" fill="#C9A961" opacity="0.45"/>
      <path d="M54 44 Q60 49 66 44" stroke="#C9A961" strokeWidth="1" fill="none" opacity="0.4"/>

      {/* Neck */}
      <rect x="52" y="60" width="16" height="10" rx="4" fill="#3B5BA5"/>

      {/* Body – robe */}
      <path d="M60 70 C42 70 26 88 26 118 L30 220 C30 232 44 238 60 238 C76 238 90 232 90 220 L94 118 C94 88 78 70 60 70Z"
        fill="#3B5BA5"/>

      {/* Right arm – raised, abhaya mudra */}
      <path d="M90 104 L116 74" stroke="#3B5BA5" strokeWidth="16" strokeLinecap="round"/>
      <ellipse cx="119" cy="70" rx="10" ry="13" fill="#3B5BA5"/>
      {/* fingers hint */}
      <path d="M113 62 L116 58 M118 60 L120 56 M123 62 L125 59"
        stroke="#C9A961" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>

      {/* Left arm – extending toward Arjuna, teaching */}
      <path d="M26 110 L-8 136" stroke="#3B5BA5" strokeWidth="16" strokeLinecap="round"/>

      {/* Flute in left hand */}
      <path d="M-12 133 L22 120" stroke="#C9A961" strokeWidth="2.8" strokeLinecap="round"/>
      <circle cx="-3" cy="130" r="1.8" fill="#C9A961" opacity="0.7"/>
      <circle cx="6"  cy="127" r="1.8" fill="#C9A961" opacity="0.7"/>
      <circle cx="14" cy="124" r="1.8" fill="#C9A961" opacity="0.7"/>

      {/* Robe drape lines */}
      <path d="M42 170 L36 238 M60 175 L60 238 M78 170 L84 238"
        stroke="#C9A961" strokeWidth="0.8" opacity="0.2"/>

      {/* Divine glow emanating outward */}
      <ellipse cx="60" cy="140" rx="36" ry="80" fill="#C9A961" opacity="0.03"/>
    </svg>
  );
}

// ─── Arjuna silhouette ───────────────────────────────────────────────────────
function ArjunaSVG({ style }) {
  return (
    <svg viewBox="0 0 120 260" xmlns="http://www.w3.org/2000/svg" style={style}>
      {/* Gandiva bow (behind body) */}
      <path d="M100 18 Q130 110 100 220"
        stroke="#8B7040" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="100" y1="18" x2="100" y2="220"
        stroke="#C9A961" strokeWidth="1.2" strokeDasharray="6,5" opacity="0.65"/>

      {/* Helmet */}
      <path d="M36 34 Q60 18 84 34" stroke="#6A6A80" strokeWidth="3.5" fill="none"/>
      <path d="M36 34 Q38 24 60 20 Q82 24 84 34 L82 50 Q60 46 38 50Z"
        fill="#505068"/>
      <rect x="52" y="14" width="16" height="12" rx="3" fill="#505068"/>
      <line x1="60" y1="12" x2="60" y2="6" stroke="#C9A961" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="60" cy="5" r="3.5" fill="#C9A961" opacity="0.85"/>

      {/* Head – slightly bowed toward Krishna (left) */}
      <ellipse cx="56" cy="64" rx="20" ry="22"
        fill="#5A3A1A"
        style={{ transform: 'rotate(-12deg)', transformOrigin: '56px 64px' }}/>

      {/* Neck */}
      <rect x="48" y="84" width="14" height="10" rx="3" fill="#5A3A1A"/>

      {/* Body */}
      <path d="M60 94 C44 94 28 112 30 142 L34 222 C34 234 46 240 60 240 C74 240 86 234 86 222 L90 142 C92 112 76 94 60 94Z"
        fill="#4A3020"/>

      {/* Armour breastplate */}
      <path d="M36 110 L84 110 L88 165 L32 165Z" fill="#5A4030" opacity="0.5"/>
      <path d="M40 110 L80 110 L83 152 L37 152Z" fill="none" stroke="#8B6914" strokeWidth="0.8" opacity="0.5"/>
      {/* Armour center motif */}
      <path d="M55 130 L60 122 L65 130 L60 138Z" fill="#8B6914" opacity="0.3"/>

      {/* Left arm – in pranama, palms joined toward Krishna */}
      <path d="M30 125 L4 155" stroke="#4A3020" strokeWidth="15" strokeLinecap="round"/>
      <path d="M4 155 L10 178" stroke="#4A3020" strokeWidth="12" strokeLinecap="round"/>

      {/* Joined-hands detail */}
      <ellipse cx="7"  cy="176" rx="8" ry="11" fill="#4A3020"/>
      <ellipse cx="15" cy="178" rx="8" ry="11" fill="#3D2818"/>

      {/* Right arm – gripping bow */}
      <path d="M90 118 L100 100" stroke="#4A3020" strokeWidth="14" strokeLinecap="round"/>

      {/* Foot detail */}
      <path d="M42 236 L48 244 L55 238" stroke="#8B6914" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M65 238 L72 244 L78 236" stroke="#8B6914" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
function TypeWriter({ text, speed = 55, startDelay = 0, className = '' }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setShown(prev => {
          if (prev >= text.length) { clearInterval(iv); return prev; }
          return prev + 1;
        });
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, startDelay, speed]);

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {shown < text.length && <span className="animate-pulse opacity-70">|</span>}
    </span>
  );
}

// ─── Star field ──────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.sin(i * 137.5 * Math.PI / 180) * 50 + 50,
  y: (i * 1.618) % 100,
  r: [0.8, 1, 1.2, 1.5, 0.6][i % 5],
  delay: (i * 0.13) % 3,
  dur: 2.5 + (i % 4) * 0.8,
}));

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const navigate  = useNavigate();
  const [phase,   setPhase]   = useState('dark');
  const [closing, setClosing] = useState(false);
  const timersRef = useRef([]);

  // Auto-advance phases
  useEffect(() => {
    timersRef.current = PHASE_TIMINGS.map(({ phase: p, delay }) =>
      setTimeout(() => setPhase(p), delay)
    );
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Skip to ready on tap (before ready phase)
  function handleSkip() {
    if (phase === 'ready' || phase === 'closing') return;
    timersRef.current.forEach(clearTimeout);
    setPhase('ready');
  }

  // Begin — temple-door closing animation then navigate
  function handleBegin(e) {
    e.stopPropagation();
    setClosing(true);
    setTimeout(() => {
      onComplete();
      navigate('/home');
    }, 900);
  }

  const vis = (p) => phase === p || PHASE_TIMINGS.findIndex(x => x.phase === p) <
    PHASE_TIMINGS.findIndex(x => x.phase === phase) ||
    (phase === 'ready' || phase === 'closing');

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: 'linear-gradient(180deg, #06071a 0%, #0d1030 55%, #1a1440 100%)' }}
      onClick={handleSkip}
    >
      {/* ── Stars ────────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: vis('stars') ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      >
        {STARS.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
            <animate
              attributeName="opacity"
              values="0.15;0.7;0.15"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* ── Horizon glow ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '35%',
          background: 'linear-gradient(0deg, rgba(201,169,97,0.08) 0%, transparent 100%)',
          opacity: vis('stars') ? 1 : 0,
          transition: 'opacity 2s ease',
        }}
      />

      {/* ── Mandala background ───────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: vis('figures') ? 0.06 : 0,
          transition: 'opacity 2s ease',
        }}
      >
        <MandalaBg size={Math.min(window.innerWidth, 640)} color="#C9A961" opacity={1} className="chakra-rotate" />
      </div>

      {/* ── Battlefield ground line ──────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '18%',
          left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,97,0.25) 20%, rgba(201,169,97,0.5) 50%, rgba(201,169,97,0.25) 80%, transparent)',
          opacity: vis('figures') ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      {/* ── Figures area ─────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: '8%', bottom: '20%' }}
      >
        {/* Krishna (left) */}
        <div
          style={{
            position: 'absolute',
            left: '3%',
            bottom: 0,
            width: 'clamp(110px, 22vw, 210px)',
            opacity: vis('figures') ? 1 : 0,
            transform: vis('figures') ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1.2s ease 0.1s, transform 1.2s ease 0.1s',
          }}
        >
          <KrishnaSVG style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 18px rgba(59,91,165,0.5))' }} />
        </div>

        {/* Arjuna (right) */}
        <div
          style={{
            position: 'absolute',
            right: '3%',
            bottom: 0,
            width: 'clamp(100px, 20vw, 190px)',
            opacity: vis('figures') ? 1 : 0,
            transform: vis('figures') ? 'translateY(0) scaleX(-1)' : 'translateY(24px) scaleX(-1)',
            transition: 'opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s',
          }}
        >
          <ArjunaSVG style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 12px rgba(90,58,26,0.45))' }} />
        </div>

        {/* Divine light between them */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '20%',
            transform: 'translateX(-50%)',
            width: 'clamp(80px, 15vw, 140px)',
            height: 'clamp(80px, 15vw, 140px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, rgba(232,132,60,0.06) 50%, transparent 70%)',
            opacity: vis('dialogue') ? 1 : 0,
            transition: 'opacity 1.5s ease',
            animation: vis('dialogue') ? 'breath-pulse 4s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* ── Centre content ───────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none">

        {/* OM symbol */}
        <div
          style={{
            opacity: vis('stars') ? 1 : 0,
            transform: vis('stars') ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 1.5s ease, transform 1.5s ease',
            marginBottom: 'clamp(8px, 2vh, 20px)',
          }}
        >
          <span
            className="font-dev"
            style={{
              fontSize: 'clamp(36px, 7vw, 60px)',
              background: 'linear-gradient(135deg, #E8843C, #C9A961)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 10px rgba(201,169,97,0.4))',
              animation: 'breath-pulse 5s ease-in-out infinite',
            }}
          >
            ॐ
          </span>
        </div>

        {/* Dialogue exchange */}
        {vis('dialogue') && (
          <div
            style={{
              opacity: vis('dialogue') ? 1 : 0,
              transition: 'opacity 0.8s ease',
              maxWidth: 'clamp(260px, 55vw, 500px)',
              width: '100%',
              marginBottom: 'clamp(10px, 2.5vh, 24px)',
            }}
          >
            {/* Arjuna's words */}
            <div
              className="mb-3 rounded-2xl px-4 py-3 text-center"
              style={{
                background: 'rgba(90,58,26,0.18)',
                border: '1px solid rgba(139,105,20,0.2)',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5" style={{ color: 'rgba(201,169,97,0.5)' }}>
                अर्जुन उवाच
              </p>
              <p className="font-dev text-white/70" style={{ fontSize: 'clamp(12px, 2vw, 15px)', lineHeight: 1.7 }}>
                <TypeWriter
                  text="नष्टो मोहः स्मृतिर्लब्धा — मेरा भ्रम नष्ट हो गया है।"
                  speed={50}
                  startDelay={200}
                />
              </p>
            </div>

            {/* Krishna's reply */}
            <div
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                background: 'rgba(59,91,165,0.15)',
                border: '1px solid rgba(201,169,97,0.2)',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] mb-1.5" style={{ color: 'rgba(232,132,60,0.7)' }}>
                श्रीकृष्ण उवाच
              </p>
              <p className="font-dev text-white/80" style={{ fontSize: 'clamp(12px, 2vw, 15px)', lineHeight: 1.7 }}>
                <TypeWriter
                  text="उत्तिष्ठ — अर्जुन। तुम्हारा धर्म तुम्हारी प्रतीक्षा में है।"
                  speed={50}
                  startDelay={1800}
                />
              </p>
            </div>
          </div>
        )}

        {/* Verse */}
        {vis('verse') && (
          <div
            style={{
              opacity: vis('verse') ? 1 : 0,
              transition: 'opacity 0.8s ease',
              maxWidth: 'clamp(260px, 52vw, 480px)',
              width: '100%',
              textAlign: 'center',
              marginBottom: 'clamp(12px, 3vh, 28px)',
            }}
          >
            <div
              className="rounded-2xl px-5 py-4"
              style={{
                background: 'rgba(201,169,97,0.05)',
                border: '1px solid rgba(201,169,97,0.18)',
              }}
            >
              <p
                className="font-dev mb-2"
                style={{
                  fontSize: 'clamp(14px, 2.4vw, 18px)',
                  background: 'linear-gradient(135deg, #E8843C, #C9A961)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 2,
                }}
              >
                <TypeWriter
                  text="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
                  speed={45}
                  startDelay={200}
                />
              </p>
              <p
                className="font-verse italic text-white/50"
                style={{
                  fontSize: 'clamp(11px, 1.8vw, 14px)',
                  opacity: vis('ready') ? 0.7 : 0,
                  transition: 'opacity 1s ease',
                }}
              >
                "You have a right to perform your duty — never to its fruits."
              </p>
              <p
                className="text-[10px] uppercase tracking-widest mt-2"
                style={{
                  color: 'rgba(201,169,97,0.35)',
                  opacity: vis('ready') ? 1 : 0,
                  transition: 'opacity 1s ease 0.3s',
                }}
              >
                Bhagavad Gita · 2.47
              </p>
            </div>
          </div>
        )}

        {/* Begin button */}
        <div
          style={{
            opacity: vis('ready') ? 1 : 0,
            transform: vis('ready') ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            pointerEvents: vis('ready') ? 'auto' : 'none',
          }}
        >
          <button
            onClick={handleBegin}
            className="relative font-semibold transition-all active:scale-95"
            style={{
              padding: 'clamp(12px, 2vh, 16px) clamp(28px, 5vw, 48px)',
              borderRadius: 16,
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              background: 'linear-gradient(135deg, #E8843C 0%, #C9A961 100%)',
              color: '#1a1a2e',
              boxShadow: '0 0 32px rgba(232,132,60,0.35), 0 0 64px rgba(232,132,60,0.15)',
              animation: 'breath-pulse 3s ease-in-out infinite',
            }}
          >
            Begin Practice
          </button>
          <p
            className="text-center mt-3 text-white/25"
            style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', letterSpacing: '0.2em' }}
          >
            TAP ANYWHERE TO SKIP
          </p>
        </div>
      </div>

      {/* ── Temple doors ─────────────────────────────────────────── */}
      {/* Left door */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '50%', height: '100%',
          background: 'linear-gradient(135deg, #06071a 0%, #0d1030 100%)',
          borderRight: '1px solid rgba(201,169,97,0.3)',
          zIndex: 50,
          transform: closing ? 'translateX(0)' : 'translateX(-100%)',
          transition: closing ? 'transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 24,
        }}
      >
        {/* Door ornament */}
        <div style={{ opacity: 0.2 }}>
          <svg viewBox="0 0 60 160" width="40" height="110">
            <rect x="4" y="4" width="52" height="152" rx="6" fill="none" stroke="#C9A961" strokeWidth="1.5"/>
            <rect x="10" y="10" width="40" height="140" rx="4" fill="none" stroke="#C9A961" strokeWidth="0.8"/>
            <circle cx="30" cy="80" r="12" fill="none" stroke="#C9A961" strokeWidth="1"/>
            <path d="M30 62 L30 58 M30 98 L30 102 M18 80 L14 80 M42 80 L46 80"
              stroke="#C9A961" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="30" cy="80" r="4" fill="#C9A961" opacity="0.4"/>
            <path d="M20 30 Q30 24 40 30 M20 130 Q30 136 40 130"
              stroke="#C9A961" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Right door */}
      <div
        style={{
          position: 'fixed',
          top: 0, right: 0,
          width: '50%', height: '100%',
          background: 'linear-gradient(225deg, #06071a 0%, #0d1030 100%)',
          borderLeft: '1px solid rgba(201,169,97,0.3)',
          zIndex: 50,
          transform: closing ? 'translateX(0)' : 'translateX(100%)',
          transition: closing ? 'transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 24,
        }}
      >
        <div style={{ opacity: 0.2 }}>
          <svg viewBox="0 0 60 160" width="40" height="110">
            <rect x="4" y="4" width="52" height="152" rx="6" fill="none" stroke="#C9A961" strokeWidth="1.5"/>
            <rect x="10" y="10" width="40" height="140" rx="4" fill="none" stroke="#C9A961" strokeWidth="0.8"/>
            <circle cx="30" cy="80" r="12" fill="none" stroke="#C9A961" strokeWidth="1"/>
            <path d="M30 62 L30 58 M30 98 L30 102 M18 80 L14 80 M42 80 L46 80"
              stroke="#C9A961" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="30" cy="80" r="4" fill="#C9A961" opacity="0.4"/>
            <path d="M20 30 Q30 24 40 30 M20 130 Q30 136 40 130"
              stroke="#C9A961" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      </div>

      {/* OM flash on door close */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: closing ? 1 : 0,
          transition: closing ? 'opacity 0.3s ease 0.4s' : 'none',
        }}
      >
        <span
          className="font-dev"
          style={{
            fontSize: 'clamp(48px, 10vw, 80px)',
            background: 'linear-gradient(135deg, #E8843C, #C9A961)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ॐ
        </span>
      </div>
    </div>
  );
}
