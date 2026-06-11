import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ChariotSVG from '../components/svgs/ChariotSVG';
import MandalaBg from '../components/svgs/MandalaBg';

const SCREENS = [
  {
    word: 'Abhyāsa',
    subtitle: 'Practice',
    devanagari: 'अभ्यास',
    body: 'The Gita doesn\'t ask for perfection. It asks for return. Every morning you show up is a victory over the part of you that chose comfort. Practice is not discipline through force — it is devotion through repetition.',
    verse: 'अभ्यासेन तु कौन्तेय — through practice, mastery.',
    verseRef: 'BG 6.35',
    bg: '#1e2240',
  },
  {
    word: 'Vairāgya',
    subtitle: 'Detachment',
    devanagari: 'वैराग्य',
    body: 'You are not tracking habits to earn a reward. You are not building streaks to show anyone. This practice is yours alone. What you did yesterday neither crowns you nor condemns you. Today is the battlefield.',
    verse: 'कर्मण्येवाधिकारस्ते — the action is yours, not the fruit.',
    verseRef: 'BG 2.47',
    bg: '#14192e',
  },
  {
    word: 'Svadharma',
    subtitle: 'Your Own Path',
    devanagari: 'स्वधर्म',
    body: 'The pillars in this app are starting points, not prescriptions. Add what belongs to your path. Remove what doesn\'t. A practice that looks exactly like someone else\'s is not yours — it is a costume.',
    verse: 'श्रेयान्स्वधर्मो विगुणः — your imperfect path is greater than another\'s perfect one.',
    verseRef: 'BG 3.35',
    bg: '#0d1020',
  },
];

export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(0);
  const navigate = useNavigate();
  const current = SCREENS[screen];

  function next() {
    if (screen < SCREENS.length - 1) {
      setScreen(screen + 1);
    } else {
      onComplete();
      navigate('/home');
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden"
      style={{ backgroundColor: current.bg }}
    >
      {/* Mandala */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MandalaBg size={520} color="#C9A961" opacity={0.04} className="mandala-breathe" />
      </div>

      {/* Chariot on first screen */}
      {screen === 0 && (
        <div className="absolute bottom-0 left-0 right-0 opacity-10 flex justify-center pointer-events-none">
          <ChariotSVG className="w-full max-w-sm" />
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1 px-7 pt-14 pb-12">
        {/* Progress */}
        <div className="flex justify-center gap-1.5 mb-14">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === screen ? 28 : 6,
                height: 6,
                backgroundColor: i === screen ? '#E8843C' : 'rgba(232,132,60,0.25)',
              }}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Sanskrit accent */}
          <div className="font-dev text-[#C9A961]/40 text-4xl mb-2 text-center tracking-wide">
            {current.devanagari}
          </div>

          {/* English word */}
          <h1 className="text-center mb-1">
            <span
              className="font-bold tracking-tight"
              style={{
                fontSize: 52,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #E8843C 0%, #C9A961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {current.word}
            </span>
          </h1>
          <p className="text-center text-[13px] tracking-[0.2em] uppercase text-white/30 mb-10">
            {current.subtitle}
          </p>

          {/* Body */}
          <p className="font-verse text-white/70 text-[16px] leading-8 text-center mb-8">
            {current.body}
          </p>

          {/* Verse chip */}
          <div className="flex justify-center">
            <div className="inline-flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border border-[#C9A961]/20 bg-[#C9A961]/5">
              <span className="font-dev text-[13px] text-[#C9A961]/70 leading-relaxed text-center">{current.verse}</span>
              <span className="text-[10px] text-white/25 tracking-widest uppercase">{current.verseRef}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mt-10">
          <span className="text-white/20 text-xs tracking-widest">{screen + 1} / {SCREENS.length}</span>
          <button
            onClick={next}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold text-sm text-[#1a1a2e] transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #E8843C 0%, #C9A961 100%)' }}
          >
            {screen < SCREENS.length - 1 ? (
              <>Next <ArrowRight size={16} /></>
            ) : (
              <>Begin practice <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
