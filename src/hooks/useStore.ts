import { create } from "zustand";
import type { AppState } from "@/types";

export const useStore = create<AppState>((set) => ({
  selectedExchange: null,
  selectedCloudRegion: null,
  filters: {
    exchanges: [],
    cloudProviders: ["AWS", "GCP", "Azure"],
    latencyRange: [0, 500],
  },
  realTimeEnabled: true,
  showHistorical: false,
  showHeatmap: false,
  darkMode: true,
  setSelectedExchange: (id) => set({ selectedExchange: id }),
  setSelectedCloudRegion: (id) => set({ selectedCloudRegion: id }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setRealTimeEnabled: (enabled) => set({ realTimeEnabled: enabled }),
  setShowHistorical: (show) => set({ showHistorical: show }),
  setShowHeatmap: (show) => {
    // console.log("Setting showHeatmap to:", show);
    set({ showHeatmap: show });
  },
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
