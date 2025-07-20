"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { cloudRegions } from "@/data/mockData";
import { Cloud, Server, MapPin, Activity } from "lucide-react";

const CloudRegionVisualization = () => {
  const { filters, setSelectedCloudRegion, selectedCloudRegion } = useStore();
  const { latencyData } = useRealTimeLatency();

  const regionStats = useMemo(() => {
    return cloudRegions.map((region) => {
      const regionLatencies = latencyData.filter(
        (data) => data.cloudRegionId === region.id
      );
      
      const avgLatency = regionLatencies.length > 0
        ? Math.round(
            regionLatencies.reduce((sum, data) => sum + data.latency, 0) /
            regionLatencies.length
          )
        : 0;
      
      const connections = regionLatencies.length;
      const status = avgLatency < 100 ? "excellent" : avgLatency < 200 ? "good" : "poor";
      
      return {
        ...region,
        avgLatency,
        connections,
        status,
      };
    });
  }, [latencyData]);

  const filteredRegions = regionStats.filter((region) =>
    filters.cloudProviders.includes(region.provider)
  );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-yellow-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-400" />
          Cloud Regions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredRegions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedCloudRegion === region.id ? "default" : "ghost"}
              className="w-full p-3 h-auto justify-start bg-slate-800/50 hover:bg-slate-700/50"
              onClick={() => setSelectedCloudRegion(region.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getProviderColor(
                      region.provider
                    )}`}
                  />
                  <div className="text-left">
                    <div className="font-medium text-white text-sm">
                      {region.provider} {region.location}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {region.regionCode}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      region.avgLatency < 50
                        ? "default"
                        : region.avgLatency < 150
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {region.avgLatency}ms
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Server className="w-3 h-3" />
                    {region.connections}
                  </div>
                  <div className={`text-xs ${getStatusColor(region.status)}`}>
                    <Activity className="w-3 h-3 inline mr-1" />
                    {region.status}
                  </div>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
        
        {filteredRegions.length === 0 && (
          <div className="text-center py-4">
            <div className="text-slate-400 text-sm">No regions found</div>
            <div className="text-slate-500 text-xs mt-1">
              Adjust your filters to see cloud regions
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudRegionVisualization;