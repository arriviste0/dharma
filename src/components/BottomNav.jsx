import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, BookOpen, BarChart2, BookMarked, Settings, Timer } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { DEFAULT_PILLARS } from '../data/defaultPillars';
import { getTodayCompletedCount, getCurrentStreak } from '../utils/streakUtils';
import { formatDateDisplay, todayKey } from '../utils/dateUtils';

const NAV_ITEMS = [
  { path: '/home',    label: 'Today',     Icon: Home },
  { path: '/sadhana', label: 'Pillars',   Icon: Layers },
  { path: '/manan',   label: 'Journal',   Icon: BookOpen },
  { path: '/drishti', label: 'Dashboard', Icon: BarChart2 },
  { path: '/gyaan',   label: 'Wisdom',    Icon: BookMarked },
];

/* ── Mobile bottom bar ──────────────────────────────────────────────────────── */
export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass-nav safe-bottom z-50 lg:hidden">
      <div className="flex items-stretch px-2">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <NavLink
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all duration-200 relative"
            >
              {isActive && (
                <span
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: '#E8843C' }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.6}
                style={{ color: isActive ? '#E8843C' : '#9CA3AF', transition: 'color 0.2s' }}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: isActive ? '#E8843C' : '#9CA3AF' }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Desktop side nav ───────────────────────────────────────────────────────── */
export function SideNav() {
  const location  = useLocation();
  const { state } = useStorage();
  const pillars   = state.pillars || DEFAULT_PILLARS;
  const { logs, settings } = state;

  const { done, total } = getTodayCompletedCount(logs, pillars);
  const streak          = getCurrentStreak(logs, pillars);
  const dateInfo        = formatDateDisplay(new Date());
  const today           = todayKey();
  const completion      = total > 0 ? done / total : 0;
  const pct             = Math.round(completion * 100);

  return (
    <nav className="hidden lg:flex flex-col w-60 min-h-screen bg-white dark:bg-[#0a0a16] border-r border-black/5 dark:border-white/5 px-3 py-8 sticky top-0 shrink-0">
      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-dev text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #2D3561, #5B6BAF)', color: '#C9A961' }}
          >
            ॐ
          </div>
          <div>
            <div className="font-bold text-sm text-[#1a1a2e] dark:text-white">Dharma</div>
            <div className="text-[11px] text-stone-400">Private Practice</div>
          </div>
        </div>
      </div>

      {/* Today's status card */}
      <div className="mx-0 mb-5 px-3 py-3 rounded-2xl" style={{ background: 'rgba(232,132,60,0.07)' }}>
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
          {dateInfo.dayEn.slice(0, 3)} · {dateInfo.short}
        </div>
        {/* Mini progress bar */}
        <div className="h-1.5 rounded-full bg-black/6 dark:bg-white/8 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 80 ? '#C9A961' : '#E8843C',
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400">{done}/{total} done</span>
          {!settings.silentMode && streak > 0 && (
            <span className="text-xs font-bold" style={{ color: '#E8843C' }}>
              🔥 {streak}d
            </span>
          )}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-[#E8843C]'
                  : 'text-stone-500 dark:text-stone-400 hover:text-[#1a1a2e] dark:hover:text-white'
              }`}
              style={isActive ? { background: 'rgba(232,132,60,0.1)' } : {}}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.7} />
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8843C' }} />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom: Settings */}
      <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-4">
        <NavLink
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            location.pathname === '/settings'
              ? 'text-[#E8843C] bg-[#E8843C]/10'
              : 'text-stone-400 hover:text-[#1a1a2e] dark:hover:text-white'
          }`}
        >
          <Settings size={17} strokeWidth={1.7} />
          Settings
        </NavLink>
      </div>
    </nav>
  );
}
