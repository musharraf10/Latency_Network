"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import NetworkStatus from "./NetworkStatus";
import SearchPanel from "./SearchPanel";
import ExportDialog from "./ExportDialog";
import CryptoTransactionCreator from "./CryptoTransactionCreator";
import CloudRegionVisualization from "./CloudRegionVisualization";
import PerformanceDashboard from "./PerformanceDashboard";
import NetworkTopology from "./NetworkTopology";
import {
  Activity,
  Cloud,
  TrendingUp,
  Settings,
  ChevronUp,
  ChevronDown,
  Layers,
  BarChart3,
  Network,
  Grip,
} from "lucide-react";

const MobileControlPanel = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"control" | "advanced">("control");
  const [advancedSubTab, setAdvancedSubTab] = useState<"regions" | "performance" | "topology">("regions");
  const [dragY, setDragY] = useState(0);

  const {
    filters,
    realTimeEnabled,
    showHistorical,
    showHeatmap,
    setFilters,
    setRealTimeEnabled,
    setShowHistorical,
    setShowHeatmap,
    selectedExchange,
  } = useStore();

  const {
    latencyData,
    refreshData,
    toggleRealTime,
    pauseRealTime,
    isPaused,
    isLoading,
    statistics,
    isConnected,
  } = useRealTimeLatency();

  const handleDrag = (event: any, info: PanInfo) => {
    setDragY(info.offset.y);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      setIsOpen(false);
    } else if (info.offset.y < -100 && !isOpen) {
      setIsOpen(true);
    }
    setDragY(0);
  };

  const handleExchangeToggle = (exchangeId: string) => {
    const newExchanges = filters.exchanges.includes(exchangeId)
      ? filters.exchanges.filter((id) => id !== exchangeId)
      : [...filters.exchanges, exchangeId];
    setFilters({ exchanges: newExchanges });
  };

  const handleProviderToggle = (provider: "AWS" | "GCP" | "Azure") => {
    const newProviders = filters.cloudProviders.includes(provider)
      ? filters.cloudProviders.filter((p) => p !== provider)
      : [...filters.cloudProviders, provider];
    setFilters({ cloudProviders: newProviders });
  };

  const handleRealTimeToggle = (enabled: boolean) => {
    setRealTimeEnabled(enabled);
    toggleRealTime(enabled);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl border-t transition-colors ${
          isDark
            ? "bg-slate-900/95 border-slate-700/50"
            : "bg-white/95 border-slate-300/50"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        initial={{ y: "calc(100% - 80px)" }}
        animate={{
          y: isOpen ? 0 : "calc(100% - 80px)",
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div
            className={`w-10 h-1 rounded-full transition-colors ${
              isDark ? "bg-slate-600" : "bg-slate-400"
            }`}
          />
        </div>

        {/* Header */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full transition-colors ${
                  isDark ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <Grip className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`} />
              </div>
              <div>
                <h2 className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                  Control Center
                </h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Network monitoring controls
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats (Always Visible) */}
        {!isOpen && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                  {statistics.avgLatency}ms
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Latency
                </div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                  {statistics.activeConnections}
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Active
                </div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                  {statistics.avgPacketLoss}%
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Loss
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`font-bold text-lg ${
                    isConnected ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isConnected ? "●" : "○"}
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Status
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content (When Open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 pb-6 max-h-[70vh] overflow-hidden"
            >
              {/* Main Tabs */}
              <div className={`flex gap-1 mb-6 rounded-xl p-1 transition-colors ${
                isDark ? "bg-slate-800/50" : "bg-slate-200/50"
              }`}>
                <Button
                  variant={activeTab === "control" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("control")}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Control Panel
                </Button>
                <Button
                  variant={activeTab === "advanced" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("advanced")}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Advanced
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(70vh-120px)]">
                <AnimatePresence mode="wait">
                  {activeTab === "control" && (
                    <motion.div
                      key="control"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Network Status */}
                      <NetworkStatus />

                      {/* Search Panel */}
                      <SearchPanel />

                      {/* Historical Chart Button */}
                      <Button
                        variant={showHistorical ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => setShowHistorical(!showHistorical)}
                        disabled={!selectedExchange}
                      >
                        Show Historical Data
                      </Button>

                      {/* Exchanges Filter */}
                      <Card className={`transition-colors ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-slate-100/50 border-slate-300/50"
                      }`}>
                        <CardHeader className="pb-3">
                          <CardTitle className={`flex items-center gap-2 text-base ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            Exchanges
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            variant={filters.exchanges.length === 0 ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setFilters({ exchanges: [] })}
                          >
                            All Exchanges
                          </Button>
                          {exchanges.slice(0, 6).map((exchange) => (
                            <div
                              key={exchange.id}
                              className="flex items-center justify-between"
                            >
                              <span className={`text-sm ${
                                isDark ? "text-slate-300" : "text-slate-600"
                              }`}>
                                {exchange.name}
                              </span>
                              <Switch
                                checked={
                                  filters.exchanges.length === 0 ||
                                  filters.exchanges.includes(exchange.id)
                                }
                                onCheckedChange={() => handleExchangeToggle(exchange.id)}
                              />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Cloud Providers Filter */}
                      <Card className={`transition-colors ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-slate-100/50 border-slate-300/50"
                      }`}>
                        <CardHeader className="pb-3">
                          <CardTitle className={`flex items-center gap-2 text-base ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            <Cloud className="w-4 h-4 text-blue-400" />
                            Cloud Providers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {(["AWS", "GCP", "Azure"] as const).map((provider) => (
                            <div key={provider} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    provider === "AWS"
                                      ? "bg-orange-500"
                                      : provider === "GCP"
                                      ? "bg-blue-500"
                                      : "bg-cyan-400"
                                  }`}
                                />
                                <span className={`text-sm ${
                                  isDark ? "text-slate-300" : "text-slate-600"
                                }`}>
                                  {provider}
                                </span>
                              </div>
                              <Switch
                                checked={filters.cloudProviders.includes(provider)}
                                onCheckedChange={() => handleProviderToggle(provider)}
                              />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Controls */}
                      <Card className={`transition-colors ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-slate-100/50 border-slate-300/50"
                      }`}>
                        <CardHeader className="pb-3">
                          <CardTitle className={`flex items-center gap-2 text-base ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            <Settings className="w-4 h-4 text-slate-400" />
                            Controls
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Real-time Toggle */}
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                              Real-time Updates
                            </span>
                            <Switch
                              checked={realTimeEnabled}
                              onCheckedChange={handleRealTimeToggle}
                            />
                          </div>

                          {/* Pause/Resume Toggle */}
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                              {isPaused ? "Resume Updates" : "Pause Updates"}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={pauseRealTime}
                              disabled={!realTimeEnabled}
                              className="h-8"
                            >
                              {isPaused ? "Resume" : "Pause"}
                            </Button>
                          </div>

                          {/* Heatmap Toggle */}
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                              Latency Heatmap
                            </span>
                            <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                          </div>

                          {/* Latency Range Filter */}
                          <div className="space-y-2">
                            <span className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                              Latency Range
                            </span>
                            <div className={`flex justify-between text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                              <span>{filters.latencyRange[0]}ms</span>
                              <span>{filters.latencyRange[1]}ms</span>
                            </div>
                            <Slider
                              value={filters.latencyRange}
                              onValueChange={(value) =>
                                setFilters({ latencyRange: value as [number, number] })
                              }
                              max={500}
                              min={0}
                              step={10}
                              className="w-full"
                            />
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={refreshData}
                            disabled={isLoading}
                          >
                            Refresh Data
                          </Button>

                          <div className="space-y-2">
                            <ExportDialog />
                            <CryptoTransactionCreator />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "advanced" && (
                    <motion.div
                      key="advanced"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Advanced Sub Tabs */}
                      <div className={`flex gap-1 rounded-lg p-1 transition-colors ${
                        isDark ? "bg-slate-800/50" : "bg-slate-200/50"
                      }`}>
                        <Button
                          variant={advancedSubTab === "regions" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setAdvancedSubTab("regions")}
                          className="flex-1 text-xs"
                        >
                          <Layers className="w-3 h-3 mr-1" />
                          Regions
                        </Button>
                        <Button
                          variant={advancedSubTab === "performance" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setAdvancedSubTab("performance")}
                          className="flex-1 text-xs"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          Performance
                        </Button>
                        <Button
                          variant={advancedSubTab === "topology" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setAdvancedSubTab("topology")}
                          className="flex-1 text-xs"
                        >
                          <Network className="w-3 h-3 mr-1" />
                          Topology
                        </Button>
                      </div>

                      {/* Advanced Content */}
                      <AnimatePresence mode="wait">
                        {advancedSubTab === "regions" && (
                          <motion.div
                            key="regions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <CloudRegionVisualization />
                          </motion.div>
                        )}

                        {advancedSubTab === "performance" && (
                          <motion.div
                            key="performance"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <PerformanceDashboard />
                          </motion.div>
                        )}

                        {advancedSubTab === "topology" && (
                          <motion.div
                            key="topology"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <NetworkTopology />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MobileControlPanel;