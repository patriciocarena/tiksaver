import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Preferences, DownloadHistoryItem } from "./types";

interface PreferencesSlice {
  preferences: Preferences;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
}

interface HistorySlice {
  history: DownloadHistoryItem[];
  addToHistory: (item: DownloadHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export type AppStore = PreferencesSlice & HistorySlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      preferences: {
        theme: "dark",
      },
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),
      toggleTheme: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme: state.preferences.theme === "dark" ? "light" : "dark",
          },
        })),

      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        history: state.history,
      }),
    },
  ),
);
