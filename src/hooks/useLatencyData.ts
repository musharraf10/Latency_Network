"use client";

import { useState, useEffect, useCallback } from "react";
import {
  generateMockLatencyData,
  generateHistoricalData,
} from "@/data/mockData";
import type { LatencyData, HistoricalData } from "@/types";

export const useLatencyData = () => {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateLatencyData = useCallback(() => {
    setLatencyData(generateMockLatencyData());
  }, []);

  const loadHistoricalData = useCallback((hours: number = 24) => {
    setHistoricalData(generateHistoricalData(hours));
  }, []);

  useEffect(() => {
    // Initial load
    updateLatencyData();
    loadHistoricalData();
    setIsLoading(false);

    // Set up real-time updates every 5 seconds
    const interval = setInterval(updateLatencyData, 5000);

    return () => clearInterval(interval);
  }, [updateLatencyData, loadHistoricalData]);

  return {
    latencyData,
    historicalData,
    isLoading,
    updateLatencyData,
    loadHistoricalData,
  };
};
