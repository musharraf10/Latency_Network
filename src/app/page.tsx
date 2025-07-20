"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import ControlPanel from "@/components/ControlPanel";
import HistoricalChart from "@/components/HistoricalChart";
import MapboxGlobe from "@/components/MapboxGlobe";

// Dynamically import Globe component to avoid SSR issues with Three.js
const Globe = dynamic(() => import("@/components/MapboxGlobe"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="h-screen w-full relative overflow-hidden bg-slate-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Globe visualization */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <MapboxGlobe />
        </Suspense>
      </div>

      {/* Control Panel */}
      <ControlPanel />

      {/* Historical Chart Modal */}
      <HistoricalChart />

      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-700/50">
          <h1 className="text-white font-bold text-lg">
            Latency Topology Visualizer
          </h1>
          <p className="text-slate-300 text-sm">
            Real-time network latency between crypto exchanges and cloud regions
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-3">Latency Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-slate-300 text-sm">
                &lt; 50ms - Excellent
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-slate-300 text-sm">50-150ms - Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-slate-300 text-sm">&gt; 150ms - Poor</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700">
            <h4 className="text-white font-medium mb-2">Markers</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-slate-300 text-xs">Crypto Exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-slate-300 text-xs">Cloud Regions</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              <div>Real-time API integration</div>
              <div>Live network monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
