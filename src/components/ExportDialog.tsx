// src/components/ExportDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { Download, FileText, Image, Database } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ExportDialog = () => {
  const { latencyData, historicalData, statistics } = useRealTimeLatency();
  const [isExporting, setIsExporting] = useState(false);
  const { isDark } = useTheme();

  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      statistics,
      latencyData,
      historicalData: historicalData.slice(-100),
      metadata: {
        totalConnections: latencyData.length,
        exportedAt: Date.now(),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `latency-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = [
      "Exchange ID",
      "Cloud Region ID",
      "Latency (ms)",
      "Packet Loss (%)",
      "Timestamp",
    ];
    const csvData = [
      headers.join(","),
      ...latencyData.map((data) =>
        [
          data.exchangeId,
          data.cloudRegionId,
          data.latency,
          data.packetLoss.toFixed(2),
          new Date(data.timestamp).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `latency-data-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportReport = async () => {
    setIsExporting(true);

    try {
      const report = {
        title: "Latency Topology Analysis Report",
        generatedAt: new Date().toISOString(),
        summary: {
          totalExchanges: new Set(latencyData.map((d) => d.exchangeId)).size,
          totalRegions: new Set(latencyData.map((d) => d.cloudRegionId)).size,
          averageLatency: statistics.avgLatency,
          minLatency: statistics.minLatency,
          maxLatency: statistics.maxLatency,
          activeConnections: statistics.activeConnections,
          packetLoss: statistics.avgPacketLoss,
        },
        recommendations: generateRecommendations(),
        detailedData: latencyData.slice(0, 50),
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `latency-analysis-report-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (statistics.avgLatency > 150) {
      recommendations.push(
        "Consider optimizing network routes or switching to closer cloud regions"
      );
    }

    if (parseFloat(statistics.avgPacketLoss) > 2) {
      recommendations.push(
        "High packet loss detected - investigate network stability"
      );
    }

    if (statistics.activeConnections < statistics.totalConnections * 0.8) {
      recommendations.push(
        "Some connections are experiencing high latency - consider load balancing"
      );
    }

    return recommendations;
  };

  const captureScreenshot = async () => {
    setIsExporting(true);

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(document.body, {
        backgroundColor: "hsl(var(--background))",
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `latency-visualization-${
            new Date().toISOString().split("T")[0]
          }.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Screenshot capture failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-full flex items-center gap-2 justify-start transition-colors ${
            isDark
              ? "border-slate-600 text-white hover:bg-slate-700"
              : "border-slate-300 text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-md transition-colors ${
          isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
        }`}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? "text-white" : "text-slate-900"}>
            Export Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card
            className={`transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={exportToJSON}
                disabled={isExporting}
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "text-white hover:bg-slate-700"
                    : "text-slate-900 hover:bg-slate-200"
                }`}
                variant="ghost"
              >
                <Database className="w-4 h-4 mr-2" />
                Export Raw Data (JSON)
              </Button>

              <Button
                onClick={exportToCSV}
                disabled={isExporting}
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "text-white hover:bg-slate-700"
                    : "text-slate-900 hover:bg-slate-200"
                }`}
                variant="ghost"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Data (CSV)
              </Button>

              <Button
                onClick={exportReport}
                disabled={isExporting}
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "text-white hover:bg-slate-700"
                    : "text-slate-900 hover:bg-slate-200"
                }`}
                variant="ghost"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Analysis Report
              </Button>

              <Button
                onClick={captureScreenshot}
                disabled={isExporting}
                className={`w-full justify-start transition-colors ${
                  isDark
                    ? "text-white hover:bg-slate-700"
                    : "text-slate-900 hover:bg-slate-200"
                }`}
                variant="ghost"
              >
                <Image className="w-4 h-4 mr-2" />
                Capture Screenshot
              </Button>
            </CardContent>
          </Card>

          <div
            className={`text-xs space-y-1 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <p>• JSON: Complete dataset with metadata</p>
            <p>• CSV: Spreadsheet-compatible format</p>
            <p>• Report: Analysis with recommendations</p>
            <p>• Screenshot: Current visualization state</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
