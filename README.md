# Latency Topology Visualizer

Application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

![Latency Topology Visualizer](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop)

## Features

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

## Installation & Setup

### Prerequisites

- Node.js 18.0 above version
- npm package manager
- Mapbox account and access token

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/musharraf10/Latency_Network.git
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

---

Thank You...😊
