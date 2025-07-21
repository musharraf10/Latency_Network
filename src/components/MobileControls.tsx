"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { useLatencyData } from "@/hooks/useLatencyData";
import ExportDialog from "./ExportDialog";
import {
  Menu,
  X,
  Activity,
  Search,
  Filter,
  Settings,
  TrendingUp,
  Cloud,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import CryptoTransactionCreator from "./CryptoTransactionCreator";

const MobileControls = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const { statistics, isConnected } = useRealTimeLatency();
  const { realTimeEnabled, showHeatmap, setShowHeatmap, filters, setFilters } =
    useStore();
  const { latencyData } = useLatencyData();

  const tabs = [
    { id: "status", label: "Status", icon: Activity },
    { id: "search", label: "Search", icon: Search },
    { id: "filters", label: "Filters", icon: Filter },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`backdrop-blur-md shadow-lg transition-colors ${
            isDark
              ? "bg-black/40 border-slate-700/50 text-white hover:bg-black/60"
              : "bg-white/40 border-slate-300/50 text-slate-900 hover:bg-white/60"
          }`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-80 backdrop-blur-md border-r z-50 md:hidden overflow-y-auto transition-colors ${
              isDark
                ? "bg-slate-900/95 border-slate-700/50"
                : "bg-white/95 border-slate-300/50"
            }`}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`font-bold text-lg ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Controls
                </h2>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className={
                      isDark
                        ? "text-white hover:bg-slate-800"
                        : "text-slate-900 hover:bg-slate-100"
                    }
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div
                className={`flex gap-1 mb-4 rounded-lg p-1 transition-colors ${
                  isDark ? "bg-slate-800/50" : "bg-slate-200/50"
                }`}
              >
                <div
                  className="flex overflow-x-auto"
                  style={{
                    scrollbarWidth: "auto",
                    scrollbarColor: "#ccc #f0f0f0",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "scrollbar",
                  }}
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-shrink-0 text-xs"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "status" && (
                    <Card
                      className={`transition-colors ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-slate-100/50 border-slate-300/50"
                      }`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            Status
                          </span>
                          <Badge
                            variant={isConnected ? "default" : "destructive"}
                          >
                            {isConnected ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            Avg Latency
                          </span>
                          <Badge
                            variant={
                              statistics.avgLatency < 50
                                ? "default"
                                : statistics.avgLatency < 150
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {statistics.avgLatency}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            Connections
                          </span>
                          <span className="text-green-400 font-mono text-sm font-medium">
                            {statistics.activeConnections}/
                            {statistics.totalConnections}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            Real-time
                          </span>
                          <Badge
                            variant={realTimeEnabled ? "default" : "secondary"}
                          >
                            {realTimeEnabled ? "Active" : "Paused"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === "search" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Search exchanges or regions..."
                        className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                          isDark
                            ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                            : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                        }`}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Binance
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          AWS
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Singapore
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Europe
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === "filters" && (
                    <div className="space-y-4">
                      <div>
                        <h4
                          className={`font-medium mb-2 text-sm flex items-center gap-2 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          <TrendingUp className="w-4 h-4" />
                          Exchanges
                        </h4>
                        <div className="space-y-2">
                          {["binance", "coinbase", "kraken", "wazirx"].map(
                            (exchangeId) => {
                              const exchangeNames = {
                                binance: "Binance",
                                coinbase: "Coinbase",
                                kraken: "Kraken",
                                wazirx: "WazirX",
                              };
                              return (
                                <div
                                  key={exchangeId}
                                  className="flex items-center justify-between"
                                >
                                  <span
                                    className={`text-sm ${
                                      isDark
                                        ? "text-slate-300"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {
                                      exchangeNames[
                                        exchangeId as keyof typeof exchangeNames
                                      ]
                                    }
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={
                                      filters.exchanges.length === 0 ||
                                      filters.exchanges.includes(exchangeId)
                                    }
                                    onChange={() =>
                                      handleExchangeToggle(exchangeId)
                                    }
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`font-medium mb-2 text-sm flex items-center gap-2 ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          <Cloud className="w-4 h-4" />
                          Providers
                        </h4>
                        <div className="space-y-2">
                          {["AWS", "GCP", "Azure"].map((provider) => (
                            <div
                              key={provider}
                              className="flex items-center justify-between"
                            >
                              <span
                                className={`text-sm ${
                                  isDark ? "text-slate-300" : "text-slate-600"
                                }`}
                              >
                                {provider}
                              </span>
                              <input
                                type="checkbox"
                                className="rounded"
                                checked={filters.cloudProviders.includes(
                                  provider as "AWS" | "GCP" | "Azure"
                                )}
                                onChange={() =>
                                  handleProviderToggle(
                                    provider as "AWS" | "GCP" | "Azure"
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          Heatmap
                        </span>
                        <input
                          type="checkbox"
                          checked={showHeatmap}
                          onChange={(e) => setShowHeatmap(e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          Auto-rotate
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          Animations
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <h4
                              className={`font-medium text-sm ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              Tools
                            </h4>
                            <div className="space-y-2">
                              <ExportDialog />
                              <CryptoTransactionCreator />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Quick Stats */}
      <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`backdrop-blur-md rounded-lg border p-3 transition-colors ${
            isDark
              ? "bg-black/40 border-slate-700/50"
              : "bg-white/40 border-slate-300/50"
          }`}
        >
          <div
            className={`flex justify-between items-center text-xs font-medium transition-colors ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            <div className="text-center">
              <div className="font-bold text-sm">{statistics.avgLatency}ms</div>
              <div
                className={`text-xs transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Avg
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm">
                {statistics.activeConnections}
              </div>
              <div
                className={`text-xs transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Active
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm">
                {statistics.avgPacketLoss}%
              </div>
              <div
                className={`text-xs transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Loss
              </div>
            </div>
            <div className="text-center">
              <div
                className={`font-bold ${
                  isConnected ? "text-green-400" : "text-red-400"
                }`}
              >
                {isConnected ? "●" : "○"}
              </div>
              <div
                className={`text-xs transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Status
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MobileControls;
