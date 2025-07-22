"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  const [showMobileLegend, setShowMobileLegend] = useState(false);
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
      {/* gradient colors background  */}
      <motion.div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
        }`}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      />

      {/* Globe visualization Component*/}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <MapboxGlobe />
        </Suspense>
      </div>

      {/* Draggable Mobile Control Panel */}
      <MobileControlPanel />

      {/* Control Panel  for  large screens*/}
      <div className="hidden md:block">
        <ControlPanel />
      </div>

      {/* Historical Chart Compoenet*/}
      <HistoricalChart />

      {/* Advanced Panels for extra Network Topology and region details, Network status*/}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-20 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 space-y-4 hidden lg:block"
          >
            <CloudRegionVisualization />{" "}
            {/* Cloud Region Component for showing the region related data*/}
            <PerformanceDashboard />{" "}
            {/* Performance related stats shown in this component*/}
            <NetworkTopology />{" "}
            {/* Network related all info shows in this component */}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header  for showing the assessment Title and a small info */}
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
              {/* in mobile view doesn't show the Legend info so this will help when user click help icon */}
              <Dialog
                open={showMobileLegend}
                onOpenChange={setShowMobileLegend}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`lg:hidden h-8 w-8 md:h-10 md:w-10 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white"
                        : "hover:bg-black/10 text-slate-900"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`max-w-xs  transition-colors ${
                    isDark
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-slate-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <h3
                        className={`font-semibold mb-3 text-sm ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        Latency Legend
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-400 flex-shrink-0"></div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}
                          >
                            &lt; 50ms - Excellent
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-amber-400 flex-shrink-0"></div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}
                          >
                            50-150ms - Good
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-red-400 flex-shrink-0"></div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}
                          >
                            &gt; 150ms - Poor
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`pt-3 border-t ${
                        isDark ? "border-slate-700" : "border-slate-300"
                      }`}
                    >
                      <h4
                        className={`font-medium mb-3 text-sm ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        Markers
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-400 flex-shrink-0"></div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}
                          >
                            Crypto Exchanges
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-400 flex-shrink-0"></div>
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}
                          >
                            Cloud Regions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`pt-3 border-t ${
                        isDark ? "border-slate-700" : "border-slate-300"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          isDark ? "text-slate-400" : "text-slate-700"
                        }`}
                      >
                        Live network monitoring
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Them related Toggle for large screens */}
              <ThemeToggle />
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-md transition-colors hidden lg:block h-8 w-8 md:h-10 md:w-10 ${
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-slate-900"
                }`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
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

      {/* Legend for large screens */}
      <Legend />
    </div>
  );
}
