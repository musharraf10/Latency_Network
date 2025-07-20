"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ControlPanel from "@/components/ControlPanel";
import HistoricalChart from "@/components/HistoricalChart";
import MobileControls from "@/components/MobileControls";
import CloudRegionVisualization from "@/components/CloudRegionVisualization";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import NetworkTopology from "@/components/NetworkTopology";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

// Dynamically import Globe component to avoid SSR issues with Three.js
const Globe = dynamic(() => import("@/components/MapboxGlobe"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`h-screen w-full relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    }`}>
      {/* Background gradient */}
      <motion.div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
            : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
        }`}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      />

      {/* Globe visualization */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <MapboxGlobe />
        </Suspense>
      </div>

      {/* Mobile Controls */}
      <MobileControls />

      {/* Control Panel */}
      <div className="hidden md:block">
        <ControlPanel />
      </div>

      {/* Historical Chart Modal */}
      <HistoricalChart />

      {/* Advanced Panels */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 space-y-4 hidden lg:block"
          >
            <CloudRegionVisualization />
            <PerformanceDashboard />
            <NetworkTopology />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <motion.div 
        className="absolute top-4 right-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className={`backdrop-blur-md rounded-lg px-4 py-2 border transition-colors ${
          isDark 
            ? "bg-black/40 border-slate-700/50 text-white" 
            : "bg-white/40 border-slate-300/50 text-slate-900"
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-lg">
            Latency Topology Visualizer
          </h1>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Real-time network latency between crypto exchanges and cloud regions
          </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-md transition-colors hidden lg:block ${
                  isDark 
                    ? "hover:bg-white/10 text-white" 
                    : "hover:bg-black/10 text-slate-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className={`backdrop-blur-md rounded-lg p-4 border transition-colors ${
          isDark 
            ? "bg-black/40 border-slate-700/50 text-white" 
            : "bg-white/40 border-slate-300/50 text-slate-900"
        }`}>
          <h3 className="font-semibold mb-3">Latency Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                &lt; 50ms - Excellent
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>50-150ms - Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>> 150ms - Poor</span>
            </div>
          </div>

          <div className={`mt-4 pt-3 border-t ${isDark ? "border-slate-700" : "border-slate-300"}`}>
            <h4 className="font-medium mb-2">Markers</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>Crypto Exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>Cloud Regions</span>
              </div>
            </div>
          </div>

          <div className={`mt-3 pt-3 border-t ${isDark ? "border-slate-700" : "border-slate-300"}`}>
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <div>Real-time API integration</div>
              <div>Live network monitoring</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
