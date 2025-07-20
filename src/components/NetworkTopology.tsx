"use client";

import { useMemo } from "react";
import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { Network, ArrowRight, Zap, Clock, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ConnectionPath {
  id: string;
  exchangeName: string;
  regionName: string;
  provider: string;
  latency: number;
  packetLoss: number;
  hops: number;
  bandwidth: string;
}

const NetworkTopology = () => {
  const { isDark } = useTheme();
  const { selectedExchange, selectedCloudRegion } = useStore();
  const { latencyData } = useRealTimeLatency();
  const [searchQuery, setSearchQuery] = useState("");

  const connectionPaths = useMemo(() => {
    if (!selectedExchange && !selectedCloudRegion) return [];

    let filteredData = latencyData;

    if (selectedExchange) {
      filteredData = filteredData.filter(
        (data) => data.exchangeId === selectedExchange
      );
    }

    if (selectedCloudRegion) {
      filteredData = filteredData.filter(
        (data) => data.cloudRegionId === selectedCloudRegion
      );
    }

    return filteredData
      .map((data) => {
        const exchange = exchanges.find((e) => e.id === data.exchangeId);
        const region = cloudRegions.find((r) => r.id === data.cloudRegionId);

        if (!exchange || !region) return null;

        // Simulate network path details
        const hops = Math.floor(Math.random() * 8) + 3;
        const bandwidth = ["1 Gbps", "10 Gbps", "100 Gbps"][
          Math.floor(Math.random() * 3)
        ];

        return {
          id: `${data.exchangeId}-${data.cloudRegionId}`,
          exchangeName: exchange.name,
          regionName: `${region.provider} ${region.location}`,
          provider: region.provider,
          latency: data.latency,
          packetLoss: data.packetLoss,
          hops,
          bandwidth,
        };
      })
      .filter(Boolean) as ConnectionPath[];
  }, [latencyData, selectedExchange, selectedCloudRegion]);

  const filteredPaths = useMemo(() => {
    if (!searchQuery.trim()) return connectionPaths;
    
    const query = searchQuery.toLowerCase();
    return connectionPaths.filter(
      (path) =>
        path.exchangeName.toLowerCase().includes(query) ||
        path.regionName.toLowerCase().includes(query) ||
        path.provider.toLowerCase().includes(query)
    );
  }, [connectionPaths, searchQuery]);

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return "text-green-400";
    if (latency < 150) return "text-yellow-400";
    return "text-red-400";
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "AWS":
        return "bg-orange-500";
      case "GCP":
        return "bg-blue-500";
      case "Azure":
        return "bg-cyan-400";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className={`backdrop-blur-md transition-colors ${
      isDark 
        ? "bg-black/40 border-slate-700/50" 
        : "bg-white/40 border-slate-300/50"
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <Network className="w-5 h-5 text-cyan-400" />
          Network Topology
        </CardTitle>
        
        {/* Search Input */}
        <div className="relative mt-3">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`} />
          <Input
            placeholder="Search exchanges or regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 transition-colors ${
              isDark 
                ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400" 
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
            }`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredPaths.length > 0 ? (
          filteredPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg p-3 border transition-colors ${
                isDark 
                  ? "bg-slate-800/50 border-slate-700/30" 
                  : "bg-slate-100/50 border-slate-300/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                    {path.exchangeName}
                  </span>
                  <ArrowRight className={`w-3 h-3 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <div
                    className={`w-2 h-2 rounded-sm ${getProviderColor(
                      path.provider
                    )}`}
                  />
                  <span className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                    {path.regionName}
                  </span>
                </div>
                <Badge
                  variant={
                    path.latency < 50
                      ? "default"
                      : path.latency < 150
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {path.latency}ms
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className={`w-3 h-3 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Latency:</span>
                  <span className={getLatencyColor(path.latency)}>
                    {path.latency}ms
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className={`w-3 h-3 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Bandwidth:</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{path.bandwidth}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Network className={`w-3 h-3 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Hops:</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-600"}>{path.hops}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Loss:</span>
                  <span
                    className={
                      path.packetLoss < 1
                        ? "text-green-400"
                        : path.packetLoss < 3
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {path.packetLoss.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Simulated network path visualization */}
              <div className="mt-3 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                {Array.from({ length: path.hops - 2 }, (_, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex-1 h-px ${isDark ? "bg-slate-600" : "bg-slate-400"}`} />
                    <div className={`w-1 h-1 rounded-full ${isDark ? "bg-slate-500" : "bg-slate-400"}`} />
                  </React.Fragment>
                ))}
                <div className={`flex-1 h-px ${isDark ? "bg-slate-600" : "bg-slate-400"}`} />
                <div
                  className={`w-2 h-2 rounded-sm ${getProviderColor(
                    path.provider
                  )}`}
                />
              </div>
            </motion.div>
          ))
        ) : searchQuery.trim() ? (
          <div className="text-center py-8">
            <Search className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
            <div className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              No results found for "{searchQuery}"
            </div>
            <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              Try searching for different exchange or region names
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Network className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
            <div className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>No topology data</div>
            <div className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              Select an exchange or cloud region to view network paths
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkTopology;
