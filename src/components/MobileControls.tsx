"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import {
  Menu,
  X,
  Activity,
  Search,
  Filter,
  Settings,
  TrendingUp,
  Cloud,
  Layers,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const MobileControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const { statistics, isConnected } = useRealTimeLatency();
  const { realTimeEnabled, showHeatmap, setShowHeatmap } = useStore();

  const tabs = [
    { id: "status", label: "Status", icon: Activity },
    { id: "search", label: "Search", icon: Search },
    { id: "filters", label: "Filters", icon: Filter },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/40 backdrop-blur-md border-slate-700/50 text-white hover:bg-black/60"
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
            className="fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 z-50 md:hidden overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Controls</h2>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 mb-4 bg-slate-800/50 rounded-lg p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1 text-xs"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {tab.label}
                    </Button>
                  );
                })}
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
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">Status</span>
                          <Badge variant={isConnected ? "default" : "destructive"}>
                            {isConnected ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">Avg Latency</span>
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
                          <span className="text-slate-300 text-sm">Connections</span>
                          <span className="text-green-400 font-mono text-sm">
                            {statistics.activeConnections}/{statistics.totalConnections}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">Real-time</span>
                          <Badge variant={realTimeEnabled ? "default" : "secondary"}>
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
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 text-sm"
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
                        <h4 className="text-white font-medium mb-2 text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Exchanges
                        </h4>
                        <div className="space-y-2">
                          {["Binance", "Coinbase", "Kraken"].map((exchange) => (
                            <div key={exchange} className="flex items-center justify-between">
                              <span className="text-slate-300 text-sm">{exchange}</span>
                              <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2 text-sm flex items-center gap-2">
                          <Cloud className="w-4 h-4" />
                          Providers
                        </h4>
                        <div className="space-y-2">
                          {["AWS", "GCP", "Azure"].map((provider) => (
                            <div key={provider} className="flex items-center justify-between">
                              <span className="text-slate-300 text-sm">{provider}</span>
                              <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Heatmap</span>
                        <input
                          type="checkbox"
                          checked={showHeatmap}
                          onChange={(e) => setShowHeatmap(e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Auto-rotate</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Animations</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Export Data
                      </Button>
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
          className="bg-black/40 backdrop-blur-md rounded-lg border border-slate-700/50 p-3"
        >
          <div className="flex justify-between items-center text-white text-xs">
            <div className="text-center">
              <div className="font-bold">{statistics.avgLatency}ms</div>
              <div className="text-slate-400">Avg</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{statistics.activeConnections}</div>
              <div className="text-slate-400">Active</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{statistics.avgPacketLoss}%</div>
              <div className="text-slate-400">Loss</div>
            </div>
            <div className="text-center">
              <div className={`font-bold ${isConnected ? "text-green-400" : "text-red-400"}`}>
                {isConnected ? "●" : "○"}
              </div>
              <div className="text-slate-400">Status</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MobileControls;