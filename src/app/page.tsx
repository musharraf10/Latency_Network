"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ControlPanel from "@/components/ControlPanel";
import HistoricalChart from "@/components/HistoricalChart";
import MobileControlPanel from "@/components/MobileControlPanel";
import CloudRegionVisualization from "@/components/CloudRegionVisualization";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import NetworkTopology from "@/components/NetworkTopology";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import MapboxGlobe from "@/components/MapboxGlobe";
import Legend from "@/components/Legend";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isDark } = useTheme();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div
      className={`h-screen w-full relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      }`}
    >
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

      {/* Mobile Control Panel */}
      <MobileControlPanel />

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
            className="absolute top-20 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 space-y-4 hidden lg:block"
          >
            <CloudRegionVisualization />
            <PerformanceDashboard />
            <NetworkTopology />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <motion.div
        className="absolute top-4 right-4 z-10 max-w-[calc(100vw-5rem)] md:max-w-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className={`backdrop-blur-md rounded-lg px-3 md:px-4 py-2 border transition-colors ${
            isDark
              ? "bg-black/40 border-slate-700/50 text-white"
              : "bg-white/40 border-slate-300/50 text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div>
              <h1 className="font-bold text-sm md:text-lg">
                Latency Topology Visualizer
              </h1>
              <p
                className={`text-xs md:text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Real-time network latency between crypto exchanges and cloud
                regions
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <Legend />
    </div>
  );
}
