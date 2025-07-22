# Latency Topology Visualizer

A Next.js application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

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
- **Regional Boundaries**: Dashed boundary lines showing provider territories
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
- **iOS-style Control Panel**: Swipe-up interface similar to iOS Control Center
- **Responsive Design**: Optimized for all screen sizes
- **Touch Gestures**: Native mobile interactions
- **Quick Stats**: Always-visible key metrics

### Crypto Transaction Creator
- **Interactive Route Creation**: Click points on globe to create routes
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
- **@react-three/drei 9.120.4**: Useful helpers for Three.js

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
- npm or yarn package manager
- Mapbox account and access token

### Environment Setup
1. Clone the repository:
```bash
git clone https://github.com/your-username/latency-topology-visualizer.git
cd latency-topology-visualizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
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
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

#### Linting
```bash
npm run lint
# or
yarn lint
```

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
style: isDark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"
projection: { name: "globe" }
center: [0, 20]
zoom: 1.5
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

### Mock Data Generation
The application uses sophisticated mock data generation for demonstration:

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

---

**Built with ❤️ using Next.js, TypeScript, and Mapbox GL JS**