import { useState } from 'react';
import { Plus, Trash2, Edit3, X, Check, Moon, Soup, Dumbbell, Star, Heart, Flame, Zap, Wind, Sun } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { DEFAULT_PILLARS } from '../data/defaultPillars';

const ICON_OPTIONS = [
  { id: 'moon', Icon: Moon }, { id: 'bowl', Icon: Soup }, { id: 'dumbbell', Icon: Dumbbell },
  { id: 'star', Icon: Star }, { id: 'heart', Icon: Heart }, { id: 'flame', Icon: Flame },
  { id: 'zap', Icon: Zap }, { id: 'wind', Icon: Wind }, { id: 'sun', Icon: Sun },
];

const COLOR_OPTIONS = [
  '#5A8A8A','#E8843C','#2D3561','#C9A961',
  '#7C3AED','#059669','#DC2626','#D97706',
];

const ICON_MAP = {
  moon: Moon, bowl: Soup, dumbbell: Dumbbell,
  star: Star, heart: Heart, flame: Flame, zap: Zap, wind: Wind, sun: Sun,
};

const TARGET_TYPES = [
  { id: 'CHECKBOX', label: 'Yes / No' },
  { id: 'NUMBER',   label: 'Number' },
  { id: 'TIME',     label: 'Time' },
  { id: 'DURATION', label: 'Duration' },
];

function AddTargetForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('CHECKBOX');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [comparison, setComparison] = useState('gte');

  const fieldCls =
    'w-full text-sm text-[#1a1a2e] dark:text-white placeholder-stone-400 ' +
    'bg-white dark:bg-white/10 border border-black/10 dark:border-white/12 ' +
    'rounded-xl px-3 py-2.5 outline-none focus:border-[#E8843C] transition-colors';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({
          id: `custom-${Date.now()}`,
          name: name.trim(),
          type,
          targetValue: (type === 'NUMBER' || type === 'DURATION') ? parseFloat(targetValue) || 0 : targetValue,
          unit, comparison, frequency: 'daily', reminder: null,
        });
      }}
      className="rounded-2xl p-4 space-y-3 bg-white/60 dark:bg-white/5 border border-black/8 dark:border-white/10"
    >
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">New Target</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Target name (e.g. Bedtime, Water intake)"
        autoFocus
        className={fieldCls}
      />

      <div>
        <p className="text-[11px] text-stone-400 mb-1.5">Type</p>
        <div className="flex gap-1.5 flex-wrap">
          {TARGET_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                type === t.id
                  ? 'bg-[#E8843C] text-white border-[#E8843C]'
                  : 'bg-transparent border-black/10 dark:border-white/15 text-stone-500 dark:text-stone-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {(type === 'NUMBER' || type === 'DURATION') && (
        <div className="flex gap-2">
          <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="Target value"
            className={fieldCls} />
          <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit (ml, min…)"
            className="w-28 text-sm text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/10 border border-black/10 dark:border-white/12 rounded-xl px-3 py-2.5 outline-none focus:border-[#E8843C] transition-colors" />
          <select value={comparison} onChange={(e) => setComparison(e.target.value)}
            className="text-sm text-[#1a1a2e] dark:text-white bg-white dark:bg-white/10 border border-black/10 dark:border-white/12 rounded-xl px-3 py-2.5 outline-none">
            <option value="gte">≥ at least</option>
            <option value="lte">≤ at most</option>
          </select>
        </div>
      )}
      {type === 'TIME' && (
        <div className="flex gap-2">
          <input type="time" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}
            className={fieldCls} />
          <select value={comparison} onChange={(e) => setComparison(e.target.value)}
            className="text-sm text-[#1a1a2e] dark:text-white bg-white dark:bg-white/10 border border-black/10 dark:border-white/12 rounded-xl px-3 py-2.5 outline-none">
            <option value="lte">by (before)</option>
            <option value="gte">after</option>
          </select>
        </div>
      )}

      <div className="flex gap-2 pt-0.5">
        <button type="submit"
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#E8843C,#C9A961)' }}>
          Add Target
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-400 dark:text-stone-500 border border-black/8 dark:border-white/10 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

function PillarEditor({ pillar, onSave, onCancel }) {
  const [sanskrit, setSanskrit] = useState(pillar.sanskrit);
  const [english, setEnglish] = useState(pillar.english);
  const [icon, setIcon] = useState(pillar.icon);
  const [color, setColor] = useState(pillar.color);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={english} onChange={(e) => setEnglish(e.target.value)} placeholder="Name"
          className="flex-1 text-sm text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/8 border border-black/8 dark:border-white/8 rounded-xl px-3 py-2.5 outline-none focus:border-[#E8843C]" />
        <input value={sanskrit} onChange={(e) => setSanskrit(e.target.value)} placeholder="Sanskrit"
          className="w-28 text-sm font-dev text-[#1a1a2e] dark:text-white placeholder-stone-400 bg-white dark:bg-white/8 border border-black/8 dark:border-white/8 rounded-xl px-3 py-2.5 outline-none focus:border-[#E8843C]" />
      </div>
      <div>
        <p className="text-xs text-stone-400 mb-2">Icon</p>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map(({ id, Icon }) => (
            <button key={id} type="button" onClick={() => setIcon(id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                icon === id ? 'border-[#E8843C] bg-[#E8843C]/10' : 'border-black/8 dark:border-white/8'
              }`}>
              <Icon size={15} style={{ color: icon === id ? '#E8843C' : '#9CA3AF' }} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-stone-400 mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-all ${color === c ? 'scale-110 ring-2 ring-offset-1 ring-stone-400' : ''}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ ...pillar, sanskrit, english, icon, color })}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#2D3561,#5B6BAF)' }}>
          Save
        </button>
        <button onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-400 border border-black/8 dark:border-white/8">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Sadhana() {
  const { state, setPillars } = useStorage();
  const pillars = state.pillars || DEFAULT_PILLARS;
  const [editingId, setEditingId] = useState(null);
  const [addingTargetTo, setAddingTargetTo] = useState(null);
  const [addingPillar, setAddingPillar] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function savePillar(updated) {
    setPillars(pillars.map((p) => (p.id === updated.id ? updated : p)));
    setEditingId(null);
  }

  function deletePillar(id) {
    setPillars(pillars.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  }

  function addTarget(pillarId, target) {
    setPillars(pillars.map((p) => p.id === pillarId ? { ...p, targets: [...p.targets, target] } : p));
    setAddingTargetTo(null);
  }

  function deleteTarget(pillarId, targetId) {
    setPillars(pillars.map((p) => p.id === pillarId ? { ...p, targets: p.targets.filter((t) => t.id !== targetId) } : p));
  }

  function addNewPillar(data) {
    setPillars([...pillars, {
      id: `pillar-${Date.now()}`,
      sanskrit: data.sanskrit || 'नया',
      english: data.english || 'New',
      icon: data.icon || 'star',
      color: data.color || '#E8843C',
      targets: [],
    }]);
    setAddingPillar(false);
  }

  return (
    <div className="page-container page-transition">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Pillars</h1>
        <p className="text-sm text-stone-400">Manage your practice areas</p>
      </div>

      <div className="grid md:grid-cols-2 md:gap-4 mb-6 gap-4">
        {pillars.map((pillar) => {
          const IconComponent = ICON_MAP[pillar.icon] || Star;
          const isEditing = editingId === pillar.id;

          return (
            <div key={pillar.id} className="card" style={{ borderLeft: `3px solid ${pillar.color}` }}>
              {isEditing ? (
                <PillarEditor pillar={pillar} onSave={savePillar} onCancel={() => setEditingId(null)} />
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: pillar.color + '18' }}>
                      <IconComponent size={16} style={{ color: pillar.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1a1a2e] dark:text-white">{pillar.english}</div>
                      <div className="font-dev text-[11px] text-stone-400">{pillar.sanskrit}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => setEditingId(pillar.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-stone-500 transition-colors">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(pillar.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {confirmDeleteId === pillar.id && (
                    <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-between">
                      <span className="text-sm text-red-500">Remove this pillar?</span>
                      <div className="flex gap-2">
                        <button onClick={() => deletePillar(pillar.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white font-medium">Remove</button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-black/8 text-stone-500">Keep</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {pillar.targets.map((target) => (
                      <div key={target.id}
                        className="flex items-center gap-2 py-2 px-3 rounded-xl bg-black/2 dark:bg-white/3">
                        <div className="flex-1">
                          <p className="text-sm text-[#1a1a2e] dark:text-white">{target.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-stone-400"
                              style={{ background: 'rgba(0,0,0,0.05)' }}>
                              {target.type}
                            </span>
                            {target.targetValue && (
                              <span className="text-[10px] text-stone-400">
                                target: {target.targetValue}{target.unit ? ` ${target.unit}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <button onClick={() => deleteTarget(pillar.id, target.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-200 hover:text-red-400 transition-colors">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingTargetTo === pillar.id ? (
                    <div className="mt-3">
                      <AddTargetForm
                        onAdd={(t) => addTarget(pillar.id, t)}
                        onCancel={() => setAddingTargetTo(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTargetTo(pillar.id)}
                      className="mt-3 w-full py-2 rounded-xl text-sm text-stone-400 border border-dashed border-black/10 dark:border-white/10 hover:border-[#E8843C] hover:text-[#E8843C] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={13} /> Add target
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {addingPillar ? (
        <div className="card">
          <p className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3">New Pillar</p>
          <PillarEditor
            pillar={{ id: '', sanskrit: '', english: '', icon: 'star', color: '#E8843C', targets: [] }}
            onSave={addNewPillar}
            onCancel={() => setAddingPillar(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setAddingPillar(true)}
          className="w-full py-4 rounded-2xl text-sm font-medium text-stone-400 flex items-center justify-center gap-2 transition-all border-2 border-dashed border-black/8 dark:border-white/8 hover:border-[#E8843C] hover:text-[#E8843C]"
        >
          <Plus size={16} /> Add Pillar
        </button>
      )}

      <div className="h-6" />
    </div>
  );
}
