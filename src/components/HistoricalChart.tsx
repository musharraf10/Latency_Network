"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import {
  TrendingUp,
  Clock,
  BarChart3,
  Calendar,
  X,
  Activity,
} from "lucide-react";

const HistoricalChart = () => {
  const { isDark } = useTheme();
  const { showHistorical, setShowHistorical, selectedExchange, selectedCloudRegion } = useStore();
  const { loadHistoricalData, historicalData } = useRealTimeLatency();
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeRange, setTimeRange] = useState("24h");
  const [isLoading, setIsLoading] = useState(false);

  const cryptoOptions = [
    { value: "bitcoin", label: "Bitcoin (BTC)", color: "#F7931A" },
    { value: "ethereum", label: "Ethereum (ETH)", color: "#627EEA" },
    { value: "binancecoin", label: "Binance Coin (BNB)", color: "#F3BA2F" },
    { value: "solana", label: "Solana (SOL)", color: "#9945FF" },
    { value: "cardano", label: "Cardano (ADA)", color: "#0033AD" },
    { value: "polkadot", label: "Polkadot (DOT)", color: "#E6007A" },
  ];

  const timeRanges = [
    { value: "1h", label: "1 Hour", hours: 1 },
    { value: "24h", label: "24 Hours", hours: 24 },
    { value: "7d", label: "7 Days", hours: 168 },
    { value: "30d", label: "30 Days", hours: 720 },
  ];

  useEffect(() => {
    if (showHistorical && selectedExchange && selectedCloudRegion) {
      const selectedRange = timeRanges.find(r => r.value === timeRange);
      if (selectedRange) {
        setIsLoading(true);
        loadHistoricalData(selectedExchange, selectedCloudRegion, selectedRange.hours)
          .finally(() => setIsLoading(false));
      }
    }
  }, [showHistorical, selectedExchange, selectedCloudRegion, timeRange, loadHistoricalData]);

  const chartData = useMemo(() => {
    if (!historicalData.length) return [];

    return historicalData
      .filter(
        (data) =>
          data.exchangeId === selectedExchange &&
          data.cloudRegionId === selectedCloudRegion
      )
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((data) => ({
        timestamp: data.timestamp,
        time: new Date(data.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(data.timestamp).toLocaleDateString(),
        latency: data.latency,
        packetLoss: data.packetLoss,
      }));
  }, [historicalData, selectedExchange, selectedCloudRegion]);

  const statistics = useMemo(() => {
    if (!chartData.length) return null;

    const latencies = chartData.map((d) => d.latency);
    const packetLosses = chartData.map((d) => d.packetLoss);

    return {
      min: Math.min(...latencies),
      max: Math.max(...latencies),
      avg: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
      avgPacketLoss: (
        packetLosses.reduce((a, b) => a + b, 0) / packetLosses.length
      ).toFixed(2),
    };
  }, [chartData]);

  const selectedCryptoData = cryptoOptions.find(c => c.value === selectedCrypto);
  const exchange = exchanges.find((e) => e.id === selectedExchange);
  const region = cloudRegions.find((r) => r.id === selectedCloudRegion);

  const handleClose = () => {
    setShowHistorical(false);
  };

  if (!showHistorical) return null;

  return (
    <Dialog open={showHistorical} onOpenChange={setShowHistorical}>
      <DialogContent 
        className={`max-w-6xl w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden transition-colors ${
          isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-300"
        }`}
        showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className={`p-4 border-b flex-shrink-0 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <DialogTitle className={`flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Historical Latency Analysis
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className={`h-8 w-8 ${
                  isDark 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cryptocurrency Selection */}
              <Card className={`transition-colors ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      Cryptocurrency
                    </label>
                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      <SelectTrigger className={`transition-colors ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={
                        isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-slate-300"
                      }>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem key={crypto.value} value={crypto.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: crypto.color }}
                              />
                              {crypto.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Time Range Selection */}
              <Card className={`transition-colors ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      Time Range
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {timeRanges.map((range) => (
                        <Button
                          key={range.value}
                          variant={timeRange === range.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange(range.value)}
                          className="text-xs"
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Information */}
              <Card className={`transition-colors ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      Route
                    </label>
                    <div className="space-y-1">
                      <div className={`text-xs ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}>
                        From: {exchange?.name || "Select Exchange"}
                      </div>
                      <div className={`text-xs ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}>
                        To: {region ? `${region.provider} ${region.location}` : "Select Region"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className={`transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-3 text-center">
                    <div className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {statistics.avg}ms
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Average
                    </div>
                  </CardContent>
                </Card>
                <Card className={`transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-green-400">
                      {statistics.min}ms
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Minimum
                    </div>
                  </CardContent>
                </Card>
                <Card className={`transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-red-400">
                      {statistics.max}ms
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Maximum
                    </div>
                  </CardContent>
                </Card>
                <Card className={`transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <CardContent className="p-3 text-center">
                    <div className={`text-lg font-bold ${
                      parseFloat(statistics.avgPacketLoss) < 1
                        ? "text-green-400"
                        : parseFloat(statistics.avgPacketLoss) < 3
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}>
                      {statistics.avgPacketLoss}%
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Packet Loss
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Chart */}
            <Card className={`transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-slate-50 border-slate-200"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedCryptoData?.color }}
                    />
                    <h3 className={`font-medium ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {selectedCryptoData?.label} Latency Trends
                    </h3>
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-spin text-blue-400" />
                      <span className={`text-sm ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}>
                        Loading...
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-80">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={selectedCryptoData?.color}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={selectedCryptoData?.color}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDark ? "#374151" : "#e5e7eb"}
                        />
                        <XAxis
                          dataKey="time"
                          stroke={isDark ? "#9ca3af" : "#6b7280"}
                          fontSize={12}
                        />
                        <YAxis
                          stroke={isDark ? "#9ca3af" : "#6b7280"}
                          fontSize={12}
                          label={{
                            value: "Latency (ms)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#1e293b" : "#ffffff",
                            border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                            borderRadius: "8px",
                            color: isDark ? "#f8fafc" : "#1e293b",
                          }}
                          labelFormatter={(value) => `Time: ${value}`}
                          formatter={(value: any, name: string) => [
                            `${value}${name === "latency" ? "ms" : "%"}`,
                            name === "latency" ? "Latency" : "Packet Loss",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="latency"
                          stroke={selectedCryptoData?.color}
                          strokeWidth={2}
                          fill="url(#latencyGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Clock className={`w-12 h-12 mx-auto mb-3 ${
                          isDark ? "text-slate-600" : "text-slate-400"
                        }`} />
                        <div className={`text-sm ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {isLoading ? "Loading historical data..." : "No historical data available"}
                        </div>
                        {!selectedExchange || !selectedCloudRegion ? (
                          <div className={`text-xs mt-1 ${
                            isDark ? "text-slate-500" : "text-slate-500"
                          }`}>
                            Select an exchange and cloud region to view data
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalChart;