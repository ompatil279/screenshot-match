import { useEffect, useState } from "react";

// Local-only session history of investigations the user actually ran. Never seeded.

export interface HistoryItem {
  tool: "explorer" | "decode" | "events" | "transactions";
  query: string;
  at: string;
}

const KEY = "atlas.history.v1";
const EVT = "atlas-history";
const MAX = 12;

export function readHistory(): HistoryItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function pushHistory(item: Omit<HistoryItem, "at">) {
  try {
    const list = readHistory().filter((h) => !(h.tool === item.tool && h.query === item.query));
    list.unshift({ ...item, at: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

export function useHistory(tool?: HistoryItem["tool"]) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = () => setItems(readHistory());
    load();
    window.addEventListener(EVT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return tool ? items.filter((i) => i.tool === tool) : items;
}
