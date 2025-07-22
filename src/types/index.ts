/**
 * Core type definitions for the Latency Topology Visualizer
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application for type safety and better developer experience.
 */

/**
 * Represents a cryptocurrency exchange with its location and status
 */
export interface Exchange {
  /** Unique identifier for the exchange */
  id: string;
  /** Display name of the exchange */
  name: string;
  /** Geographic coordinates [latitude, longitude] */
  coordinates: [number, number];
  /** Geographic region where the exchange is located */
  region: string;
  /** 24-hour trading volume in USD */
  volume24h: number;
  /** Current operational status */
  status: "online" | "offline" | "degraded";
}

/**
 * Represents a cloud provider region with availability zones
 */
export interface CloudRegion {
  /** Unique identifier for the cloud region */
  id: string;
  /** Cloud provider name */
  provider: "AWS" | "GCP" | "Azure";
  /** Provider-specific region code */
  regionCode: string;
  /** Human-readable location name */
  location: string;
  /** Geographic coordinates [latitude, longitude] */
  coordinates: [number, number];
  /** Available zones within the region */
  zones: string[];
}

/**
 * Real-time latency measurement between an exchange and cloud region
 */
export interface LatencyData {
  /** ID of the source exchange */
  exchangeId: string;
  /** ID of the destination cloud region */
  cloudRegionId: string;
  /** Measured latency in milliseconds */
  latency: number;
  /** Unix timestamp when measurement was taken */
  timestamp: number;
  /** Packet loss percentage (0-100) */
  packetLoss: number;
}

/**
 * Historical latency data point for trend analysis
 */
export interface HistoricalData {
  /** Optional exchange ID for filtering */
  exchangeId?: string;
  /** Optional cloud region ID for filtering */
  cloudRegionId?: string;
  /** Unix timestamp of the measurement */
  timestamp: number;
  /** Measured latency in milliseconds */
  latency: number;
  /** Packet loss percentage at time of measurement */
  packetLoss: number;
}

/**
 * Global application state interface using Zustand
 * Contains all shared state and actions for the application
 */
export interface AppState {
  /** Currently selected exchange ID */
  selectedExchange: string | null;
  /** Currently selected cloud region ID */
  selectedCloudRegion: string | null;
  /** Active filters for data visualization */
  filters: {
    /** Array of exchange IDs to show (empty = show all) */
    exchanges: string[];
    /** Array of cloud providers to show */
    cloudProviders: ("AWS" | "GCP" | "Azure")[];
    /** Latency range filter [min, max] in milliseconds */
    latencyRange: [number, number];
  };
  /** Whether real-time updates are enabled */
  realTimeEnabled: boolean;
  /** Whether to show historical data modal */
  showHistorical: boolean;
  /** Whether to show latency heatmap overlay */
  showHeatmap: boolean;
  /** Current theme preference */
  darkMode: boolean;
  
  // State update actions
  /** Set the selected exchange */
  setSelectedExchange: (id: string | null) => void;
  /** Set the selected cloud region */
  setSelectedCloudRegion: (id: string | null) => void;
  /** Update filters (partial update supported) */
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  /** Enable/disable real-time updates */
  setRealTimeEnabled: (enabled: boolean) => void;
  /** Show/hide historical data modal */
  setShowHistorical: (show: boolean) => void;
  /** Show/hide latency heatmap */
  setShowHeatmap: (show: boolean) => void;
  /** Toggle between dark and light themes */
  toggleDarkMode: () => void;
}
