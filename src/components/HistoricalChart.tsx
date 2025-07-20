"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/hooks/useStore";
import { useLatencyData } from "@/hooks/useLatencyData";
import { exchanges } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { format } from "date-fns";

// Define TypeScript interfaces for type safety
interface Exchange {
  id: string;
  name: string;
}

interface HistoricalDataPoint {
  timestamp: string;
  latency: number;
  packetLoss: number;
}

interface StoreState {
  selectedExchange: string | null;
  showHistorical: boolean;
  setShowHistorical: (value: boolean) => void;
}

interface LatencyData {
  historicalData: HistoricalDataPoint[];
  loadHistoricalData: (hours: number) => void;
}

const HistoricalChart = () => {
  const { isDark } = useTheme();
  const { selectedExchange, showHistorical, setShowHistorical } =
    useStore() as StoreState;
  const { historicalData, loadHistoricalData } = useLatencyData();

  const exchange = useMemo(
    () => exchanges.find((e: Exchange) => e.id === selectedExchange),
    [selectedExchange]
  );

  const chartData = useMemo(() => {
    return historicalData.map((data) => ({
      time: format(new Date(data.timestamp), "HH:mm"),
      latency: data.latency,
      packetLoss: data.packetLoss,
    }));
  }, [historicalData]);

  const avgLatency = useMemo(() => {
    if (historicalData.length === 0) return 0;
    return Math.round(
      historicalData.reduce((sum, data) => sum + data.latency, 0) /
        historicalData.length
    );
  }, [historicalData]);

  const maxLatency = useMemo(() => {
    if (historicalData.length === 0) return 0;
    return Math.max(...historicalData.map((data) => data.latency));
  }, [historicalData]);

  const minLatency = useMemo(() => {
    if (historicalData.length === 0) return 0;
    return Math.min(...historicalData.map((data) => data.latency));
  }, [historicalData]);

  return (
    <Dialog
      open={showHistorical && !!selectedExchange}
      onOpenChange={setShowHistorical}
    >
      <DialogContent className={`max-w-4xl max-h-[80vh] transition-colors ${
        isDark 
          ? "bg-slate-900 border-slate-700" 
          : "bg-white border-slate-300"
      }`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center justify-between ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <span>
              Historical Latency - {exchange?.name ?? "Unknown Exchange"}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistoricalData(1)}
              >
                1h
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistoricalData(24)}
              >
                24h
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistoricalData(168)}
              >
                7d
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`rounded-lg p-4 text-center transition-colors ${
              isDark ? "bg-slate-800" : "bg-slate-100"
            }`}>
              <div className="text-2xl font-bold text-green-400">
                {avgLatency}ms
              </div>
              <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Average</div>
            </div>
            <div className={`rounded-lg p-4 text-center transition-colors ${
              isDark ? "bg-slate-800" : "bg-slate-100"
            }`}>
              <div className="text-2xl font-bold text-red-400">
                {maxLatency}ms
              </div>
              <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Maximum</div>
            </div>
            <div className={`rounded-lg p-4 text-center transition-colors ${
              isDark ? "bg-slate-800" : "bg-slate-100"
            }`}>
              <div className="text-2xl font-bold text-blue-400">
                {minLatency}ms
              </div>
              <div className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Minimum</div>
            </div>
          </div>

          {/* Chart */}
          <div
            className={`rounded-lg p-4 transition-colors ${
              isDark ? "bg-slate-800" : "bg-slate-100"
            }`}
            style={{ height: "400px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="time" stroke={isDark ? "#94A3B8" : "#64748b"} fontSize={12} />
                <YAxis
                  stroke={isDark ? "#94A3B8" : "#64748b"}
                  fontSize={12}
                  label={{
                    value: "Latency (ms)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={isDark ? "#94A3B8" : "#64748b"}
                  fontSize={12}
                  label={{
                    value: "Packet Loss (%)",
                    angle: 90,
                    position: "insideRight",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1E293B" : "#ffffff",
                    border: `1px solid ${isDark ? "#475569" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    color: isDark ? "#F8FAFC" : "#1e293b",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}${name === "latency" ? "ms" : "%"}`,
                    name === "latency" ? "Latency" : "Packet Loss",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#00FF88"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#00FF88" }}
                />
                <Line
                  type="monotone"
                  dataKey="packetLoss"
                  stroke="#FF3366"
                  strokeWidth={1}
                  dot={false}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalChart;