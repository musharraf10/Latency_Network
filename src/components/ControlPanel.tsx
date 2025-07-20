"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { Activity, Cloud, TrendingUp, Settings, Layers } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import NetworkStatus from "./NetworkStatus";
import SearchPanel from "./SearchPanel";
import ExportDialog from "./ExportDialog";
import CryptoTransactionCreator from "./CryptoTransactionCreator";

const ControlPanel = () => {
  const { isDark } = useTheme();
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

  const { latencyData, refreshData, toggleRealTime, pauseRealTime, isPaused, isLoading } =
    useRealTimeLatency();

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
    <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 space-y-4">
        {/* Network Status */}
        <NetworkStatus />

        {/* Search Panel */}
        <SearchPanel />

        {/* Exchanges Filter */}
        <Card className={`backdrop-blur-md transition-colors ${
          isDark 
            ? "bg-black/40 border-slate-700/50" 
            : "bg-white/40 border-slate-300/50"
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <TrendingUp className="w-5 h-5 text-green-400" />
              Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={filters.exchanges.length === 0 ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => setFilters({ exchanges: [] })}
            >
              All Exchanges
            </Button>
            {exchanges.map((exchange) => (
              <div
                key={exchange.id}
                className="flex items-center justify-between"
              >
                <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{exchange.name}</span>
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
        <Card className={`backdrop-blur-md transition-colors ${
          isDark 
            ? "bg-black/40 border-slate-700/50" 
            : "bg-white/40 border-slate-300/50"
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Cloud className="w-5 h-5 text-blue-400" />
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
                  <span className="text-slate-300 text-sm">{provider}</span>
                  <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{provider}</span>
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
        <Card className={`backdrop-blur-md transition-colors ${
          isDark 
            ? "bg-black/40 border-slate-700/50" 
            : "bg-white/40 border-slate-300/50"
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Settings className="w-5 h-5 text-slate-400" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Real-time Toggle */}
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Real-time Updates</span>
              <Switch
                checked={realTimeEnabled}
                onCheckedChange={handleRealTimeToggle}
              />
            </div>

            {/* Pause/Resume Toggle */}
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
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
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Latency Heatmap</span>
              <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
            </div>

            {/* Latency Range Filter */}
            <div className="space-y-2">
              <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Latency Range</span>
              <div className={`flex justify-between text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
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

            <Button
              variant={showHistorical ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => setShowHistorical(!showHistorical)}
              disabled={!selectedExchange}
            >
              Show Historical Data
            </Button>

            <ExportDialog />

            <CryptoTransactionCreator />
          </CardContent>
        </Card>
    </div>
  );
};

export default ControlPanel;
