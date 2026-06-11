import { useState, useMemo } from 'react';
import { Search, BookOpen, TrendingUp, ChevronRight, Flame } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { getWeekKey, formatDateDisplay, getMonthLabel } from '../utils/dateUtils';

// ─── Mood definitions ────────────────────────────────────────────────────────
const MOODS = [
  { id: 'expansive', label: 'Expansive', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60' },
  { id: 'grateful',  label: 'Grateful',  cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60' },
  { id: 'clear',     label: 'Clear',     cls: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60' },
  { id: 'restless',  label: 'Restless',  cls: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/60' },
  { id: 'stuck',     label: 'Stuck',     cls: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/60' },
  { id: 'confused',  label: 'Confused',  cls: 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800/50 dark:text-stone-400 dark:border-stone-700' },
];

function MoodPill({ id, small = false }) {
  const m = MOODS.find(x => x.id === id);
  if (!m) return null;
  return (
    <span className={`inline-flex items-center border font-semibold rounded-full ${
      small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
    } ${m.cls}`}>
      {m.label}
    </span>
  );
}

// ─── Entry card ──────────────────────────────────────────────────────────────
function EntryCard({ entry, onClick, isSelected = false, isCurrentWeek = false }) {
  const date    = formatDateDisplay(new Date(entry.weekStart));
  const preview = entry.problem || entry.curiosity || '';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
        isSelected
          ? 'bg-[#2D3561]/7 dark:bg-white/8 border-[#2D3561]/22 dark:border-white/14'
          : 'bg-white/55 dark:bg-white/3 border-black/5 dark:border-white/6 hover:border-[#E8843C]/35 hover:bg-white/80 dark:hover:bg-white/6'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <div className="text-[10px] text-stone-400 mb-0.5">{getMonthLabel(entry.weekStart)}</div>
          <div className={`text-sm font-semibold truncate ${
            isSelected ? 'text-[#2D3561] dark:text-white' : 'text-[#1a1a2e] dark:text-white'
          }`}>
            {isCurrentWeek ? 'This Week' : `Week of ${date.short}`}
          </div>
        </div>
        {entry.mood && <MoodPill id={entry.mood} small />}
      </div>
      {preview
        ? <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">{preview}</p>
        : <p className="text-xs text-stone-300 dark:text-stone-600 italic">No reflection yet</p>
      }
    </button>
  );
}

// ─── Editor ──────────────────────────────────────────────────────────────────
function Editor({ entry, onSave, onBack }) {
  const [problem,   setProblem]   = useState(entry.problem   || '');
  const [curiosity, setCuriosity] = useState(entry.curiosity || '');
  const [mood,      setMood]      = useState(entry.mood      || '');

  const isCurrentWeek = entry.weekStart === getWeekKey(new Date());
  const date          = formatDateDisplay(new Date(entry.weekStart));

  function wc(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
  const totalWords = wc(problem + ' ' + curiosity);

  const ta = [
    'w-full bg-white dark:bg-white/5',
    'border border-black/8 dark:border-white/10',
    'rounded-2xl px-4 py-3',
    'text-sm text-[#1a1a2e] dark:text-white',
    'placeholder-stone-300 dark:placeholder-stone-600',
    'outline-none focus:border-[#E8843C] transition-colors',
    'resize-none font-verse leading-relaxed',
  ].join(' ');

  return (
    <div className="page-transition">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-5"
        >
          <ChevronRight size={15} className="rotate-180" />
          Back to Journal
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-stone-400 mb-0.5">{date.full}</p>
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white">
            {isCurrentWeek ? "This Week's Reflection" : `Week of ${date.short}`}
          </h2>
        </div>
        {totalWords > 0 && (
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-xl font-bold tabular-nums text-[#1a1a2e] dark:text-white">{totalWords}</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">words</div>
          </div>
        )}
      </div>

      {/* Mood */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2.5">State of mind</p>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(mood === m.id ? '' : m.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                mood === m.id
                  ? m.cls
                  : 'bg-transparent border-black/8 dark:border-white/10 text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8843C] flex-shrink-0" />
              <span className="text-sm font-semibold text-[#1a1a2e] dark:text-white">A problem I noticed</span>
            </div>
            {problem && <span className="text-[10px] text-stone-300 dark:text-stone-600">{wc(problem)} words</span>}
          </div>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="What kept coming up for you this week? A recurring tension, an avoidance, a friction…"
            rows={5}
            className={ta}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5A8A8A] flex-shrink-0" />
              <span className="text-sm font-semibold text-[#1a1a2e] dark:text-white">A curiosity I explored</span>
            </div>
            {curiosity && <span className="text-[10px] text-stone-300 dark:text-stone-600">{wc(curiosity)} words</span>}
          </div>
          <textarea
            value={curiosity}
            onChange={e => setCuriosity(e.target.value)}
            placeholder="What drew your attention? What are you thinking about, reading about, wondering about?"
            rows={5}
            className={ta}
          />
        </div>

        <button
          onClick={() => onSave({ ...entry, problem, curiosity, mood })}
          className="w-full py-3.5 rounded-2xl text-white font-semibold transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #2D3561, #5B6BAF)' }}
        >
          Save Reflection
        </button>
      </div>
    </div>
  );
}

// ─── Pattern Review ───────────────────────────────────────────────────────────
function PatternReview({ entries, onBack }) {
  const problems    = entries.filter(e => e.problem);
  const curiosities = entries.filter(e => e.curiosity);
  const moodCounts  = entries.reduce((acc, e) => {
    if (e.mood) acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page-transition">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-5"
        >
          <ChevronRight size={15} className="rotate-180" />
          Back
        </button>
      )}

      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white">Pattern Review</h2>
        <p className="text-sm text-stone-400">{entries.length} weeks of reflection</p>
      </div>

      {/* Mood overview */}
      {topMoods.length > 0 && (
        <div className="card mb-5">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Your state of mind</p>
          <div className="flex flex-wrap gap-2">
            {topMoods.map(([id, count]) => (
              <div key={id} className="flex items-center gap-1.5">
                <MoodPill id={id} />
                <span className="text-xs text-stone-400">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="p-4 rounded-2xl mb-5"
        style={{ background: 'rgba(45,53,97,0.05)', border: '1px solid rgba(45,53,97,0.1)' }}>
        <p className="font-verse text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
          "The overlap between your recurring problems and your deepest curiosities
          often points to the thing you are meant to do."
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E8843C]" />
            <span className="text-sm font-semibold text-[#1a1a2e] dark:text-white">Problems</span>
            <span className="text-xs text-stone-400">({problems.length})</span>
          </div>
          <div className="space-y-2">
            {problems.map(e => (
              <div key={e.id} className="bg-white/60 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/6">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] text-stone-400">{getMonthLabel(e.weekStart)}</span>
                  {e.mood && <MoodPill id={e.mood} small />}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{e.problem}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#5A8A8A]" />
            <span className="text-sm font-semibold text-[#1a1a2e] dark:text-white">Curiosities</span>
            <span className="text-xs text-stone-400">({curiosities.length})</span>
          </div>
          <div className="space-y-2">
            {curiosities.map(e => (
              <div key={e.id} className="bg-white/60 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/6">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] text-stone-400">{getMonthLabel(e.weekStart)}</span>
                  {e.mood && <MoodPill id={e.mood} small />}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{e.curiosity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Manan() {
  const { state, addNotebookEntry } = useStorage();
  const { notebook } = state;

  const [search,         setSearch]         = useState('');
  const [mobileView,     setMobileView]     = useState('list'); // 'list' | 'editor' | 'pattern'
  const [mobileEntry,    setMobileEntry]    = useState(null);
  const [desktopEntry,   setDesktopEntry]   = useState(null);   // null = current week; 'pattern' = pattern view; entry object = past entry

  const currentWeekKey = getWeekKey(new Date());
  const currentWeekEntry = notebook.find(e => e.weekStart === currentWeekKey) || {
    id: `week-${currentWeekKey}`, weekStart: currentWeekKey, problem: '', curiosity: '', mood: '',
  };

  // Streak: consecutive weeks with at least one field filled
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 52; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i * 7);
      const key = getWeekKey(d);
      const e   = notebook.find(n => n.weekStart === key);
      if (i === 0) { count++; continue; }
      if (e && (e.problem || e.curiosity)) count++;
      else break;
    }
    return count;
  }, [notebook]);

  const pastEntries = useMemo(
    () => notebook.filter(e => e.weekStart !== currentWeekKey),
    [notebook, currentWeekKey],
  );

  const filteredPast = useMemo(() => {
    if (!search) return pastEntries;
    const q = search.toLowerCase();
    return pastEntries.filter(e =>
      (e.problem   && e.problem.toLowerCase().includes(q)) ||
      (e.curiosity && e.curiosity.toLowerCase().includes(q)),
    );
  }, [pastEntries, search]);

  const grouped = useMemo(() => {
    const out = {};
    for (const entry of filteredPast) {
      const k = getMonthLabel(entry.weekStart);
      if (!out[k]) out[k] = [];
      out[k].push(entry);
    }
    return out;
  }, [filteredPast]);

  function handleSave(updated) {
    addNotebookEntry(updated);
    setMobileView('list');
    // On desktop, keep showing the saved entry
    setDesktopEntry(updated.weekStart === currentWeekKey ? null : updated);
  }

  const hasWrittenThisWeek = !!(currentWeekEntry.problem || currentWeekEntry.curiosity);
  const desktopActiveEntry = (desktopEntry && desktopEntry !== 'pattern')
    ? desktopEntry
    : currentWeekEntry;

  // ─── Search input (shared) ──────────────────────────────────────────────────
  function SearchInput({ compact }) {
    return (
      <div className="relative">
        <Search size={compact ? 12 : 13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reflections…"
          className={`w-full ${compact ? 'pl-8 pr-3 py-2 text-xs' : 'pl-9 pr-4 py-2.5 text-sm'} text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-xl outline-none focus:border-[#E8843C] transition-colors`}
        />
      </div>
    );
  }

  // ─── Stats strip (shared) ───────────────────────────────────────────────────
  function StatsRow({ compact }) {
    return (
      <div className={`flex gap-2 ${compact ? '' : 'mb-5'}`}>
        <div className={`flex-1 rounded-xl border text-center ${compact ? 'px-2 py-2' : 'px-3 py-2.5'} bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/8`}>
          <div className={`font-bold text-[#1a1a2e] dark:text-white ${compact ? 'text-base' : 'text-lg'}`}>{notebook.length}</div>
          <div className="text-[10px] text-stone-400">entries</div>
        </div>
        <div className={`flex-1 rounded-xl border text-center ${compact ? 'px-2 py-2' : 'px-3 py-2.5'} bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/8`}>
          <div className={`font-bold text-[#E8843C] ${compact ? 'text-base' : 'text-lg'}`}>{streak}</div>
          <div className="text-[10px] text-stone-400">wk streak</div>
        </div>
        <div className={`flex-1 rounded-xl border text-center ${compact ? 'px-2 py-2' : 'px-3 py-2.5'} ${
          hasWrittenThisWeek
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
            : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/8'
        }`}>
          <div className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${hasWrittenThisWeek ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`}>
            {hasWrittenThisWeek ? '✓' : '·'}
          </div>
          <div className="text-[10px] text-stone-400">this week</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          MOBILE  (hidden on lg+)
      ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {mobileView === 'pattern' ? (
          <div className="page-container page-transition">
            <PatternReview entries={notebook} onBack={() => setMobileView('list')} />
            <div className="h-8" />
          </div>
        ) : mobileView === 'editor' && mobileEntry ? (
          <div className="page-container page-transition">
            <Editor
              key={mobileEntry.id}
              entry={mobileEntry}
              onSave={handleSave}
              onBack={() => setMobileView('list')}
            />
            <div className="h-8" />
          </div>
        ) : (
          /* ── Mobile list ───────────────────────────────────── */
          <div className="page-container page-transition">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Journal</h1>
                <p className="text-sm text-stone-400">Weekly reflection</p>
              </div>
              {notebook.length >= 8 && (
                <button
                  onClick={() => setMobileView('pattern')}
                  className="text-xs px-3 py-2 rounded-xl font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#2D3561,#5B6BAF)' }}
                >
                  <TrendingUp size={12} />
                  Patterns
                </button>
              )}
            </div>

            <StatsRow compact={false} />

            {/* This week */}
            <div className="mb-1">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2.5">This Week</p>
              <button
                onClick={() => { setMobileEntry(currentWeekEntry); setMobileView('editor'); }}
                className="w-full card text-left transition-all hover:border-[#E8843C]/40"
                style={{ borderColor: 'rgba(232,132,60,0.18)' }}
              >
                {hasWrittenThisWeek ? (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <p className="text-xs text-stone-400">
                        {formatDateDisplay(new Date(currentWeekEntry.weekStart)).full}
                      </p>
                      {currentWeekEntry.mood && <MoodPill id={currentWeekEntry.mood} small />}
                    </div>
                    {currentWeekEntry.problem && (
                      <div className="mb-2">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Problem</p>
                        <p className="font-verse text-sm text-[#1a1a2e] dark:text-white line-clamp-2 leading-relaxed">
                          {currentWeekEntry.problem}
                        </p>
                      </div>
                    )}
                    {currentWeekEntry.curiosity && (
                      <div>
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Curiosity</p>
                        <p className="font-verse text-sm text-[#1a1a2e] dark:text-white line-clamp-2 leading-relaxed">
                          {currentWeekEntry.curiosity}
                        </p>
                      </div>
                    )}
                    <p className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs text-[#E8843C]">
                      Tap to edit →
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(45,53,97,0.08)' }}>
                      <BookOpen size={18} style={{ color: '#5B6BAF' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a2e] dark:text-white">Write this week's reflection</p>
                      <p className="text-xs text-stone-400 mt-0.5">What problem did you notice? What are you curious about?</p>
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* Past entries */}
            {pastEntries.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Past entries</p>
                  {search && (
                    <p className="text-[10px] text-stone-400">{filteredPast.length} result{filteredPast.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
                {pastEntries.length >= 3 && (
                  <div className="mb-4">
                    <SearchInput compact={false} />
                  </div>
                )}
                <div className="space-y-5">
                  {Object.entries(grouped).map(([month, entries]) => (
                    <div key={month}>
                      <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2.5">{month}</p>
                      <div className="space-y-2">
                        {entries.map(entry => (
                          <EntryCard
                            key={entry.id}
                            entry={entry}
                            onClick={() => { setMobileEntry(entry); setMobileView('editor'); }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notebook.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(45,53,97,0.07)' }}>
                  <BookOpen size={26} style={{ color: '#5B6BAF' }} />
                </div>
                <p className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-1">Start your journal</p>
                <p className="text-xs text-stone-400 font-verse italic leading-relaxed max-w-xs mx-auto">
                  One problem noticed. One curiosity explored. Every week.
                </p>
                <p className="text-xs text-stone-300 dark:text-stone-600 mt-3">
                  After 8 entries, Pattern Review unlocks.
                </p>
              </div>
            )}

            <div className="h-8" />
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP  (hidden below lg)
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex" style={{ minHeight: '100vh' }}>

        {/* ── Left sidebar ──────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col border-r border-black/6 dark:border-white/6 overflow-y-auto"
          style={{ width: '320px', position: 'sticky', top: 0, maxHeight: '100vh' }}
        >
          {/* Sidebar header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-0.5">
              <h1 className="text-lg font-bold text-[#1a1a2e] dark:text-white">Journal</h1>
              {notebook.length >= 8 && (
                <button
                  onClick={() => setDesktopEntry('pattern')}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                    desktopEntry === 'pattern'
                      ? 'bg-[#2D3561] text-white'
                      : 'text-[#2D3561] dark:text-[#5B6BAF] bg-[#2D3561]/8 dark:bg-white/6 hover:bg-[#2D3561]/14'
                  }`}
                >
                  <TrendingUp size={11} />
                  Patterns
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400 mb-4">Weekly reflection</p>

            <StatsRow compact={true} />
          </div>

          {/* This week entry */}
          <div className="px-4 mb-1">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2 px-0.5">This Week</p>
            <EntryCard
              entry={currentWeekEntry}
              onClick={() => setDesktopEntry(null)}
              isSelected={desktopEntry === null}
              isCurrentWeek
            />
          </div>

          {/* Past entries */}
          {pastEntries.length > 0 && (
            <div className="px-4 flex-1 pb-6 mt-3">
              {pastEntries.length >= 3 && (
                <div className="mb-3">
                  <SearchInput compact={true} />
                  {search && (
                    <p className="text-[10px] text-stone-400 mt-1.5 px-0.5">
                      {filteredPast.length} result{filteredPast.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-4">
                {Object.entries(grouped).map(([month, entries]) => (
                  <div key={month}>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2 px-0.5">{month}</p>
                    <div className="space-y-1.5">
                      {entries.map(entry => (
                        <EntryCard
                          key={entry.id}
                          entry={entry}
                          onClick={() => setDesktopEntry(entry)}
                          isSelected={desktopEntry?.id === entry.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notebook.length === 0 && (
            <div className="px-5 py-4 text-center">
              <p className="text-xs text-stone-400 font-verse italic leading-relaxed">
                One problem noticed. One curiosity explored. Every week.
              </p>
              <p className="text-[10px] text-stone-300 dark:text-stone-600 mt-2">
                After 8 entries, Patterns unlocks.
              </p>
            </div>
          )}
        </div>

        {/* ── Right main panel ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl px-10 xl:px-14 py-8 mx-auto">
            {desktopEntry === 'pattern' ? (
              <PatternReview entries={notebook} onBack={null} />
            ) : (
              <Editor
                key={desktopActiveEntry.id}
                entry={desktopActiveEntry}
                onSave={handleSave}
                onBack={null}
              />
            )}
          </div>
        </div>

      </div>
    </>
  );
}
