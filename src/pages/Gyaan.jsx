import { useState, useMemo } from 'react';
import { Search, Bookmark, BookmarkCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import chapters from '../data/chapters.json';
import shlokas from '../data/shlokas.json';
import VerseCard from '../components/VerseCard';

function ChapterCard({ chapter, isRead, onMarkRead, bookmarks, onToggleBookmark }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`card transition-all duration-200 ${isRead ? 'border-[#C9A961]/30' : ''}`}>
      <button
        className="w-full flex items-start gap-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-dev font-bold text-lg"
          style={{ background: isRead ? 'linear-gradient(135deg, #C9A961, #E8843C)' : 'rgba(45,53,97,0.08)', color: isRead ? 'white' : '#2D3561' }}
        >
          {chapter.devanagari}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-dev text-sm font-semibold text-[#1a1a2e] dark:text-white leading-snug">
                {chapter.sanskrit_name}
              </div>
              <div className="text-xs text-stone-400">{chapter.english_name}</div>
            </div>
            {isRead && <CheckCircle2 size={16} className="flex-shrink-0 text-[#C9A961] mt-0.5" />}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
            {chapter.essence}
          </p>
        </div>
        <div className="text-stone-300 flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 animate-slide-up">
          <p className="font-verse text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {chapter.essence}
          </p>

          <div>
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Key Shlokas</div>
            <div className="space-y-3">
              {chapter.key_shlokas.map((ks) => {
                const full = shlokas.find((s) => `${s.chapter}.${s.verse}` === ks.verse);
                return (
                  <div key={ks.verse} className="rounded-xl border border-stone-100 dark:border-white/10 p-3">
                    <div className="verse-sanskrit text-sm mb-2">{ks.sanskrit}</div>
                    <div className="font-verse italic text-xs text-stone-400">{ks.english}</div>
                    {full && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark(full.id); }}
                        className="mt-2 flex items-center gap-1 text-[11px]"
                        style={{ color: bookmarks.includes(full.id) ? '#C9A961' : '#9CA3AF' }}
                      >
                        {bookmarks.includes(full.id) ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                        {bookmarks.includes(full.id) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(232,132,60,0.05)', border: '1px solid rgba(232,132,60,0.15)' }}>
            <div className="text-[10px] font-semibold text-[#E8843C] uppercase tracking-widest mb-1.5">Reflection</div>
            <p className="font-verse italic text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {chapter.reflection}
            </p>
          </div>

          {!isRead && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(chapter.number); }}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: '#2D3561', border: '1px solid rgba(45,53,97,0.2)' }}
            >
              Mark as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AskKrishna({ bookmarks, allShlokas }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const bookmarkedShlokas = allShlokas.filter((s) => bookmarks.includes(s.id));
  const pool = bookmarkedShlokas.length >= 5 ? bookmarkedShlokas : allShlokas;

  function search(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const keywords = q.split(/\s+/);

    const scored = pool.map((s) => {
      let score = 0;
      const text = `${s.english} ${s.hindi} ${s.theme} ${s.arjuna_struggle || ''} ${s.krishna_answer || ''}`.toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw)) score += 2;
        if ((s.theme || '').toLowerCase().includes(kw)) score += 3;
      }
      return { shloka: s, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0];
    setResult(top && top.score > 0 ? top.shloka : pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div className="card dark:bg-white/3" style={{ background: 'rgba(45,53,97,0.04)', border: '1px solid rgba(45,53,97,0.12)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-[#E8843C]" />
        <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">Ask Krishna</div>
      </div>
      <form onSubmit={search} className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What struggles you today?"
          className="flex-1 text-sm text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/10 border border-black/8 dark:border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#E8843C] transition-colors font-verse"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #2D3561, #5B6BAF)' }}
        >
          <Search size={16} />
        </button>
      </form>
      {result && (
        <div className="animate-slide-up">
          <VerseCard shloka={result} compact />
        </div>
      )}
    </div>
  );
}

export default function Gyaan() {
  const { state, toggleBookmark, markChapterRead } = useStorage();
  const { bookmarks, chapterProgress } = state;
  const [tab, setTab] = useState('chapters');
  const [search, setSearch] = useState('');

  const bookmarkedShlokas = useMemo(
    () => shlokas.filter((s) => bookmarks.includes(s.id)),
    [bookmarks]
  );

  const filteredChapters = useMemo(() => {
    if (!search) return chapters;
    const q = search.toLowerCase();
    return chapters.filter(
      (c) =>
        c.english_name.toLowerCase().includes(q) ||
        c.sanskrit_name.toLowerCase().includes(q) ||
        c.essence.toLowerCase().includes(q)
    );
  }, [search]);

  const progress = Math.round((chapterProgress.length / 18) * 100);

  return (
    <div className="page-container page-transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Wisdom</h1>
          <div className="text-sm text-stone-400">Gita · 18 Chapters</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-stone-400">{chapterProgress.length}/18 read</div>
          <div className="w-20 h-1.5 rounded-full bg-stone-100 dark:bg-white/10 mt-1">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: '#C9A961' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1 mb-5" style={{ background: 'rgba(0,0,0,0.05)' }}>
        {[
          { id: 'chapters', label: '18 Chapters' },
          { id: 'bookmarks', label: `My Shlokas${bookmarks.length > 0 ? ` (${bookmarks.length})` : ''}` },
          { id: 'ask', label: 'Ask Krishna' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === t.id
                ? 'bg-white dark:bg-[#2D3561] text-[#1a1a2e] dark:text-white shadow-sm'
                : 'text-stone-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chapters tab */}
      {tab === 'chapters' && (
        <>
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapters…"
              className="w-full pl-9 pr-4 py-2.5 text-sm text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-xl outline-none focus:border-[#E8843C] transition-colors"
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-3 gap-3">
            {filteredChapters.map((ch) => (
              <ChapterCard
                key={ch.number}
                chapter={ch}
                isRead={chapterProgress.includes(ch.number)}
                onMarkRead={markChapterRead}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        </>
      )}

      {/* Bookmarks tab */}
      {tab === 'bookmarks' && (
        <>
          {bookmarkedShlokas.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-3">🔖</div>
              <p className="text-sm text-stone-400">
                Tap the bookmark icon on any shloka to save it here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 md:gap-3 gap-3">
              {bookmarkedShlokas.map((s) => (
                <VerseCard
                  key={s.id}
                  shloka={s}
                  bookmarked
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Ask Krishna tab */}
      {tab === 'ask' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(45,53,97,0.05)', border: '1px solid rgba(45,53,97,0.10)' }}>
            <p className="font-verse italic text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              "Type a struggle, a question, or a state of mind.
              Krishna will answer from the Gita."
            </p>
            {bookmarks.length < 5 && (
              <p className="text-xs text-stone-400 mt-2">
                Bookmark at least 5 shlokas to draw from your personal collection.
                Until then, the full Gita answers.
              </p>
            )}
          </div>
          <AskKrishna bookmarks={bookmarks} allShlokas={shlokas} />
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
