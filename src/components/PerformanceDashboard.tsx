"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import {
  Activity,
  Zap,
  Wifi,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";

const PerformanceDashboard = () => {
  const { statistics, networkInfo, performanceMetrics, isConnected } =
    useRealTimeLatency();

  const performanceScore = useMemo(() => {
    let score = 100;
    
    // Deduct points for high latency
    if (statistics.avgLatency > 150) score -= 30;
    else if (statistics.avgLatency > 100) score -= 15;
    else if (statistics.avgLatency > 50) score -= 5;
    
    // Deduct points for packet loss
    const packetLoss = parseFloat(statistics.avgPacketLoss);
    if (packetLoss > 3) score -= 25;
    else if (packetLoss > 1) score -= 10;
    
    // Deduct points for poor connection ratio
    const connectionRatio = statistics.activeConnections / statistics.totalConnections;
    if (connectionRatio < 0.7) score -= 20;
    else if (connectionRatio < 0.9) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }, [statistics]);

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-400" };
    if (score >= 80) return { grade: "A", color: "text-green-400" };
    if (score >= 70) return { grade: "B", color: "text-yellow-400" };
    if (score >= 60) return { grade: "C", color: "text-orange-400" };
    return { grade: "D", color: "text-red-400" };
  };

  const getTrendIcon = (latency: number) => {
    if (latency < 50) return { icon: TrendingUp, color: "text-green-400" };
    if (latency < 150) return { icon: Minus, color: "text-yellow-400" };
    return { icon: TrendingDown, color: "text-red-400" };
  };

  const { grade, color } = getPerformanceGrade(performanceScore);
  const { icon: TrendIcon, color: trendColor } = getTrendIcon(statistics.avgLatency);

  return (
    <Card className="bg-black/40 backdrop-blur-md border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Performance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative w-24 h-24 mx-auto mb-2"
          >
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - performanceScore / 100)}`}
                className={color}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - performanceScore / 100) }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${color}`}>{grade}</span>
            </div>
          </motion.div>
          <div className="text-slate-300 text-sm">Performance Score</div>
          <div className={`text-lg font-bold ${color}`}>{performanceScore}/100</div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm flex items-center gap-2">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              Latency
            </span>
            <div className="text-right">
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
              <div className="text-xs text-slate-400 mt-1">
                {statistics.minLatency}-{statistics.maxLatency}ms
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              Connections
            </span>
            <div className="text-right">
              <span className="text-green-400 font-mono">
                {statistics.activeConnections}/{statistics.totalConnections}
              </span>
              <Progress
                value={(statistics.activeConnections / statistics.totalConnections) * 100}
                className="w-16 h-2 mt-1"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
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

          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Status
            </span>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Network Info */}
        {networkInfo && (
          <div className="border-t border-slate-700 pt-3">
            <h4 className="text-white font-medium mb-2 text-sm">Network Details</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Connection</span>
                <span className="text-slate-300">
                  {networkInfo.effectiveType?.toUpperCase() || "Unknown"}
                </span>
              </div>
              {networkInfo.downlink > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Downlink</span>
                  <span className="text-slate-300">{networkInfo.downlink} Mbps</span>
                </div>
              )}
              {networkInfo.rtt > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">RTT</span>
                  <span className="text-slate-300">{networkInfo.rtt}ms</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="border-t border-slate-700 pt-3">
            <h4 className="text-white font-medium mb-2 text-sm">Page Performance</h4>
            <div className="space-y-2 text-xs">
              {performanceMetrics.firstContentfulPaint > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">First Paint</span>
                  <span className="text-slate-300">
                    {Math.round(performanceMetrics.firstContentfulPaint)}ms
                  </span>
                </div>
              )}
              {performanceMetrics.domContentLoaded > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">DOM Ready</span>
                  <span className="text-slate-300">
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

export default PerformanceDashboard;