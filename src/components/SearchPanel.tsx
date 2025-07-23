"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { Search, MapPin, TrendingUp } from "lucide-react";

const SearchPanel = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { setSelectedExchange, setSelectedCloudRegion } = useStore();
  const { latencyData } = useRealTimeLatency();

  // Fuzzy search implementation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { exchanges: [], regions: [] };

    const query = searchQuery.toLowerCase();

    const matchedExchanges = exchanges.filter(
      (exchange) =>
        exchange.name.toLowerCase().includes(query) ||
        exchange.region.toLowerCase().includes(query) ||
        exchange.id.toLowerCase().includes(query)
    );

    const matchedRegions = cloudRegions.filter(
      (region) =>
        region.location.toLowerCase().includes(query) ||
        region.provider.toLowerCase().includes(query) ||
        region.regionCode.toLowerCase().includes(query)
    );

    return { exchanges: matchedExchanges, regions: matchedRegions };
  }, [searchQuery]);

  // Get latency data for search results
  const getLatencyForExchange = (exchangeId: string) => {
    const exchangeLatencies = latencyData.filter(
      (data) => data.exchangeId === exchangeId
    );
    if (exchangeLatencies.length === 0) return null;

    const avgLatency =
      exchangeLatencies.reduce((sum, data) => sum + data.latency, 0) /
      exchangeLatencies.length;
    const minLatency = Math.min(
      ...exchangeLatencies.map((data) => data.latency)
    );

    return { avg: Math.round(avgLatency), min: Math.round(minLatency) };
  };

  const getLatencyForRegion = (regionId: string) => {
    const regionLatencies = latencyData.filter(
      (data) => data.cloudRegionId === regionId
    );
    if (regionLatencies.length === 0) return null;

    const avgLatency =
      regionLatencies.reduce((sum, data) => sum + data.latency, 0) /
      regionLatencies.length;
    const connections = regionLatencies.length;

    return { avg: Math.round(avgLatency), connections };
  };

  const handleExchangeSelect = (exchangeId: string) => {
    setSelectedExchange(exchangeId);
    setSearchQuery("");
  };

  const handleRegionSelect = (regionId: string) => {
    setSelectedCloudRegion(regionId);
    setSearchQuery("");
  };

  const getLatencyBadgeVariant = (latency: number) => {
    if (latency < 50) return "default";
    if (latency < 150) return "secondary";
    return "destructive";
  };

  return (
    <Card
      className={`backdrop-blur-md transition-colors ${
        isDark
          ? "bg-black/40 border-slate-700/50"
          : "bg-white/40 border-slate-300/50"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={`flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <Search className="w-5 h-5 text-blue-400" />
          Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <Input
            placeholder="Search exchanges, regions, or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
            }`}
          />
        </div>

        {searchQuery.trim() && (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {/* Exchange Results */}
            {searchResults.exchanges.length > 0 && (
              <div>
                <h4
                  className={`font-medium mb-2 text-sm flex items-center gap-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Exchanges ({searchResults.exchanges.length})
                </h4>
                <div className="space-y-2">
                  {searchResults.exchanges.map((exchange) => {
                    const latencyInfo = getLatencyForExchange(exchange.id);
                    return (
                      <Button
                        key={exchange.id}
                        variant="ghost"
                        className={`w-full justify-start p-3 h-auto transition-colors ${
                          isDark
                            ? "bg-slate-800/50 hover:bg-slate-700/50"
                            : "bg-slate-100/50 hover:bg-slate-200/50"
                        }`}
                        onClick={() => handleExchangeSelect(exchange.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="text-left">
                            <div
                              className={`font-medium ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {exchange.name}
                            </div>
                            <div
                              className={`text-xs flex items-center gap-1 ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              <MapPin className="w-3 h-3" />
                              {exchange.region}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {latencyInfo && (
                              <>
                                <Badge
                                  variant={getLatencyBadgeVariant(
                                    latencyInfo.avg
                                  )}
                                  className="text-xs"
                                >
                                  {latencyInfo.avg}ms avg
                                </Badge>
                                <span
                                  className={`text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                  }`}
                                >
                                  {latencyInfo.min}ms min
                                </span>
                              </>
                            )}
                            <Badge
                              variant={
                                exchange.status === "online"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {exchange.status}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Region Results */}
            {searchResults.regions.length > 0 && (
              <div>
                <h4
                  className={`font-medium mb-2 text-sm flex items-center gap-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Cloud Regions ({searchResults.regions.length})
                </h4>
                <div className="space-y-2">
                  {searchResults.regions.map((region) => {
                    const latencyInfo = getLatencyForRegion(region.id);
                    const providerColors = {
                      AWS: "bg-orange-500",
                      GCP: "bg-blue-500",
                      Azure: "bg-cyan-400",
                    };

                    return (
                      <Button
                        key={region.id}
                        variant="ghost"
                        className={`w-full justify-start p-3 h-auto transition-colors ${
                          isDark
                            ? "bg-slate-800/50 hover:bg-slate-700/50"
                            : "bg-slate-100/50 hover:bg-slate-200/50"
                        }`}
                        onClick={() => handleRegionSelect(region.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="text-left">
                            <div
                              className={`font-medium flex items-center gap-2 ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  providerColors[region.provider]
                                }`}
                              />
                              {region.provider} {region.location}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {region.regionCode}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {latencyInfo && (
                              <>
                                <Badge
                                  variant={getLatencyBadgeVariant(
                                    latencyInfo.avg
                                  )}
                                  className="text-xs"
                                >
                                  {latencyInfo.avg}ms avg
                                </Badge>
                                <span
                                  className={`text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                  }`}
                                >
                                  {latencyInfo.connections} connections
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.exchanges.length === 0 &&
              searchResults.regions.length === 0 && (
                <div className="text-center py-4">
                  <div
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    No results found
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Try searching for exchange names, regions, or cloud
                    providers
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Quick Actions */}
        {!searchQuery.trim() && (
          <div className="space-y-2">
            <h4
              className={`font-medium text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("binance")}
                className="text-xs"
              >
                Find Binance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("aws")}
                className="text-xs"
              >
                AWS Regions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("singapore")}
                className="text-xs"
              >
                Singapore
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("europe")}
                className="text-xs"
              >
                Europe
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchPanel;
