"use client";

import { useCallback, useSyncExternalStore } from "react";
import { pickSportColor } from "@/lib/colors";
import { isEndAfterStart } from "@/lib/date-utils";
import { loadData, saveData } from "@/lib/storage";
import type { AppData, PracticeFormData, PracticeSlot, Sport } from "@/lib/types";

const SAVE_DEBOUNCE_MS = 300;

const EMPTY_DATA: AppData = { sports: [], practices: [] };

let storeData: AppData | null = null;
let storeInitialized = false;
const listeners = new Set<() => void>();

function getSnapshot(): AppData {
  if (typeof window === "undefined") return EMPTY_DATA;
  if (!storeInitialized) {
    storeData = loadData();
    storeInitialized = true;
  }
  return storeData ?? EMPTY_DATA;
}

function getServerSnapshot(): AppData {
  return EMPTY_DATA;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((l) => l());
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function updateStore(updater: (prev: AppData) => AppData) {
  const prev = getSnapshot();
  const next = updater(prev);
  storeData = next;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveData(next), SAVE_DEBOUNCE_MS);
  emit();
}

export function usePracticeStore() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => storeInitialized,
    () => false
  );

  const addSport = useCallback((name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return "Sport name is required";
    if (trimmed.length > 30) return "Sport name must be 30 characters or less";

    const prev = getSnapshot();
    if (prev.sports.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      return "A sport with this name already exists";
    }

    const color = pickSportColor(prev.sports.map((s) => s.color));
    updateStore((p) => ({
      ...p,
      sports: [...p.sports, { id: crypto.randomUUID(), name: trimmed, color }],
    }));
    return null;
  }, []);

  const updateSport = useCallback((id: string, name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return "Sport name is required";
    if (trimmed.length > 30) return "Sport name must be 30 characters or less";

    const prev = getSnapshot();
    if (prev.sports.some((s) => s.id !== id && s.name.toLowerCase() === trimmed.toLowerCase())) {
      return "A sport with this name already exists";
    }

    updateStore((p) => ({
      ...p,
      sports: p.sports.map((s) => (s.id === id ? { ...s, name: trimmed } : s)),
    }));
    return null;
  }, []);

  const deleteSport = useCallback((id: string) => {
    updateStore((p) => ({
      sports: p.sports.filter((s) => s.id !== id),
      practices: p.practices.filter((pr) => pr.sportId !== id),
    }));
  }, []);

  const getSportPracticeCount = useCallback(
    (sportId: string) => data.practices.filter((p) => p.sportId === sportId).length,
    [data.practices]
  );

  const addPractice = useCallback((form: PracticeFormData): string | null => {
    if (!form.sportId) return "Please select a sport";
    if (!form.date) return "Date is required";
    if (!form.startTime || !form.endTime) return "Start and end times are required";
    if (!isEndAfterStart(form.startTime, form.endTime)) return "End time must be after start time";

    const slot: PracticeSlot = {
      id: crypto.randomUUID(),
      sportId: form.sportId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    updateStore((p) => ({ ...p, practices: [...p.practices, slot] }));
    return null;
  }, []);

  const updatePractice = useCallback((id: string, form: PracticeFormData): string | null => {
    if (!form.sportId) return "Please select a sport";
    if (!form.date) return "Date is required";
    if (!form.startTime || !form.endTime) return "Start and end times are required";
    if (!isEndAfterStart(form.startTime, form.endTime)) return "End time must be after start time";

    updateStore((p) => ({
      ...p,
      practices: p.practices.map((pr) =>
        pr.id === id
          ? {
              ...pr,
              sportId: form.sportId,
              date: form.date,
              startTime: form.startTime,
              endTime: form.endTime,
              location: form.location.trim() || undefined,
              notes: form.notes.trim() || undefined,
            }
          : pr
      ),
    }));
    return null;
  }, []);

  const deletePractice = useCallback((id: string) => {
    updateStore((p) => ({
      ...p,
      practices: p.practices.filter((pr) => pr.id !== id),
    }));
  }, []);

  const getSportById = useCallback(
    (id: string): Sport | undefined => data.sports.find((s) => s.id === id),
    [data.sports]
  );

  const getOverlappingPractices = useCallback(
    (slot: { id?: string; date: string; startTime: string; endTime: string }) => {
      return data.practices.filter((p) => {
        if (slot.id && p.id === slot.id) return false;
        if (p.date !== slot.date) return false;
        const toMin = (t: string) => {
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };
        return toMin(p.startTime) < toMin(slot.endTime) && toMin(slot.startTime) < toMin(p.endTime);
      });
    },
    [data.practices]
  );

  return {
    sports: data.sports,
    practices: data.practices,
    hydrated,
    addSport,
    updateSport,
    deleteSport,
    getSportPracticeCount,
    addPractice,
    updatePractice,
    deletePractice,
    getSportById,
    getOverlappingPractices,
  };
}
