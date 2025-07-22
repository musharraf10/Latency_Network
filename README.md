# Latency Topology Visualizer

Application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

![Latency Topology Visualizer](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop)

## 🚀 Features

### 3D World Map Visualization

- **Interactive 3D Globe**: Powered by Mapbox GL JS with globe projection
- **Real-time Rotation**: Auto-rotating globe with pause on user interaction
- **Smooth Controls**: Zoom, pan, and rotate with optimized performance
- **Professional Styling**: Enhanced fog effects and atmospheric rendering

### Exchange Server Locations

- **Global Coverage**: 9 major cryptocurrency exchanges including:
  - Binance (Tokyo)
  - Coinbase Pro (San Francisco)
  - Kraken (San Francisco)
  - Bybit (Singapore)
  - OKX (Singapore)
  - Bitstamp (London)
  - CoinDCX (Delhi)
  - ZebPay (Pune)
  - BitBNS (Bangalore)
- **Interactive Markers**: Hover and click for detailed information
- **Visual Distinction**: Color-coded markers for different regions

### Cloud Provider Regions

- **AWS Regions**: 5 regions with orange boundaries and markers
- **GCP Regions**: 4 regions with blue boundaries and markers
- **Azure Regions**: 4 regions with cyan boundaries and markers
- **Filtering**: Toggle visibility by cloud provider

### Real-time Latency Visualization

- **Live Connections**: Animated latency lines between exchanges and regions
- **Color Coding**:
  - Green: < 50ms (Excellent)
  - Yellow: 50-150ms (Good)
  - Red: > 150ms (Poor)
- **Interactive Tooltips**: Hover over connections for detailed latency information
- **Real-time Updates**: Data refreshes every 5 seconds
- **Pause/Resume**: Control real-time updates

### Historical Data Analysis

- **Time-series Charts**: Interactive charts using Recharts
- **Multiple Cryptocurrencies**: Bitcoin, Ethereum, Solana, Cardano, Polygon, Chainlink
- **Time Ranges**: 1 hour, 24 hours, 7 days, 30 days
- **Statistics**: Min, max, average latency with packet loss data
- **Professional Styling**: Theme-aware charts with smooth animations

### Advanced Analytics

- **Performance Dashboard**: Real-time performance scoring (A+ to D grades)
- **Network Topology**: Connection path visualization with search
- **Cloud Region Analysis**: Regional performance metrics
- **Export Functionality**: JSON, CSV, analysis reports, screenshots

### Mobile-First Design

- **Control Panel**: Swipe-up interface
- **Responsive Design**: Optimized for all screen sizes
- **Touch Gestures**: Native mobile interactions
- **Quick Stats**: Always-visible key metrics

### Crypto Transaction Creator

- **Interactive Route Creation**: Select two points to create routes
- **Custom Naming**: Add cryptocurrency names to routes
- **Latency Estimation**: Real-time latency calculation
- **Route Management**: Track active crypto routes

## 🛠 Technology Stack

### Frontend Framework

- **Next.js 15.4.2**: React framework with App Router
- **React 18.3.1**: Latest React with concurrent features
- **TypeScript 5.4.5**: Full type safety throughout the application

### 3D Visualization

- **Mapbox GL JS 3.13.0**: 3D globe rendering and map visualization
- **Three.js 0.160.0**: 3D graphics and animations
- **@react-three/fiber 8.18.0**: React renderer for Three.js

### UI Components

- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion 12.23.6**: Production-ready motion library
- **Lucide React 0.446.0**: Beautiful & consistent icon toolkit

### Data Visualization

- **Recharts 2.15.4**: Composable charting library
- **Date-fns 3.6.0**: Modern JavaScript date utility library

### State Management

- **Zustand 5.0.6**: Small, fast, and scalable state management
- **React Hook Form 7.53.0**: Performant forms with easy validation

### Styling & Theming

- **next-themes 0.4.6**: Perfect dark mode in Next.js
- **class-variance-authority 0.7.0**: Creating variant APIs
- **tailwind-merge 2.5.2**: Merge Tailwind CSS classes
- **tailwindcss-animate 1.0.7**: Animation utilities

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation & Setup

### Prerequisites

- Node.js 18.0 or higher
- npm package manager
- Mapbox account and access token

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/musharraf10/Latency_Network.git
cd folder
```

2. Install dependencies:

```bash
npm install #if any error try legacy modules
```

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

4. Get your Mapbox access token:
   - Sign up at [Mapbox](https://www.mapbox.com/)
   - Go to your [Account page](https://account.mapbox.com/)
   - Copy your default public token

### Running the Application

#### Development Mode

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix + Tailwind)
│   ├── CloudRegionVisualization.tsx
│   ├── ControlPanel.tsx
│   ├── CryptoTransactionCreator.tsx
│   ├── ExportDialog.tsx
│   ├── HistoricalChart.tsx
│   ├── LatencyConnection.tsx
│   ├── LatencyHeatmap.tsx
│   ├── Legend.tsx
│   ├── LoadingScreen.tsx
│   ├── MapboxGlobe.tsx
│   ├── MobileControlPanel.tsx
│   ├── NetworkStatus.tsx
│   ├── NetworkTopology.tsx
│   ├── PerformanceDashboard.tsx
│   ├── SearchPanel.tsx
│   └── ThemeToggle.tsx
├── data/                  # Mock data and utilities
│   └── mockData.ts       # Exchange and cloud region data
├── hooks/                 # Custom React hooks
│   ├── use-toast.ts      # Toast notifications
│   ├── useLatencyData.ts # Latency data management
│   ├── useRealTimeLatency.ts # Real-time monitoring
│   ├── useStore.ts       # Global state management
│   └── useTheme.ts       # Theme management
├── lib/                   # Utility libraries
│   ├── api.ts            # API and monitoring classes
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript type definitions
    └── index.ts          # Application types
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#10B981) - Excellent latency
- **Warning**: Yellow (#F59E0B) - Good latency
- **Error**: Red (#EF4444) - Poor latency
- **AWS**: Orange (#FF9500)
- **GCP**: Blue (#4285F4)
- **Azure**: Cyan (#00D4FF)

### Typography

- **Primary Font**: Inter - Clean, modern sans-serif
- **Display Font**: Playfair Display - Elegant serif for headings
- **Monospace Font**: JetBrains Mono - Code and data display

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: > 1440px

## 🔧 Configuration

### Mapbox Configuration

The application uses Mapbox GL JS for 3D globe rendering. Key configurations:

```javascript
// Globe projection with custom styling
style: isDark
  ? "mapbox://styles/mapbox/dark-v11"
  : "mapbox://styles/mapbox/light-v11";
projection: {
  name: "globe";
}
center: [0, 20];
zoom: 1.5;
```

### Theme Configuration

Supports both dark and light themes with system preference detection:

```javascript
// Theme provider configuration
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
```

### State Management

Uses Zustand for global state management:

```typescript
interface AppState {
  selectedExchange: string | null;
  selectedCloudRegion: string | null;
  filters: FilterState;
  realTimeEnabled: boolean;
  showHistorical: boolean;
  showHeatmap: boolean;
  darkMode: boolean;
}
```

## 📊 Data Sources & APIs

- **Distance-based Latency**: Calculates realistic latency based on geographic distance
- **Network Conditions**: Simulates various network conditions and packet loss
- **Real-time Simulation**: Updates data every 5 seconds with realistic variations

### API Classes

- **LatencyMonitor**: Singleton class for real-time latency monitoring
- **HistoricalDataAPI**: Manages historical data fetching and caching
- **NetworkPerformanceMonitor**: Browser network information and performance metrics

## 🚀 Performance Optimizations

### 3D Rendering

- **Efficient Markers**: Optimized marker rendering with proper cleanup
- **Animation Frame Management**: Proper requestAnimationFrame usage
- **Memory Management**: Cleanup of Three.js objects and event listeners

### Data Management

- **Memoization**: React.useMemo for expensive calculations
- **Debounced Updates**: Prevents excessive re-renders
- **Efficient Filtering**: Optimized data filtering and searching

### Mobile Optimization

- **Touch Events**: Optimized touch event handling
- **Reduced Animations**: Simplified animations on mobile devices
- **Efficient Scrolling**: Native scroll behavior with proper momentum

## 🧪 Testing Considerations

### Manual Testing Checklist

- [ ] 3D globe renders correctly in both themes
- [ ] Real-time latency updates work properly
- [ ] Mobile swipe gestures function smoothly
- [ ] Historical charts display accurate data
- [ ] Export functionality works for all formats
- [ ] Theme switching maintains state
- [ ] Responsive design works across all breakpoints

### Performance Testing

- [ ] 60fps animations on desktop
- [ ] Smooth performance on mobile devices
- [ ] Memory usage remains stable during long sessions
- [ ] Network requests are properly managed

## 🔒 Security Considerations

### API Security

- Environment variables for sensitive tokens
- No sensitive data exposed in client-side code
- Proper error handling for failed requests

### Data Privacy

- No personal data collection
- Mock data used for demonstration
- No external data transmission beyond Mapbox tiles

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token
```

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript strict mode
2. Use ESLint and Prettier for code formatting
3. Write meaningful commit messages
4. Test on multiple devices and browsers
5. Maintain responsive design principles

### Code Style

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use semantic HTML elements
- Maintain accessibility standards

## 📝 Assumptions Made

### Technical Assumptions

1. **Modern Browser Support**: Assumes support for WebGL, ES6+, and modern CSS features
2. **Network Connectivity**: Assumes stable internet connection for Mapbox tiles
3. **Device Capabilities**: Assumes devices can handle 3D rendering (fallbacks implemented)
4. **Screen Sizes**: Optimized for screens 320px and larger

### Data Assumptions

1. **Mock Data Accuracy**: Uses realistic but simulated latency data
2. **Geographic Accuracy**: Exchange locations based on publicly available information
3. **Cloud Region Data**: Based on official AWS, GCP, and Azure documentation
4. **Update Frequency**: 5-second intervals assumed optimal for real-time updates

### User Experience Assumptions

1. **Familiarity**: Users familiar with basic map interactions
2. **Touch Devices**: Mobile users expect native touch gestures
3. **Performance Expectations**: Users expect smooth 60fps animations
4. **Accessibility**: Users may need keyboard navigation and screen reader support

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Mock Data**: Uses simulated data instead of real latency measurements
2. **Browser Compatibility**: Requires WebGL support for 3D rendering
3. **Mobile Performance**: Complex 3D scenes may impact battery life
4. **Network Dependency**: Requires internet connection for map tiles

### Future Enhancements

1. **Real API Integration**: Connect to actual latency monitoring services
2. **WebRTC Latency**: Implement real peer-to-peer latency measurements
3. **Historical Data Storage**: Implement persistent data storage
4. **Advanced Analytics**: Add more sophisticated performance metrics
5. **User Accounts**: Add user authentication and personalized dashboards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox**: For providing excellent 3D mapping capabilities
- **Radix UI**: For accessible, unstyled UI primitives
- **Framer Motion**: For smooth, production-ready animations
- **Tailwind CSS**: For rapid UI development
- **Next.js Team**: For the excellent React framework
- **Cryptocurrency Exchanges**: For inspiration and public API documentation

## 📞 Support

For support, questions, or contributions:

- Create an issue on GitHub
- Check existing documentation
- Review the code comments for implementation details

## 📚 Code Documentation

### Core Components

#### MapboxGlobe.tsx

The main 3D globe visualization component using Mapbox GL JS.

```typescript
// Key features:
// - 3D globe projection with auto-rotation
// - Real-time latency connection visualization
// - Interactive markers for exchanges and cloud regions
// - Hover tooltips with detailed information
// - Cloud region boundaries with provider-specific styling

const MapboxGlobe = () => {
  // Initialize Mapbox map with globe projection
  const map = useRef<mapboxgl.Map | null>(null);

  // Handle theme changes and reinitialize map
  useEffect(() => {
    if (map.current) {
      map.current.remove();
    }

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

  // Add exchange markers with interactive popups
  const addExchangeMarkers = () => {
    exchanges.forEach((exchange) => {
      const marker = new mapboxgl.Marker(element)
        .setLngLat([exchange.coordinates[1], exchange.coordinates[0]])
        .addTo(map.current);
    });
  };

  // Add latency connections with animated lines
  const addLatencyConnections = () => {
    // Create GeoJSON features for connections
    // Add animated dashed lines
    // Handle hover interactions for tooltips
  };
};
```

#### MobileControlPanel.tsx

iOS-style swipe-up control panel for mobile devices.

```typescript
// Features:
// - Swipe gestures for open/close
// - Two main tabs: Control Panel and Advanced
// - Sub-navigation in Advanced panel
// - Persistent quick stats when collapsed

const MobileControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"control" | "advanced">("control");

  // Handle drag gestures
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

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={{ y: isOpen ? 0 : "calc(100% - 80px)" }}
    >
      {/* Control panel content */}
    </motion.div>
  );
};
```

#### HistoricalChart.tsx

Interactive historical latency data visualization.

```typescript
// Features:
// - Cryptocurrency selection dropdown
// - Time range filtering (1h, 24h, 7d, 30d)
// - Responsive Recharts integration
// - Statistics cards with color-coded values

const HistoricalChart = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeRange, setTimeRange] = useState(24);

  // Generate chart data based on selections
  const chartData = useMemo(() => {
    return historicalData.map((data) => ({
      time: format(new Date(data.timestamp), "HH:mm"),
      latency: data.latency,
      packetLoss: data.packetLoss,
    }));
  }, [historicalData, selectedCrypto, timeRange]);

  return (
    <Dialog open={showHistorical} onOpenChange={setShowHistorical}>
      <DialogContent className="max-w-7xl h-[90vh]">
        {/* Cryptocurrency selector */}
        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
          {cryptocurrencies.map((crypto) => (
            <SelectItem key={crypto.id} value={crypto.id}>
              {crypto.name}
            </SelectItem>
          ))}
        </Select>

        {/* Recharts visualization */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line dataKey="latency" stroke="#00FF88" strokeWidth={2} />
            <Line dataKey="packetLoss" stroke="#FF3366" yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      </DialogContent>
    </Dialog>
  );
};
```

### Custom Hooks

#### useRealTimeLatency.ts

Manages real-time latency data and network monitoring.

```typescript
// Features:
// - Real-time latency monitoring
// - Network performance metrics
// - Historical data management
// - Connection status tracking

export const useRealTimeLatency = () => {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize latency monitor
  useEffect(() => {
    const initializeMonitor = async () => {
      const monitor = LatencyMonitor.getInstance();

      // Subscribe to latency updates
      const unsubscribe = monitor.subscribe((data: LatencyData[]) => {
        setLatencyData(data);
        setIsConnected(true);
      });

      await monitor.start();
      return unsubscribe;
    };

    initializeMonitor();
  }, []);

  // Calculate statistics
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

  return {
    latencyData,
    statistics,
    isConnected,
    isPaused,
    toggleRealTime,
    pauseRealTime,
  };
};
```

#### useStore.ts

Global state management using Zustand.

```typescript
// State management for:
// - Selected exchange and cloud region
// - Filter settings (exchanges, providers, latency range)
// - UI state (real-time enabled, show historical, show heatmap)
// - Theme preferences

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
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setRealTimeEnabled: (enabled) => set({ realTimeEnabled: enabled }),
  setShowHistorical: (show) => set({ showHistorical: show }),
  setShowHeatmap: (show) => set({ showHeatmap: show }),
}));
```

### API Classes

#### LatencyMonitor (lib/api.ts)

Singleton class for real-time latency monitoring.

```typescript
// Features:
// - Singleton pattern for global instance
// - Real-time latency measurement
// - Network condition simulation
// - Subscriber pattern for data updates

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

  // Measure latency to external endpoints
  private async measureLatency(url: string): Promise<number> {
    const start = performance.now();
    try {
      await fetch(url, { method: "HEAD", mode: "no-cors" });
      return Math.round(performance.now() - start);
    } catch (error) {
      // Fallback to simulated latency
      return Math.round(Math.random() * 200 + 20);
    }
  }

  // Subscribe to latency updates
  subscribe(callback: (data: LatencyData[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // Start monitoring
  async start(): Promise<void> {
    this.isRunning = true;
    const interval = setInterval(async () => {
      if (this.isRunning) {
        const data = await this.measureNetworkLatency();
        this.notifySubscribers(data);
      }
    }, 5000);
  }
}
```

#### NetworkPerformanceMonitor (lib/api.ts)

Browser network information and performance metrics.

```typescript
// Features:
// - Network connection information
// - Page load performance metrics
// - Browser compatibility handling

export class NetworkPerformanceMonitor {
  // Get network connection information
  static async getNetworkInfo() {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      online: navigator.onLine,
    };
  }

  // Measure page load performance
  static async measurePageLoadPerformance() {
    if ("performance" in window) {
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
        firstContentfulPaint:
          performance
            .getEntriesByType("paint")
            .find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,
      };
    }
    return null;
  }
}
```

### Data Management

#### mockData.ts

Mock data generation with realistic latency calculations.

```typescript
// Features:
// - Haversine formula for distance calculation
// - Realistic latency based on geographic distance
// - Exchange and cloud region data
// - Historical data generation

// Calculate distance between two coordinates
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

// Generate realistic latency data
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

### TypeScript Interfaces

#### types/index.ts

Complete type definitions for the application.

```typescript
// Core data structures
export interface Exchange {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
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
  latency: number; // milliseconds
  timestamp: number;
  packetLoss: number; // percentage
}

export interface HistoricalData {
  exchangeId?: string;
  cloudRegionId?: string;
  timestamp: number;
  latency: number;
  packetLoss: number;
}

// Application state interface
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

  // Actions
  setSelectedExchange: (id: string | null) => void;
  setSelectedCloudRegion: (id: string | null) => void;
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  setShowHistorical: (show: boolean) => void;
  setShowHeatmap: (show: boolean) => void;
  toggleDarkMode: () => void;
}
```

### Utility Functions

#### lib/utils.ts

Common utility functions using clsx and tailwind-merge.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine and merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage example:
// cn("px-4 py-2", "bg-blue-500", { "text-white": isActive })
// Results in properly merged Tailwind classes
```

### Animation Patterns

#### Framer Motion Usage

Common animation patterns used throughout the application.

```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Stagger animations for lists
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Spring animations for mobile panel
const springConfig = {
  type: "spring",
  damping: 30,
  stiffness: 300,
};

// Usage in components
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={springConfig}
>
  {content}
</motion.div>;
```

### Performance Optimizations

#### React Optimization Patterns

```typescript
// Memoized calculations
const statistics = useMemo(
  () => ({
    avgLatency:
      latencyData.reduce((sum, data) => sum + data.latency, 0) /
      latencyData.length,
    activeConnections: latencyData.filter((data) => data.latency < 200).length,
  }),
  [latencyData]
);

// Memoized components
const MemoizedChart = React.memo(({ data, theme }) => {
  return <LineChart data={data} />;
});

// Debounced search
const debouncedSearch = useCallback(
  debounce((query: string) => {
    setSearchResults(performSearch(query));
  }, 300),
  []
);

// Cleanup effects
useEffect(() => {
  const interval = setInterval(updateData, 5000);
  return () => clearInterval(interval);
}, []);
```

### Error Handling Patterns

```typescript
// API error handling
try {
  const data = await fetchLatencyData();
  setLatencyData(data);
  setError(null);
} catch (error) {
  console.error("Failed to fetch latency data:", error);
  toast.error("Failed to load latency data");
  setError("Network connection failed");
  // Fallback to cached data
  setLatencyData(getCachedData());
}

// Component error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

**Built with ❤️ using Next.js, TypeScript, and Mapbox GL JS**
