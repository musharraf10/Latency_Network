"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
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
import { format } from "date-fns";
import { useTheme } from "@/hooks/useTheme";

// Interfaces remain the same
interface Exchange {
  id: string;
  name: string;
}

interface StoreState {
  selectedExchange: string | null;
  showHistorical: boolean;
  setShowHistorical: (value: boolean) => void;
}

const HistoricalChart = () => {
  const { selectedExchange, showHistorical, setShowHistorical } =
    useStore() as StoreState;
  const { historicalData, loadHistoricalData } = useLatencyData();
  const { isDark } = useTheme();

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
      <DialogContent
        className={`max-w-7xl w-full max-h-[95vh] overflow-y-auto ${
          isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={isDark ? "text-white" : "text-gray-800"}>
              Historical Latency - {exchange?.name ?? "Unknown Exchange"}
            </DialogTitle>

            {/* DropdownMenu implementation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => loadHistoricalData(1)}>
                  1 Hour
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => loadHistoricalData(24)}>
                  24 Hours
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => loadHistoricalData(168)}>
                  7 Days
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => loadHistoricalData(720)}>
                  30 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Cards remain the same */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className={`rounded-lg p-4 text-center ${
                isDark ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="text-2xl font-bold text-green-400">
                {avgLatency}ms
              </div>
              <div className="text-sm text-slate-400">Average</div>
            </div>
            <div
              className={`rounded-lg p-4 text-center ${
                isDark ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="text-2xl font-bold text-red-400">
                {maxLatency}ms
              </div>
              <div className="text-sm text-slate-400">Maximum</div>
            </div>
            <div
              className={`rounded-lg p-4 text-center ${
                isDark ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="text-2xl font-bold text-blue-400">
                {minLatency}ms
              </div>
              <div className="text-sm text-slate-400">Minimum</div>
            </div>
          </div>

          {/* Chat representation  */}
          <div
            className={`rounded-lg p-4 ${
              isDark ? "bg-slate-800" : "bg-gray-100"
            }`}
            style={{ height: "300px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#334155" : "#CBD5E1"}
                />
                <XAxis
                  dataKey="time"
                  stroke={isDark ? "#94A3B8" : "#475569"}
                  fontSize={12}
                />
                <YAxis
                  stroke={isDark ? "#94A3B8" : "#475569"}
                  fontSize={12}
                  label={{
                    value: "Latency (ms)",
                    angle: -90,
                    position: "insideLeft",
                    fill: isDark ? "#94A3B8" : "#475569",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={isDark ? "#94A3B8" : "#475569"}
                  fontSize={12}
                  label={{
                    value: "Packet Loss (%)",
                    angle: 90,
                    position: "insideRight",
                    fill: isDark ? "#94A3B8" : "#475569",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                    border: `1px solid ${isDark ? "#475569" : "#CBD5E1"}`,
                    borderRadius: "8px",
                    color: isDark ? "#F8FAFC" : "#0F172A",
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
//Completed
