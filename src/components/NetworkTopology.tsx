"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { Network, ArrowRight, Zap, Clock } from "lucide-react";

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
  const { selectedExchange, selectedCloudRegion } = useStore();
  const { latencyData } = useRealTimeLatency();

  const connectionPaths = useMemo(() => {
    if (!selectedExchange && !selectedCloudRegion) return [];

    let filteredData = latencyData;

    if (selectedExchange) {
      filteredData = filteredData.filter(data => data.exchangeId === selectedExchange);
    }

    if (selectedCloudRegion) {
      filteredData = filteredData.filter(data => data.cloudRegionId === selectedCloudRegion);
    }

    return filteredData.map(data => {
      const exchange = exchanges.find(e => e.id === data.exchangeId);
      const region = cloudRegions.find(r => r.id === data.cloudRegionId);

      if (!exchange || !region) return null;

      // Simulate network path details
      const hops = Math.floor(Math.random() * 8) + 3;
      const bandwidth = ["1 Gbps", "10 Gbps", "100 Gbps"][Math.floor(Math.random() * 3)];

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
    }).filter(Boolean) as ConnectionPath[];
  }, [latencyData, selectedExchange, selectedCloudRegion]);

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return "text-green-400";
    if (latency < 150) return "text-yellow-400";
    return "text-red-400";
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "AWS": return "bg-orange-500";
      case "GCP": return "bg-blue-500";
      case "Azure": return "bg-cyan-400";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          Network Topology
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {connectionPaths.length > 0 ? (
          connectionPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-white font-medium text-sm">
                    {path.exchangeName}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <div className={`w-2 h-2 rounded-sm ${getProviderColor(path.provider)}`} />
                  <span className="text-white font-medium text-sm">
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
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400">Latency:</span>
                  <span className={getLatencyColor(path.latency)}>
                    {path.latency}ms
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400">Bandwidth:</span>
                  <span className="text-slate-300">{path.bandwidth}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Network className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400">Hops:</span>
                  <span className="text-slate-300">{path.hops}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Loss:</span>
                  <span className={
                    path.packetLoss < 1
                      ? "text-green-400"
                      : path.packetLoss < 3
                      ? "text-yellow-400"
                      : "text-red-400"
                  }>
                    {path.packetLoss.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Simulated network path visualization */}
              <div className="mt-3 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                {Array.from({ length: path.hops - 2 }, (_, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 h-px bg-slate-600" />
                    <div className="w-1 h-1 rounded-full bg-slate-500" />
                  </React.Fragment>
                ))}
                <div className="flex-1 h-px bg-slate-600" />
                <div className={`w-2 h-2 rounded-sm ${getProviderColor(path.provider)}`} />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Network className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400 text-sm mb-2">No topology data</div>
            <div className="text-slate-500 text-xs">
              Select an exchange or cloud region to view network paths
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkTopology;