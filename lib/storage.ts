import type { AppData } from "./types";
import { pickSportColor } from "./colors";

export const STORAGE_KEY = "sporty-target-data";

function createSeedData(): AppData {
  const footballColor = pickSportColor([]);
  const tennisColor = pickSportColor([footballColor]);
  const swimmingColor = pickSportColor([footballColor, tennisColor]);

  return {
    sports: [
      { id: crypto.randomUUID(), name: "Football", color: footballColor },
      { id: crypto.randomUUID(), name: "Tennis", color: tennisColor },
      { id: crypto.randomUUID(), name: "Swimming", color: swimmingColor },
    ],
    practices: [],
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return { sports: [], practices: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedData();
      saveData(seed);
      return seed;
    }

    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.sports || !parsed.practices) {
      return { sports: [], practices: [] };
    }

    return parsed;
  } catch {
    return { sports: [], practices: [] };
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
