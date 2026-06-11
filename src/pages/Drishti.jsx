import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts';
import { useStorage } from '../hooks/useStorage';
import { DEFAULT_PILLARS } from '../data/defaultPillars';
import {
  getLast90Days, getLast8Weeks, dateKey,
} from '../utils/dateUtils';
import {
  getCurrentStreak, getBestStreak, getPillarStreak,
  getDayCompletionRate, getTargetSuccessRate,
  getPhilosophicalInsight,
} from '../utils/streakUtils';
import BowArrowSVG from '../components/svgs/BowArrowSVG';
import ChakraSVG from '../components/svgs/ChakraSVG';

/* ── Shared stat card ─────────────────────────────────────────────── */
function StatCard({ value, label, sublabel, color = '#E8843C', icon = null }) {
  return (
    <div className="card flex flex-col items-center text-center py-5">
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-3xl font-bold mb-0.5 tabular-nums" style={{ color }}>{value}</div>
      <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">{label}</div>
      {sublabel && <div className="text-[11px] text-stone-400 mt-0.5">{sublabel}</div>}
    </div>
  );
}

/* ── Heatmap cell ─────────────────────────────────────────────────── */
function HeatmapCell({ date, completion }) {
  const opacity = completion === 0 ? 0.09 : 0.2 + completion * 0.8;
  const color =
    completion >= 0.8 ? '#C9A961' :
    completion >= 0.5 ? '#E8843C' :
    completion > 0    ? '#5A8A8A' :
    '#D1C8B8';

  const d     = new Date(date);
  const day   = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });

  return (
    <div
      className="heatmap-cell aspect-square rounded-sm"
      style={{ backgroundColor: color, opacity }}
      title={`${day} ${month}: ${Math.round(completion * 100)}%`}
    />
  );
}

/* ── Chart tooltip ────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#0F1429] border border-stone-100 dark:border-white/10 rounded-xl px-3 py-2 shadow-lg text-xs">
      <div className="text-stone-400 mb-0.5">{label}</div>
      <div className="font-semibold text-[#1a1a2e] dark:text-white">
        {typeof payload[0].value === 'number' && payload[0].value <= 1
          ? `${Math.round(payload[0].value * 100)}%`
          : payload[0].value}
      </div>
    </div>
  );
};

const NumericTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#0F1429] border border-stone-100 dark:border-white/10 rounded-xl px-3 py-2 shadow-lg text-xs">
      <div className="text-stone-400 mb-0.5">{label}</div>
      <div className="font-semibold text-[#1a1a2e] dark:text-white">{payload[0].value}</div>
    </div>
  );
};

/* ── Main page ────────────────────────────────────────────────────── */
export default function Drishti() {
  const { state } = useStorage();
  const pillars = state.pillars || DEFAULT_PILLARS;
  const { logs, settings, focusLog = [] } = state;

  const currentStreak  = useMemo(() => getCurrentStreak(logs, pillars), [logs, pillars]);
  const bestStreak     = useMemo(() => getBestStreak(logs, pillars), [logs, pillars]);
  const last90         = useMemo(() => getLast90Days(), []);
  const last8Weeks     = useMemo(() => getLast8Weeks(), []);

  /* Total days ever logged */
  const totalActiveDays = useMemo(() => {
    return Object.keys(logs).filter((d) => {
      const dayLog = logs[d] || {};
      return Object.values(dayLog).some((e) => e?.done);
    }).length;
  }, [logs]);

  /* This-week average */
  const thisWeekAvg = useMemo(() => {
    const thisWeek = last8Weeks.slice(-1)[0];
    if (!thisWeek) return 0;
    let total = 0, count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(thisWeek.key);
      d.setDate(d.getDate() + i);
      const dk = dateKey(d);
      if (dk <= dateKey(new Date())) { total += getDayCompletionRate(logs, pillars, dk); count++; }
    }
    return count > 0 ? Math.round((total / count) * 100) : 0;
  }, [logs, pillars, last8Weeks]);

  /* Total focus minutes this week */
  const focusMinsThisWeek = useMemo(() => {
    const thisWeekKey = last8Weeks.slice(-1)[0]?.key;
    if (!thisWeekKey) return 0;
    return focusLog
      .filter((s) => s.date >= thisWeekKey)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  }, [focusLog, last8Weeks]);

  const heatmapData = useMemo(() =>
    last90.map((d) => ({ date: d, completion: getDayCompletionRate(logs, pillars, d) })),
    [logs, pillars, last90]
  );

  const weeklyData = useMemo(() =>
    last8Weeks.map(({ key, label }) => {
      let total = 0, count = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(key); d.setDate(d.getDate() + i);
        const dk = dateKey(d);
        if (dk <= dateKey(new Date())) { total += getDayCompletionRate(logs, pillars, dk); count++; }
      }
      return { label, value: count > 0 ? total / count : 0 };
    }),
    [logs, pillars, last8Weeks]
  );

  const pillarInsights = useMemo(() => {
    return pillars.map((p) => {
      const streak   = getPillarStreak(logs, p);
      const thisWeek = getLast8Weeks().slice(-1)[0];
      const prevWeek = getLast8Weeks().slice(-2)[0];
      const rate = (wk) => {
        let total = 0, count = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date(wk.key); d.setDate(d.getDate() + i);
          const dk = dateKey(d);
          const dayLog = logs[dk] || {};
          const targets = p.targets.filter(t => t.frequency === 'daily' || !t.frequency);
          if (targets.length > 0) {
            total += targets.filter(t => dayLog[t.id]?.done).length / targets.length;
            count++;
          }
        }
        return count > 0 ? total / count : 0;
      };
      return { pillar: p, streak, currentRate: rate(thisWeek), prevRate: rate(prevWeek) };
    });
  }, [logs, pillars, last8Weeks]);

  const targetRates = useMemo(() =>
    pillars.flatMap((p) =>
      p.targets.filter((t) => t.frequency === 'daily' || !t.frequency).map((t) => ({
        target: t, pillar: p, rate: getTargetSuccessRate(logs, t.id, 30),
      }))
    ).sort((a, b) => b.rate - a.rate),
    [logs, pillars]
  );

  /* Numeric target trends (last 30 days) */
  const numericTrends = useMemo(() => {
    const results = [];
    for (const p of pillars) {
      for (const t of p.targets) {
        if (t.type !== 'NUMBER') continue;
        const data = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today); d.setDate(today.getDate() - i);
          const dk = dateKey(d);
          const entry = logs[dk]?.[t.id];
          if (entry?.value !== undefined && entry.value !== null) {
            data.push({
              day: dk.slice(5).replace('-', '/'),
              value: typeof entry.value === 'number' ? entry.value : parseFloat(entry.value) || 0,
            });
          }
        }
        if (data.length >= 2) {
          results.push({ target: t, pillar: p, data });
        }
      }
    }
    return results;
  }, [logs, pillars]);

  return (
    <div className="page-container page-transition">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Dashboard</h1>
          <div className="text-sm text-stone-400">Your practice at a glance</div>
        </div>
        <div className="opacity-40">
          <ChakraSVG size={40} color="#C9A961" rotating />
        </div>
      </div>

      {/* ── Desktop 2-column layout ────────────────────────────── */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">

        {/* ── LEFT column ────────────────────────────────────────── */}
        <div>
          {/* 4-stat row — 2×2 within the left col on desktop */}
          {!settings.silentMode && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard value={currentStreak} label="Streak" sublabel="days active" color="#E8843C" icon={<BowArrowSVG size={22} />} />
              <StatCard value={bestStreak}    label="Best"   sublabel="personal record" color="#C9A961" />
              <StatCard value={totalActiveDays} label="Total days" sublabel="ever logged" color="#5B6BAF" />
              <StatCard
                value={focusMinsThisWeek > 0 ? `${focusMinsThisWeek}m` : `${thisWeekAvg}%`}
                label={focusMinsThisWeek > 0 ? 'Focus' : 'This week'}
                sublabel={focusMinsThisWeek > 0 ? 'focused this week' : 'avg completion'}
                color="#5A8A8A"
              />
            </div>
          )}

          {/* Weekly progress bars */}
          <div className="card mb-4">
            <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-4">Weekly Progress</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyData} barCategoryGap="30%">
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent', stroke: 'none' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#E8843C" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-pillar streaks */}
          {!settings.silentMode && (
            <div className="card mb-4">
              <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3">By Pillar</div>
              <div className="space-y-2.5">
                {pillars.map((p) => {
                  const str = getPillarStreak(logs, p);
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <div className="text-sm text-[#1a1a2e] dark:text-white flex-1 min-w-0 truncate">{p.english}</div>
                      <div className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: p.color }}>{str}d</div>
                      <div className="w-20 h-1.5 rounded-full bg-stone-100 dark:bg-white/10 flex-shrink-0">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(str / 30 * 100, 100)}%`, backgroundColor: p.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Per-pillar weekly bars */}
          <div className="grid grid-cols-1 gap-4">
            {pillars.map((p) => {
              const data = last8Weeks.map(({ label, key }) => {
                let total = 0, count = 0;
                for (let i = 0; i < 7; i++) {
                  const d = new Date(key); d.setDate(d.getDate() + i);
                  const dk = dateKey(d);
                  const dayLog = logs[dk] || {};
                  const targets = p.targets.filter(t => t.frequency === 'daily' || !t.frequency);
                  if (targets.length > 0) {
                    total += targets.filter(t => dayLog[t.id]?.done).length / targets.length;
                    count++;
                  }
                }
                return { label, value: count > 0 ? total / count : 0 };
              });
              return (
                <div key={p.id} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">{p.english}</div>
                    <div className="font-dev text-xs text-stone-400">{p.sanskrit}</div>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={data} barCategoryGap="30%">
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, 1]} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent', stroke: 'none' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={p.color} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT column ───────────────────────────────────────── */}
        <div>
          {/* 90-day heatmap */}
          <div className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">90 Days</div>
              <div className="flex items-center gap-3 text-[10px] text-stone-400">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#C9A961' }} /> Complete
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#E8843C' }} /> Partial
                </div>
              </div>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}>
              {heatmapData.map(({ date, completion }) => (
                <HeatmapCell key={date} date={date} completion={completion} />
              ))}
            </div>
          </div>

          {/* 30-day success rates */}
          {!settings.silentMode && targetRates.length > 0 && (
            <div className="card mb-4">
              <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3">30-Day Success Rate</div>
              <div className="space-y-2.5">
                {targetRates.map(({ target, rate }) => (
                  <div key={target.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-500 dark:text-stone-400 truncate pr-2">{target.name}</span>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: rate >= 0.8 ? '#C9A961' : rate >= 0.5 ? '#E8843C' : '#5A8A8A' }}>
                        {Math.round(rate * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-100 dark:bg-white/10">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${rate * 100}%`, backgroundColor: rate >= 0.8 ? '#C9A961' : rate >= 0.5 ? '#E8843C' : '#5A8A8A' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Numeric trends */}
          {numericTrends.length > 0 && (
            <>
              <div className="section-label mb-3">Numeric Trends</div>
              <div className="space-y-4">
                {numericTrends.map(({ target, pillar, data }) => {
                  const avg = data.reduce((s, d) => s + d.value, 0) / data.length;
                  return (
                    <div key={target.id} className="card">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">{target.name}</div>
                          <div className="text-[11px] text-stone-400">
                            avg {avg.toFixed(1)}{target.unit ? ` ${target.unit}` : ''} · last {data.length} entries
                          </div>
                        </div>
                        <div className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${pillar.color}18`, color: pillar.color }}>
                          {pillar.english}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                          <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                          <YAxis hide />
                          <Tooltip content={<NumericTooltip />} cursor={{ fill: 'transparent', stroke: 'none' }} />
                          {target.targetValue && (
                            <ReferenceLine y={target.targetValue} stroke={pillar.color} strokeDasharray="4 3" strokeOpacity={0.4} />
                          )}
                          <Line type="monotone" dataKey="value" stroke={pillar.color} strokeWidth={2}
                            dot={{ r: 3, fill: pillar.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Insights */}
          {pillarInsights.length > 0 && (
            <div className="card mt-4 dark:bg-white/3"
              style={{ background: 'rgba(45,53,97,0.04)', border: '1px solid rgba(45,53,97,0.10)' }}>
              <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3">Insights</div>
              <div className="space-y-3">
                {pillarInsights.map(({ pillar, currentRate, prevRate }) => (
                  <div key={pillar.id}>
                    <p className="font-verse text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {getPhilosophicalInsight(pillar, currentRate, prevRate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="h-8" />
    </div>
  );
}
