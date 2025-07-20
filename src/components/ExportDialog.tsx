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

const ExportDialog = () => {
  const { latencyData, historicalData, statistics } = useRealTimeLatency();
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      statistics,
      latencyData,
      historicalData: historicalData.slice(-100), // Last 100 points
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
      // Generate comprehensive report
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
        detailedData: latencyData.slice(0, 50), // Top 50 connections
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
      // Use html2canvas to capture the visualization
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(document.body, {
        backgroundColor: "#0f172a",
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
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Export Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={exportToJSON}
                disabled={isExporting}
                className="w-full justify-start"
                variant="ghost"
              >
                <Database className="w-4 h-4 mr-2" />
                Export Raw Data (JSON)
              </Button>

              <Button
                onClick={exportToCSV}
                disabled={isExporting}
                className="w-full justify-start"
                variant="ghost"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Data (CSV)
              </Button>

              <Button
                onClick={exportReport}
                disabled={isExporting}
                className="w-full justify-start"
                variant="ghost"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Analysis Report
              </Button>

              <Button
                onClick={captureScreenshot}
                disabled={isExporting}
                className="w-full justify-start"
                variant="ghost"
              >
                <Image className="w-4 h-4 mr-2" />
                Capture Screenshot
              </Button>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-400 space-y-1">
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
