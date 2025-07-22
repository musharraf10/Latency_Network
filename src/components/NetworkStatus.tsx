"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { useTheme } from "@/hooks/useTheme";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const NetworkStatus = () => {
  const { isDark } = useTheme();
  const {
    isConnected,
    networkInfo,
    performanceMetrics,
    statistics,
    error,
    refreshData,
    isLoading,
  } = useRealTimeLatency();

  const getLatencyTrend = (latency: number) => {
    if (latency < 50)
      return { icon: TrendingUp, color: "text-green-400", label: "Excellent" };
    if (latency < 150)
      return { icon: Minus, color: "text-yellow-400", label: "Good" };
    return { icon: TrendingDown, color: "text-red-400", label: "Poor" };
  };

  const getConnectionQuality = () => {
    if (!networkInfo) return "Unknown";
    switch (networkInfo.effectiveType) {
      case "slow-2g":
        return "Very Slow";
      case "2g":
        return "Slow";
      case "3g":
        return "Moderate";
      case "4g":
        return "Fast";
      default:
        return "Unknown";
    }
  };

  const trend = getLatencyTrend(statistics.avgLatency);
  const TrendIcon = trend.icon;

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
          className={`flex items-center justify-between ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            Network Status
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            className={`flex items-center gap-2 p-2 rounded-md border ${
              isDark
                ? "bg-red-500/20 border-red-500/30"
                : "bg-red-100 border-red-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span
              className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}
            >
              {error}
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Connection
          </span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Average Latency */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Avg Latency
          </span>
          <div className="flex items-center gap-2">
            <TrendIcon className={`w-4 h-4 ${trend.color}`} />
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
        </div>

        {/* Latency Range */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Range
          </span>
          <span
            className={`font-mono text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {statistics.minLatency}ms - {statistics.maxLatency}ms
          </span>
        </div>

        {/* Active Connections */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Active Connections
          </span>
          <span className="text-green-400 font-mono">
            {statistics.activeConnections}/{statistics.totalConnections}
          </span>
        </div>

        {/* Packet Loss */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Packet Loss
          </span>
          <span
            className={`font-mono text-sm ${
              parseFloat(statistics.avgPacketLoss) < 1
                ? "text-green-400"
                : parseFloat(statistics.avgPacketLoss) < 3
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {statistics.avgPacketLoss}%
          </span>
        </div>

        {/* Network Information */}
        {networkInfo && (
          <>
            <div
              className={`border-t pt-3 ${
                isDark ? "border-slate-700" : "border-slate-300"
              }`}
            >
              <h4
                className={`font-medium mb-2 text-sm ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Network Info
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Connection Type
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {networkInfo.effectiveType?.toUpperCase() || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Quality
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {getConnectionQuality()}
                  </span>
                </div>
                {networkInfo.downlink > 0 && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Downlink
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {networkInfo.downlink} Mbps
                    </span>
                  </div>
                )}
                {networkInfo.rtt > 0 && (
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      RTT
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {networkInfo.rtt}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div
            className={`border-t pt-3 ${
              isDark ? "border-slate-700" : "border-slate-300"
            }`}
          >
            <h4
              className={`font-medium mb-2 text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Performance
            </h4>
            <div className="space-y-2">
              {performanceMetrics.firstContentfulPaint > 0 && (
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    First Paint
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {Math.round(performanceMetrics.firstContentfulPaint)}ms
                  </span>
                </div>
              )}
              {performanceMetrics.domContentLoaded > 0 && (
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    DOM Ready
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {Math.round(performanceMetrics.domContentLoaded)}ms
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkStatus;
//D
