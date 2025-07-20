export interface Exchange {
  id: string;
  name: string;
  coordinates: [number, number];
  region: string;
  volume24h: number;
  status: "online" | "offline" | "degraded";
}

export interface CloudRegion {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  regionCode: string;
  location: string;
  coordinates: [number, number];
  zones: string[];
}

export interface LatencyData {
  exchangeId: string;
  cloudRegionId: string;
  latency: number;
  timestamp: number;
  packetLoss: number;
}

export interface HistoricalData {
  timestamp: number;
  latency: number;
  packetLoss: number;
}

export interface AppState {
  selectedExchange: string | null;
  selectedCloudRegion: string | null;
  filters: {
    exchanges: string[];
    cloudProviders: ("AWS" | "GCP" | "Azure")[];
    latencyRange: [number, number];
  };
  realTimeEnabled: boolean;
  showHistorical: boolean;
  showHeatmap: boolean;
  darkMode: boolean;
  setSelectedExchange: (id: string | null) => void;
  setSelectedCloudRegion: (id: string | null) => void;
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  setShowHistorical: (show: boolean) => void;
  setShowHeatmap: (show: boolean) => void;
  toggleDarkMode: () => void;
}
