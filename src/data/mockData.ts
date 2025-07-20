import type { Exchange, CloudRegion, LatencyData } from "@/types";

export const exchanges: Exchange[] = [
  {
    id: "binance",
    name: "Binance",
    coordinates: [35.6762, 139.6503], // Tokyo
    region: "Asia-Pacific",
    volume24h: 15240000000,
    status: "online",
  },
  {
    id: "coinbase",
    name: "Coinbase Pro",
    coordinates: [37.7749, -122.4194], // San Francisco
    region: "North America",
    volume24h: 8960000000,
    status: "online",
  },
  {
    id: "kraken",
    name: "Kraken",
    coordinates: [37.7749, -122.4194], // San Francisco
    region: "North America",
    volume24h: 2340000000,
    status: "online",
  },
  {
    id: "bybit",
    name: "Bybit",
    coordinates: [1.3521, 103.8198], // Singapore
    region: "Asia-Pacific",
    volume24h: 4560000000,
    status: "online",
  },
  {
    id: "okx",
    name: "OKX",
    coordinates: [1.3521, 103.8198], // Singapore
    region: "Asia-Pacific",
    volume24h: 3920000000,
    status: "online",
  },
  {
    id: "bitstamp",
    name: "Bitstamp",
    coordinates: [51.5074, -0.1278], // London
    region: "Europe",
    volume24h: 1120000000,
    status: "online",
  },
  {
    id: "wazirx",
    name: "WazirX",
    coordinates: [19.0760, 72.8777], // Mumbai
    region: "Asia-Pacific",
    volume24h: 890000000,
    status: "online",
  },
  {
    id: "coindcx",
    name: "CoinDCX",
    coordinates: [28.6139, 77.2090], // Delhi
    region: "Asia-Pacific",
    volume24h: 650000000,
    status: "online",
  },
];

export const cloudRegions: CloudRegion[] = [
  // AWS Regions
  {
    id: "aws-us-east-1",
    provider: "AWS",
    regionCode: "us-east-1",
    location: "N. Virginia",
    coordinates: [38.9072, -77.0369],
    zones: ["a", "b", "c", "d", "e", "f"],
  },
  {
    id: "aws-us-west-2",
    provider: "AWS",
    regionCode: "us-west-2",
    location: "Oregon",
    coordinates: [45.5152, -122.6784],
    zones: ["a", "b", "c", "d"],
  },
  {
    id: "aws-eu-west-1",
    provider: "AWS",
    regionCode: "eu-west-1",
    location: "Ireland",
    coordinates: [53.3498, -6.2603],
    zones: ["a", "b", "c"],
  },
  {
    id: "aws-ap-southeast-1",
    provider: "AWS",
    regionCode: "ap-southeast-1",
    location: "Singapore",
    coordinates: [1.3521, 103.8198],
    zones: ["a", "b", "c"],
  },
  // GCP Regions
  {
    id: "gcp-us-central1",
    provider: "GCP",
    regionCode: "us-central1",
    location: "Iowa",
    coordinates: [41.5868, -93.625],
    zones: ["a", "b", "c", "f"],
  },
  {
    id: "gcp-europe-west1",
    provider: "GCP",
    regionCode: "europe-west1",
    location: "Belgium",
    coordinates: [50.8503, 4.3517],
    zones: ["a", "b", "c", "d"],
  },
  {
    id: "gcp-asia-southeast1",
    provider: "GCP",
    regionCode: "asia-southeast1",
    location: "Singapore",
    coordinates: [1.3521, 103.8198],
    zones: ["a", "b", "c"],
  },
  // Azure Regions
  {
    id: "azure-eastus",
    provider: "Azure",
    regionCode: "eastus",
    location: "Virginia",
    coordinates: [38.9072, -77.0369],
    zones: ["1", "2", "3"],
  },
  {
    id: "azure-westeurope",
    provider: "Azure",
    regionCode: "westeurope",
    location: "Netherlands",
    coordinates: [52.3676, 4.9041],
    zones: ["1", "2", "3"],
  },
  {
    id: "azure-southeastasia",
    provider: "Azure",
    regionCode: "southeastasia",
    location: "Singapore",
    coordinates: [1.3521, 103.8198],
    zones: ["1", "2", "3"],
  },
  // Indian Regions
  {
    id: "aws-ap-south-1",
    provider: "AWS",
    regionCode: "ap-south-1",
    location: "Mumbai",
    coordinates: [19.0760, 72.8777],
    zones: ["a", "b", "c"],
  },
  {
    id: "gcp-asia-south1",
    provider: "GCP",
    regionCode: "asia-south1",
    location: "Mumbai",
    coordinates: [19.0760, 72.8777],
    zones: ["a", "b", "c"],
  },
  {
    id: "azure-centralindia",
    provider: "Azure",
    regionCode: "centralindia",
    location: "Pune",
    coordinates: [18.5204, 73.8567],
    zones: ["1", "2", "3"],
  },
];

// Generate mock latency data
export const generateMockLatencyData = (): LatencyData[] => {
  const data: LatencyData[] = [];

  exchanges.forEach((exchange) => {
    cloudRegions.forEach((region) => {
      // Calculate base latency based on distance
      const baseLatency = Math.random() * 200 + 20;
      const variation = (Math.random() - 0.5) * 40;
      const latency = Math.max(1, baseLatency + variation);

      data.push({
        exchangeId: exchange.id,
        cloudRegionId: region.id,
        latency: Math.round(latency),
        timestamp: Date.now(),
        packetLoss: Math.random() * 2,
      });
    });
  });

  return data;
};

export const generateHistoricalData = (hours: number = 24) => {
  const data = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100; // 100 data points

  for (let i = 0; i < 100; i++) {
    const timestamp = now - (99 - i) * interval;
    const baseLatency = 50 + Math.sin(i * 0.1) * 20;
    const noise = (Math.random() - 0.5) * 10;

    data.push({
      timestamp,
      latency: Math.max(1, Math.round(baseLatency + noise)),
      packetLoss: Math.random() * 1,
    });
  }

  return data;
};
