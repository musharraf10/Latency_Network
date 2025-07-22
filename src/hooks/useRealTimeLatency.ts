"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LatencyMonitor,
  HistoricalDataAPI,
  NetworkPerformanceMonitor,
} from "@/lib/api";
import type { LatencyData, HistoricalData } from "@/types";
import { exchanges, cloudRegions } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export const useRealTimeLatency = () => {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const monitorRef = useRef<LatencyMonitor | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const initializeMonitor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const netInfo = await NetworkPerformanceMonitor.getNetworkInfo();
        setNetworkInfo(netInfo);

        const perfMetrics =
          await NetworkPerformanceMonitor.measurePageLoadPerformance();
        setPerformanceMetrics(perfMetrics);

        monitorRef.current = LatencyMonitor.getInstance();

        unsubscribeRef.current = monitorRef.current.subscribe(
          (data: LatencyData[]) => {
            setLatencyData(data);
            setIsConnected(true);
            setError(null);
          }
        );

        // Fetch historical data for all exchange-region pairs
        const historical: HistoricalData[] = [];
        for (const exchange of exchanges) {
          for (const region of cloudRegions) {
            const data = await HistoricalDataAPI.fetchHistoricalData(
              exchange.id,
              region.id,
              24
            );
            historical.push(
              ...data.map((d) => ({
                ...d,
                exchangeId: exchange.id,
                cloudRegionId: region.id,
              }))
            );
          }
        }
        setHistoricalData(historical.slice(-1000));

        await monitorRef.current.start();
        setIsLoading(false);
      } catch (err) {
        toast.error("Failed to initialize latency monitor");
        setError("Failed to connect to latency monitoring service");
        setIsLoading(false);
      }
    };

    initializeMonitor();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (monitorRef.current) {
        monitorRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsConnected(true);
      if (monitorRef.current) {
        monitorRef.current.start();
      }
    };

    const handleOffline = () => {
      setIsConnected(false);
      if (monitorRef.current) {
        monitorRef.current.stop();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadHistoricalData = useCallback(
    async (exchangeId: string, regionId: string, hours: number = 24) => {
      try {
        setIsLoading(true);
        const data = await HistoricalDataAPI.fetchHistoricalData(
          exchangeId,
          regionId,
          hours
        );
        setHistoricalData((prev) =>
          [
            ...prev.filter(
              (d) => d.exchangeId !== exchangeId || d.cloudRegionId !== regionId
            ),
            ...data.map((d) => ({
              ...d,
              exchangeId,
              cloudRegionId: regionId,
            })),
          ].slice(-1000)
        );
      } catch (err) {
        console.error("Failed to load historical data:", err);
        toast.error("Failed to load historical data");
        setError("Failed to load historical data");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshData = useCallback(async () => {
    if (monitorRef.current) {
      try {
        setError(null);
        await monitorRef.current.start();
      } catch (err) {
        toast.error("Failed to refresh data");
        setError("Failed to refresh data");
      }
    }
  }, []);

  const toggleRealTime = useCallback((enabled: boolean) => {
    if (monitorRef.current) {
      if (enabled) {
        monitorRef.current.start();
        setIsPaused(false);
      } else {
        monitorRef.current.stop();
        setIsPaused(true);
      }
      setIsConnected(enabled);
    }
  }, []);

  const pauseRealTime = useCallback(() => {
    setIsPaused(!isPaused);
    if (monitorRef.current) {
      if (isPaused) {
        monitorRef.current.start();
        setIsConnected(true);
      } else {
        monitorRef.current.stop();
        setIsConnected(false);
      }
    }
  }, [isPaused]);

  const statistics = {
    avgLatency:
      latencyData.length > 0
        ? Math.round(
            latencyData.reduce((sum, data) => sum + data.latency, 0) /
              latencyData.length
          )
        : 0,
    minLatency:
      latencyData.length > 0
        ? Math.min(...latencyData.map((data) => data.latency))
        : 0,
    maxLatency:
      latencyData.length > 0
        ? Math.max(...latencyData.map((data) => data.latency))
        : 0,
    activeConnections: latencyData.filter((data) => data.latency < 200).length,
    totalConnections: latencyData.length,
    avgPacketLoss:
      latencyData.length > 0
        ? (
            latencyData.reduce((sum, data) => sum + data.packetLoss, 0) /
            latencyData.length
          ).toFixed(2)
        : "0.00",
  };

  return {
    latencyData,
    historicalData,
    isLoading,
    isConnected,
    networkInfo,
    performanceMetrics,
    error,
    statistics,
    loadHistoricalData,
    refreshData,
    toggleRealTime,
    pauseRealTime,
    isPaused,
  };
};
