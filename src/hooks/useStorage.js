import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dharma_app_v1';

const initialState = {
  settings: {
    theme: 'light',
    silentMode: false,
    soundEnabled: false,
    onboardingComplete: false,
  },
  pillars: null,
  logs: {},
  notebook: [],
  bookmarks: [],
  chapterProgress: [],
  intentions: {},   // dateStr → string
  focusLog: [],     // [{ date, duration, completedAt }]
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

let _globalState = loadState();
let _listeners = [];

function getState() { return _globalState; }

function setState(updater) {
  _globalState = typeof updater === 'function' ? updater(_globalState) : { ..._globalState, ...updater };
  saveState(_globalState);
  _listeners.forEach((fn) => fn(_globalState));
}

export function useStorage() {
  const [state, setLocalState] = useState(_globalState);

  useEffect(() => {
    const listener = (s) => setLocalState({ ...s });
    _listeners.push(listener);
    return () => { _listeners = _listeners.filter((l) => l !== listener); };
  }, []);

  const updateSettings = useCallback((updates) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, []);

  const setPillars = useCallback((pillars) => {
    setState((s) => ({ ...s, pillars }));
  }, []);

  const logTarget = useCallback((dateStr, targetId, entry) => {
    setState((s) => ({
      ...s,
      logs: {
        ...s.logs,
        [dateStr]: {
          ...(s.logs[dateStr] || {}),
          [targetId]: entry,
        },
      },
    }));
  }, []);

  const addNotebookEntry = useCallback((entry) => {
    setState((s) => ({
      ...s,
      notebook: [entry, ...s.notebook.filter((e) => e.id !== entry.id)],
    }));
  }, []);

  const toggleBookmark = useCallback((shlokaId) => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(shlokaId)
        ? s.bookmarks.filter((id) => id !== shlokaId)
        : [...s.bookmarks, shlokaId],
    }));
  }, []);

  const markChapterRead = useCallback((chapterNum) => {
    setState((s) => ({
      ...s,
      chapterProgress: s.chapterProgress.includes(chapterNum)
        ? s.chapterProgress
        : [...s.chapterProgress, chapterNum],
    }));
  }, []);

  const setIntention = useCallback((dateStr, text) => {
    setState((s) => ({
      ...s,
      intentions: { ...s.intentions, [dateStr]: text },
    }));
  }, []);

  const logFocusSession = useCallback((session) => {
    setState((s) => ({
      ...s,
      focusLog: [session, ...(s.focusLog || [])].slice(0, 200),
    }));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(_globalState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dharma-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((raw) => {
    try {
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const merged = { ...initialState, ...data };
      setState(merged);
      if (merged.settings?.theme) {
        document.documentElement.classList.toggle('dark', merged.settings.theme === 'dark');
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    setState({ ...initialState });
  }, []);

  return {
    state,
    updateSettings,
    setPillars,
    logTarget,
    addNotebookEntry,
    toggleBookmark,
    markChapterRead,
    setIntention,
    logFocusSession,
    exportData,
    importData,
    resetAllData,
  };
}
