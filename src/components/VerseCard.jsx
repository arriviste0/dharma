import { useState } from 'react';
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from 'lucide-react';

export default function VerseCard({ shloka, bookmarked = false, onToggleBookmark, compact = false }) {
  const [expanded, setExpanded] = useState(false);

  if (!shloka) return null;

  return (
    <div className="card" style={{ borderLeft: '3px solid rgba(201,169,97,0.4)' }}>
      {/* Sanskrit */}
      <div className="verse-sanskrit text-center leading-loose mb-3 px-2 text-sm">
        {shloka.sanskrit}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(201,169,97,0.12)', color: '#C9A961' }}
        >
          BG {shloka.chapter}.{shloka.verse}
        </span>
        <div className="flex items-center gap-1">
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(shloka.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: bookmarked ? '#C9A961' : '#D1D5DB' }}
            >
              {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* English translation — always visible */}
      {!compact && (
        <p className="font-verse italic text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          "{shloka.english}"
        </p>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-3 page-transition">
          {shloka.arjuna_struggle && (
            <>
              <div className="rounded-xl bg-black/3 dark:bg-white/4 p-3">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">Arjuna's question</p>
                <p className="font-verse italic text-sm text-stone-600 dark:text-stone-300">
                  "{shloka.arjuna_struggle}"
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(232,132,60,0.06)', border: '1px solid rgba(232,132,60,0.15)' }}>
                <p className="text-[10px] font-semibold text-[#E8843C] uppercase tracking-widest mb-1.5">Krishna's answer</p>
                <p className="font-verse text-sm text-[#1a1a2e] dark:text-stone-200 leading-relaxed">
                  {shloka.krishna_answer}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
