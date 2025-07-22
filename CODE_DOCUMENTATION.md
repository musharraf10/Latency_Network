# Latency Topology Visualizer - Code Documentation

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Core Components](#core-components)
3. [Custom Hooks](#custom-hooks)
4. [API Classes](#api-classes)
5. [Data Management](#data-management)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Utility Functions](#utility-functions)
8. [State Management](#state-management)
9. [Performance Optimizations](#performance-optimizations)
10. [Error Handling](#error-handling)

---

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix + Tailwind)
│   ├── MapboxGlobe.tsx   # 3D globe visualization
│   ├── MobileControlPanel.tsx # iOS-style mobile interface
│   ├── HistoricalChart.tsx # Data visualization charts
│   └── [other components]
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and API classes
├── data/                  # Mock data and data generation
└── types/                 # TypeScript type definitions
```

### Design Patterns Used

- **Singleton Pattern**: LatencyMonitor for global instance management
- **Observer Pattern**: Real-time data subscription system
- **Component Composition**: Reusable UI components with Radix UI
- **Custom Hooks**: Logic separation and reusability
- **State Management**: Zustand for global state

---

## Core Components

### MapboxGlobe.tsx

**Purpose**: Main 3D globe visualization using Mapbox GL JS with real-time latency connections.

```typescript
const MapboxGlobe = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Initialize map with globe projection
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      projection: { name: "globe" },
      center: [0, 20],
      zoom: 1.5,
    });
  }, [isDark]);
};
```

**Key Features**:

- **3D Globe Projection**: Uses Mapbox's globe projection for realistic Earth visualization
- **Real-time Latency Lines**: Animated connections between exchanges and cloud regions
- **Interactive Markers**: Clickable exchange and cloud region markers
- **Hover Tooltips**: Rich information display on hover
- **Cloud Region Boundaries**: Visual boundaries for AWS, GCP, and Azure regions
- **Theme Support**: Automatic style switching for dark/light modes

**Performance Optimizations**:

- Marker reuse and cleanup
- Efficient GeoJSON updates
- Animation frame management
- Memory leak prevention

### MobileControlPanel.tsx

**Purpose**: Swipe-up control panel for mobile devices.

```typescript
const MobileControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"control" | "advanced">("control");
  const [advancedSubTab, setAdvancedSubTab] = useState<
    "regions" | "performance" | "topology"
  >("regions");

  const handleDrag = (event: any, info: PanInfo) => {
    setDragY(info.offset.y);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      setIsOpen(false);
    } else if (info.offset.y < -100 && !isOpen) {
      setIsOpen(true);
    }
  };
};
```

**Key Features**:

- **Swipe Gestures**: Natural drag style interactions
- **Two-Level Navigation**: Main tabs with sub-navigation
- **Quick Stats**: Always-visible key metrics when collapsed
- **Backdrop Blur**: Professional glassmorphism effect
- **Spring Animations**: Physics-based motion with Framer Motion

**UI Structure**:

1. **Control Panel Tab**: Network status, search, filters, controls
2. **Advanced Panel Tab**: Cloud regions, performance, network topology
3. **Quick Stats Bar**: Persistent metrics display

### HistoricalChart.tsx

**Purpose**: Interactive historical latency data visualization with cryptocurrency selection.

```typescript
const HistoricalChart = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeRange, setTimeRange] = useState(24);

  const chartData = useMemo(() => {
    return historicalData.map((data) => ({
      time: format(new Date(data.timestamp), "HH:mm"),
      latency: data.latency,
      packetLoss: data.packetLoss,
    }));
  }, [historicalData, selectedCrypto, timeRange]);
};
```

**Key Features**:

- **Cryptocurrency Selection**: 6 popular cryptocurrencies with distinct colors
- **Time Range Filtering**: 1h, 24h, 7d, 30d options
- **Interactive Charts**: Recharts with hover tooltips
- **Statistics Cards**: Min, max, average latency display
- **Responsive Design**: Adapts to all screen sizes

**Chart Configuration**:

- **Line Charts**: Dual Y-axis for latency and packet loss
- **Color Coding**: Green for latency, red for packet loss
- **Smooth Animations**: Transition effects for data updates
- **Theme Support**: Automatic color adaptation

### NetworkTopology.tsx

**Purpose**: Network path visualization with search functionality.

```typescript
const NetworkTopology = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const connectionPaths = useMemo(() => {
    return latencyData.map((data) => {
      const exchange = exchanges.find((e) => e.id === data.exchangeId);
      const region = cloudRegions.find((r) => r.id === data.cloudRegionId);

      return {
        id: `${data.exchangeId}-${data.cloudRegionId}`,
        exchangeName: exchange.name,
        regionName: `${region.provider} ${region.location}`,
        latency: data.latency,
        packetLoss: data.packetLoss,
        hops: Math.floor(Math.random() * 8) + 3,
        bandwidth: ["1 Gbps", "10 Gbps", "100 Gbps"][
          Math.floor(Math.random() * 3)
        ],
      };
    });
  }, [latencyData, selectedExchange, selectedCloudRegion]);
};
```

**Key Features**:

- **Real-time Search**: Live filtering of exchanges and regions
- **Network Path Visualization**: Simulated network hops and bandwidth
- **Connection Details**: Latency, packet loss, and performance metrics
- **Visual Path Display**: Animated connection lines

---

## Custom Hooks

### useRealTimeLatency.ts

**Purpose**: Manages real-time latency data and network monitoring.

```typescript
export const useRealTimeLatency = () => {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const initializeMonitor = async () => {
      const monitor = LatencyMonitor.getInstance();
      const unsubscribe = monitor.subscribe((data: LatencyData[]) => {
        setLatencyData(data);
        setIsConnected(true);
      });
      await monitor.start();
      return unsubscribe;
    };
    initializeMonitor();
  }, []);

  const statistics = useMemo(
    () => ({
      avgLatency: Math.round(
        latencyData.reduce((sum, data) => sum + data.latency, 0) /
          latencyData.length
      ),
      minLatency: Math.min(...latencyData.map((data) => data.latency)),
      maxLatency: Math.max(...latencyData.map((data) => data.latency)),
      activeConnections: latencyData.filter((data) => data.latency < 200)
        .length,
    }),
    [latencyData]
  );
};
```

**Key Features**:

- **Real-time Monitoring**: 5-second interval updates
- **Network Information**: Browser connection details
- **Performance Metrics**: Page load and paint timing
- **Statistics Calculation**: Live performance metrics
- **Error Handling**: Graceful fallbacks and error recovery

### useStore.ts

**Purpose**: Global state management using Zustand.

```typescript
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

  // Actions
  setSelectedExchange: (id) => set({ selectedExchange: id }),
  setSelectedCloudRegion: (id) => set({ selectedCloudRegion: id }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
```

**State Structure**:

- **Selection State**: Currently selected exchange and cloud region
- **Filter State**: Active filters for exchanges, providers, and latency range
- **UI State**: Modal visibility and feature toggles
- **Actions**: State update functions with proper typing

### useTheme.ts

**Purpose**: Theme management with system preference detection.

```typescript
export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return { theme: currentTheme, setTheme, toggleTheme, isDark };
};
```

**Features**:

- **System Preference**: Automatic detection of OS theme
- **Hydration Safety**: Prevents SSR mismatch issues
- **Theme Persistence**: Automatic storage in localStorage
- **Toggle Function**: Easy theme switching

---

## API Classes

### LatencyMonitor

**Purpose**: Singleton class for real-time latency monitoring with subscriber pattern.

```typescript
export class LatencyMonitor {
  private static instance: LatencyMonitor;
  private subscribers: ((data: LatencyData[]) => void)[] = [];
  private isRunning = false;

  static getInstance(): LatencyMonitor {
    if (!LatencyMonitor.instance) {
      LatencyMonitor.instance = new LatencyMonitor();
    }
    return LatencyMonitor.instance;
  }

  private async measureLatency(url: string): Promise<number> {
    const start = performance.now();
    try {
      await fetch(url, { method: "HEAD", mode: "no-cors" });
      return Math.round(performance.now() - start);
    } catch (error) {
      return Math.round(Math.random() * 200 + 20);
    }
  }

  subscribe(callback: (data: LatencyData[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }
}
```

**Key Features**:

- **Singleton Pattern**: Global instance management
- **Observer Pattern**: Subscription-based data updates
- **Real Network Requests**: Actual latency measurement to exchange APIs
- **Fallback System**: Mock data when network requests fail
- **Cleanup Management**: Proper subscription cleanup

### NetworkPerformanceMonitor

**Purpose**: Browser network information and performance metrics collection.

```typescript
export class NetworkPerformanceMonitor {
  static async getNetworkInfo() {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection;
    return {
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      online: navigator.onLine,
    };
  }

  static async measurePageLoadPerformance() {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint:
        performance
          .getEntriesByType("paint")
          .find((entry) => entry.name === "first-paint")?.startTime || 0,
    };
  }
}
```

**Metrics Collected**:

- **Connection Type**: 2G, 3G, 4G, WiFi detection
- **Bandwidth**: Download speed estimation
- **Round Trip Time**: Network latency to ISP
- **Page Performance**: Load timing metrics
- **Paint Timing**: First paint and contentful paint

---

## Data Management

### mockData.ts

**Purpose**: Realistic data generation with geographic-based latency calculations.

```typescript
// Haversine formula for distance calculation
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const generateMockLatencyData = (): LatencyData[] => {
  const data: LatencyData[] = [];

  exchanges.forEach((exchange) => {
    cloudRegions.forEach((region) => {
      const distance = getDistance(
        exchange.coordinates[0],
        exchange.coordinates[1],
        region.coordinates[0],
        region.coordinates[1]
      );

      // Base latency: 0.1ms per km (fiber-optic networks)
      const baseLatency = distance * 0.1;
      const variation = (Math.random() - 0.5) * 20;
      const latency = Math.max(1, Math.round(baseLatency + variation));

      data.push({
        exchangeId: exchange.id,
        cloudRegionId: region.id,
        latency,
        timestamp: Date.now(),
        packetLoss: Math.random() * (distance > 1000 ? 2 : 1),
      });
    });
  });

  return data;
};
```

**Data Generation Features**:

- **Geographic Accuracy**: Real coordinates for exchanges and cloud regions
- **Realistic Latency**: Distance-based calculations using Haversine formula
- **Network Variation**: Random variations to simulate real network conditions
- **Packet Loss Simulation**: Distance-correlated packet loss rates
- **Historical Data**: Time-series generation for charts

**Exchange Data**:

- **Global Coverage**: 9 major exchanges across different regions
- **Real Locations**: Actual geographic coordinates
- **Volume Data**: Realistic 24h trading volumes
- **Status Monitoring**: Online/offline/degraded states

**Cloud Region Data**:

- **Multi-Provider**: AWS, GCP, and Azure regions
- **Availability Zones**: Realistic zone configurations
- **Geographic Distribution**: Global coverage with regional clustering

---

## TypeScript Interfaces

### Core Data Types

```typescript
export interface Exchange {
  id: string; // Unique identifier
  name: string; // Display name
  coordinates: [number, number]; // [latitude, longitude]
  region: string; // Geographic region
  volume24h: number; // 24-hour trading volume
  status: "online" | "offline" | "degraded";
}

export interface CloudRegion {
  id: string; // Unique identifier
  provider: "AWS" | "GCP" | "Azure";
  regionCode: string; // Provider-specific region code
  location: string; // Human-readable location
  coordinates: [number, number]; // [latitude, longitude]
  zones: string[]; // Availability zones
}

export interface LatencyData {
  exchangeId: string; // Reference to exchange
  cloudRegionId: string; // Reference to cloud region
  latency: number; // Milliseconds
  timestamp: number; // Unix timestamp
  packetLoss: number; // Percentage (0-100)
}

export interface HistoricalData {
  exchangeId?: string; // Optional exchange filter
  cloudRegionId?: string; // Optional region filter
  timestamp: number; // Unix timestamp
  latency: number; // Milliseconds
  packetLoss: number; // Percentage
}
```

### Application State

```typescript
export interface AppState {
  // Selection state
  selectedExchange: string | null;
  selectedCloudRegion: string | null;

  // Filter state
  filters: {
    exchanges: string[]; // Selected exchange IDs
    cloudProviders: ("AWS" | "GCP" | "Azure")[]; // Selected providers
    latencyRange: [number, number]; // Min/max latency filter
  };

  // UI state
  realTimeEnabled: boolean; // Real-time updates toggle
  showHistorical: boolean; // Historical chart visibility
  showHeatmap: boolean; // Heatmap layer visibility
  darkMode: boolean; // Theme preference

  // Actions (Zustand pattern)
  setSelectedExchange: (id: string | null) => void;
  setSelectedCloudRegion: (id: string | null) => void;
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  setShowHistorical: (show: boolean) => void;
  setShowHeatmap: (show: boolean) => void;
  toggleDarkMode: () => void;
}
```

---

## Utility Functions

### lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage examples:
// cn("px-4 py-2", "bg-blue-500", { "text-white": isActive })
// cn("base-class", conditionalClass && "additional-class")
```

**Purpose**: Combines and merges Tailwind CSS classes intelligently, resolving conflicts and removing duplicates.

### Animation Utilities

```typescript
// Framer Motion variants for consistent animations
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const springConfig = {
  type: "spring",
  damping: 30,
  stiffness: 300,
};
```

---

## State Management

### Zustand Store Pattern

```typescript
// Store creation with TypeScript
const useStore = create<AppState>((set, get) => ({
  // Initial state
  selectedExchange: null,

  // Actions with proper typing
  setSelectedExchange: (id) => set({ selectedExchange: id }),

  // Complex state updates
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  // Computed values (using get)
  getFilteredData: () => {
    const state = get();
    return state.data.filter(/* filtering logic */);
  },
}));
```

**Benefits**:

- **TypeScript Integration**: Full type safety
- **Minimal Boilerplate**: Less code than Redux
- **DevTools Support**: Redux DevTools integration
- **Performance**: Selective subscriptions

### State Persistence

```typescript
// Theme persistence with next-themes
const ThemeProvider = ({ children }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
```

---

## Performance Optimizations

### React Optimizations

```typescript
// Component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Callback memoization
const useOptimizedCallback = () => {
  const expensiveCallback = useCallback(
    (data) => {
      // expensive operation
    },
    [dependency]
  );

  return expensiveCallback;
};

// Value memoization
const useMemoizedValue = (data) => {
  const processedData = useMemo(() => {
    return data.map(/* expensive processing */);
  }, [data]);

  return processedData;
};
```

### Mapbox Optimizations

```typescript
// Efficient marker management
const useMarkerOptimization = () => {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  const updateMarkers = useCallback((newData) => {
    // Reuse existing markers
    const existingMarkers = markersRef.current;

    // Remove unused markers
    existingMarkers.forEach((marker, id) => {
      if (!newData.find((item) => item.id === id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Add new markers
    newData.forEach((item) => {
      if (!existingMarkers.has(item.id)) {
        const marker = new mapboxgl.Marker()
          .setLngLat(item.coordinates)
          .addTo(map);
        existingMarkers.set(item.id, marker);
      }
    });
  }, []);
};
```

### Animation Performance

```typescript
// Efficient animation cleanup
useEffect(() => {
  let animationId: number;

  const animate = () => {
    // Animation logic
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}, []);
```

---
