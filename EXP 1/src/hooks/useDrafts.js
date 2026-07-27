import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "post-composer-drafts";

function loadDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Encapsulates all draft CRUD + localStorage persistence behind one hook,
// so components never touch localStorage directly.
export function useDrafts() {
  const [drafts, setDrafts] = useState(loadDrafts);

  // Persist any time drafts change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  const addDraft = useCallback((draft) => {
    const newDraft = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...draft,
    };
    setDrafts((prev) => [newDraft, ...prev]);
    return newDraft;
  }, []);

  const updateDraft = useCallback((id, updates) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  }, []);

  const deleteDraft = useCallback((id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDraft = useCallback((id) => drafts.find((d) => d.id === id), [drafts]);

  return { drafts, addDraft, updateDraft, deleteDraft, getDraft };
}
