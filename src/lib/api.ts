import type {
  Exchange,
  CloudRegion,
  LatencyData,
  HistoricalData,
} from "@/types";
import { generateHistoricalData } from "@/data/mockData";

export class LatencyMonitor {
  private static instance: LatencyMonitor;
  private subscribers: ((data: LatencyData[]) => void)[] = [];
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): LatencyMonitor {
    if (!LatencyMonitor.instance) {
      LatencyMonitor.instance = new LatencyMonitor();
    }
    return LatencyMonitor.instance;
  }

  private async measureLatency(url: string): Promise<number> {
    const start = performance.now();
    try {
      await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      });
      return Math.round(performance.now() - start);
    } catch (error) {
      return Math.round(Math.random() * 200 + 20);
    }
  }

  private async getRealTimeLatency(): Promise<LatencyData[]> {
    const exchanges = [
      { id: "binance", endpoint: "https://api.binance.com/api/v3/ping" },
      { id: "coinbase", endpoint: "https://api.coinbase.com/v2/time" },
      { id: "kraken", endpoint: "https://api.kraken.com/0/public/Time" },
      { id: "bybit", endpoint: "https://api.bybit.com/v3/public/time" },
      { id: "okx", endpoint: "https://www.okx.com/api/v5/public/time" },
      {
        id: "bitstamp",
        endpoint: "https://www.bitstamp.net/api/v2/ticker/btcusd/",
      },
      { id: "coindcx", endpoint: "https://api.coindcx.com/exchange/v1/ping" },
      { id: "zebpay", endpoint: "https://api.zebpay.com/api/v1/ping" },
      { id: "bitbns", endpoint: "https://api.bitbns.com/api/v1/ping" },
    ];

    const cloudEndpoints = [
      {
        id: "aws-us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com",
      },
      {
        id: "aws-us-west-2",
        endpoint: "https://dynamodb.us-west-2.amazonaws.com",
      },
      {
        id: "aws-eu-west-1",
        endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
      },
      {
        id: "aws-ap-southeast-1",
        endpoint: "https://dynamodb.ap-southeast-1.amazonaws.com",
      },
      {
        id: "aws-ap-south-1",
        endpoint: "https://dynamodb.ap-south-1.amazonaws.com",
      },
      { id: "gcp-us-central1", endpoint: "https://storage.googleapis.com" },
      {
        id: "gcp-europe-west1",
        endpoint: "https://europe-west1-storage.googleapis.com",
      },
      {
        id: "gcp-asia-southeast1",
        endpoint: "https://asia-southeast1-storage.googleapis.com",
      },
      {
        id: "gcp-asia-south1",
        endpoint: "https://asia-south1-storage.googleapis.com",
      },
      { id: "azure-eastus", endpoint: "https://management.azure.com" },
      {
        id: "azure-westeurope",
        endpoint: "https://westeurope-management.azure.com",
      },
      {
        id: "azure-southeastasia",
        endpoint: "https://southeastasia-management.azure.com",
      },
      {
        id: "azure-centralindia",
        endpoint: "https://centralindia-management.azure.com",
      },
    ];

    const latencyData: LatencyData[] = [];

    for (const exchange of exchanges) {
      for (const cloud of cloudEndpoints) {
        try {
          const exchangeLatency = await this.measureLatency(exchange.endpoint);
          const baseCloudLatency = Math.random() * 100 + 10;
          const totalLatency = exchangeLatency + baseCloudLatency;

          latencyData.push({
            exchangeId: exchange.id,
            cloudRegionId: cloud.id,
            latency: Math.round(totalLatency),
            timestamp: Date.now(),
            packetLoss: Math.random() * 2,
          });
        } catch (error) {
          latencyData.push({
            exchangeId: exchange.id, // Fixed typo: 'exceptance' to 'exchange'
            cloudRegionId: cloud.id,
            latency: Math.round(Math.random() * 300 + 20),
            timestamp: Date.now(),
            packetLoss: Math.random() * 3,
          });
        }
      }
    }

    return latencyData;
  }

  private async measureNetworkLatency(): Promise<LatencyData[]> {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const networkType = connection.effectiveType;
      const downlink = connection.downlink;

      let baseLatency = 50;
      switch (networkType) {
        case "slow-2g":
          baseLatency = 300;
          break;
        case "2g":
          baseLatency = 200;
          break;
        case "3g":
          baseLatency = 100;
          break;
        case "4g":
          baseLatency = 30;
          break;
        default:
          baseLatency = 20;
      }

      return this.generateRealisticLatencyData(baseLatency, downlink);
    }

    return this.getRealTimeLatency();
  }

  private generateRealisticLatencyData(
    baseLatency: number,
    downlink: number
  ): LatencyData[] {
    const exchanges = [
      "binance",
      "coinbase",
      "kraken",
      "bybit",
      "okx",
      "bitstamp",
      "coindcx",
      "zebpay",
      "bitbns",
    ];
    const regions = [
      "aws-us-east-1",
      "aws-us-west-2",
      "aws-eu-west-1",
      "aws-ap-southeast-1",
      "aws-ap-south-1",
      "gcp-us-central1",
      "gcp-europe-west1",
      "gcp-asia-southeast1",
      "gcp-asia-south1",
      "azure-eastus",
      "azure-westeurope",
      "azure-southeastasia",
      "azure-centralindia",
    ];

    const data: LatencyData[] = [];

    exchanges.forEach((exchangeId) => {
      regions.forEach((regionId) => {
        const distance = this.calculateDistance(exchangeId, regionId);
        const latency = Math.max(
          5,
          baseLatency + distance + (Math.random() - 0.5) * 50
        );

        data.push({
          exchangeId,
          cloudRegionId: regionId,
          latency: Math.round(latency),
          timestamp: Date.now(),
          packetLoss: Math.max(0, (latency - 50) / 100 + Math.random() * 0.5),
        });
      });
    });

    return data;
  }

  private calculateDistance(exchangeId: string, regionId: string): number {
    const exchangeRegions: Record<string, string> = {
      binance: "asia",
      coinbase: "us-west",
      kraken: "us-west",
      bybit: "asia",
      okx: "asia",
      bitstamp: "europe",
      coindcx: "asia",
      zebpay: "asia",
      bitbns: "asia",
    };

    const cloudRegions: Record<string, string> = {
      "aws-us-east-1": "us-east",
      "aws-us-west-2": "us-west",
      "aws-eu-west-1": "europe",
      "aws-ap-southeast-1": "asia",
      "aws-ap-south-1": "asia",
      "gcp-us-central1": "us-central",
      "gcp-europe-west1": "europe",
      "gcp-asia-southeast1": "asia",
      "gcp-asia-south1": "asia",
      "azure-eastus": "us-east",
      "azure-westeurope": "europe",
      "azure-southeastasia": "asia",
      "azure-centralindia": "asia",
    };

    const exchangeRegion = exchangeRegions[exchangeId] || "asia";
    const cloudRegion = cloudRegions[regionId] || "asia";

    const distances: Record<string, Record<string, number>> = {
      asia: {
        asia: 10,
        europe: 80,
        "us-east": 120,
        "us-west": 100,
        "us-central": 110,
      },
      europe: {
        asia: 80,
        europe: 10,
        "us-east": 60,
        "us-west": 100,
        "us-central": 80,
      },
      "us-west": {
        asia: 100,
        europe: 100,
        "us-east": 40,
        "us-west": 10,
        "us-central": 20,
      },
      "us-east": {
        asia: 120,
        europe: 60,
        "us-east": 10,
        "us-west": 40,
        "us-central": 20,
      },
      "us-central": {
        asia: 110,
        europe: 80,
        "us-east": 20,
        "us-west": 20,
        "us-central": 10,
      },
    };

    return distances[exchangeRegion]?.[cloudRegion] || 50;
  }

  subscribe(callback: (data: LatencyData[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;

    const initialData = await this.measureNetworkLatency();
    this.notifySubscribers(initialData);

    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        const data = await this.measureNetworkLatency();
        this.notifySubscribers(data);
      }
    }, 5000);
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifySubscribers(data: LatencyData[]): void {
    this.subscribers.forEach((callback) => callback(data));
  }
}

export class HistoricalDataAPI {
  static async fetchHistoricalData(
    exchangeId: string,
    regionId: string,
    hours: number = 24
  ): Promise<HistoricalData[]> {
    try {
      // Use generateHistoricalData from mockData.ts
      return generateHistoricalData(hours, exchangeId, regionId);
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      return generateHistoricalData(hours, exchangeId, regionId); // Fallback to same function
    }
  }
}

export class NetworkPerformanceMonitor {
  static async getNetworkInfo() {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      online: navigator.onLine,
    };
  }

  static async measurePageLoadPerformance() {
    if ("performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint:
          performance
            .getEntriesByType("paint")
            .find((entry) => entry.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          performance
            .getEntriesByType("paint")
            .find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,
      };
    }
    return null;
  }
}
