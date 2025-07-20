// src/components/MapboxGlobe.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "next-themes";
import { Tooltip } from "recharts";
import type { Feature, Geometry } from "geojson";

// Set Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2ttdXNoYXJhZjEwIiwiYSI6ImNsd2RxZ3A1YzE3MW4ycXBwMDZieDl3Z3cifQ.Y3P6YoJSYwi_3w66luCAqg";

// Define types for GeoJSON properties
interface ConnectionProperties {
  latency: number;
  color: string;
  opacity: number;
  exchangeName: string;
  regionName: string;
  packetLoss: number;
}

interface HeatmapProperties {
  intensity: number;
}

const MapboxGlobe = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const animationFrameId = useRef<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    exchangeName: string;
    regionName: string;
    latency: number | null;
    packetLoss: number | null;
    x: number;
    y: number;
  } | null>(null);

  const {
    selectedExchange,
    selectedCloudRegion,
    filters,
    realTimeEnabled,
    showHeatmap,
    setSelectedExchange,
    setSelectedCloudRegion,
  } = useStore();

  const { latencyData } = useRealTimeLatency();

  // Memoize filters to prevent unnecessary changes
  const memoizedFilters = useMemo(
    () => ({
      exchanges: filters.exchanges,
      cloudProviders: filters.cloudProviders,
      latencyRange: filters.latencyRange,
    }),
    [filters.exchanges, filters.cloudProviders, filters.latencyRange]
  );

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log("Initializing map, isDark:", isDark);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      projection: { name: "globe" },
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
    });

    map.current.on("style.load", () => {
      if (!map.current) return;

      console.log(
        "Initial style loaded, isStyleLoaded:",
        map.current.isStyleLoaded()
      );

      if (isDark) {
        map.current.setFog({
          color: "rgb(100, 120, 150)",
          "high-color": "rgb(20, 40, 80)",
          "horizon-blend": 0.02,
          "space-color": "rgb(5, 10, 20)",
          "star-intensity": 0.8,
        });
      } else {
        map.current.setFog({
          color: "rgb(200, 220, 240)",
          "high-color": "rgb(80, 120, 200)",
          "horizon-blend": 0.02,
          "space-color": "rgb(230, 240, 255)",
          "star-intensity": 0.3,
        });
      }

      setIsLoaded(true);
    });

    let userInteracting = false;
    let spinEnabled = true;

    const spinGlobe = () => {
      if (!map.current || !spinEnabled || userInteracting) return;

      const center = map.current.getCenter();
      center.lng -= 0.2;
      map.current.easeTo({ center, duration: 500 });
    };

    const spinInterval = setInterval(spinGlobe, 500);

    map.current.on("mousedown", () => {
      userInteracting = true;
    });
    map.current.on("mouseup", () => {
      userInteracting = false;
      setTimeout(() => {
        spinEnabled = true;
      }, 2000);
    });
    map.current.on("dragstart", () => {
      userInteracting = true;
    });
    map.current.on("dragend", () => {
      userInteracting = false;
      setTimeout(() => {
        spinEnabled = true;
      }, 2000);
    });

    return () => {
      clearInterval(spinInterval);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isDark]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current || resolvedTheme === undefined) return;

    console.log(
      "Theme useEffect triggered, isDark:",
      isDark,
      "resolvedTheme:",
      resolvedTheme
    );

    setIsLoaded(false);
    const newStyle = isDark
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";
    map.current.setStyle(newStyle);

    map.current.once("style.load", () => {
      if (!map.current) return;

      console.log(
        "Theme style loaded, isStyleLoaded:",
        map.current.isStyleLoaded()
      );

      if (isDark) {
        map.current.setFog({
          color: "rgb(100, 120, 150)",
          "high-color": "rgb(20, 40, 80)",
          "horizon-blend": 0.02,
          "space-color": "rgb(5, 10, 20)",
          "star-intensity": 0.8,
        });
      } else {
        map.current.setFog({
          color: "rgb(200, 220, 240)",
          "high-color": "rgb(80, 120, 200)",
          "horizon-blend": 0.02,
          "space-color": "rgb(230, 240, 255)",
          "star-intensity": 0.3,
        });
      }

      setIsLoaded(true);
    });
  }, [isDark, resolvedTheme]);

  // Add exchange markers
  useEffect(() => {
    if (!map.current || !isLoaded || !map.current.isStyleLoaded()) return;

    console.log("Exchange markers useEffect triggered, isLoaded:", isLoaded);

    Object.values(markersRef.current).forEach((marker) => {
      if (marker.getElement().classList.contains("exchange-marker")) {
        marker.remove();
      }
    });

    const filteredExchanges = exchanges.filter(
      (exchange) =>
        memoizedFilters.exchanges.length === 0 ||
        memoizedFilters.exchanges.includes(exchange.id)
    );

    filteredExchanges.forEach((exchange) => {
      const isSelected = selectedExchange === exchange.id;

      const el = document.createElement("div");
      el.className = "exchange-marker";
      el.style.cssText = `
        width: ${isSelected ? "16px" : "12px"};
        height: ${isSelected ? "16px" : "12px"};
        background-color: ${isSelected ? "#FFB800" : "#00FF88"};
        border: 2px solid ${isSelected ? "#FFD700" : "#00FF88"};
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 ${isSelected ? "20px" : "10px"} ${
        isSelected ? "#FFB800" : "#00FF88"
      }40;
        animation: pulse 2s infinite;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.5)";
        el.style.boxShadow = `0 0 25px ${isSelected ? "#FFB800" : "#00FF88"}80`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = `0 0 ${isSelected ? "20px" : "10px"} ${
          isSelected ? "#FFB800" : "#00FF88"
        }40`;
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([exchange.coordinates[1], exchange.coordinates[0]])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedExchange(exchange.id);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="background: ${isDark ? "#1a1a1a" : "#ffffff"}; color: ${
        isDark ? "white" : "black"
      }; padding: 12px; border-radius: 8px; border: 1px solid ${
        isDark ? "#333" : "#ddd"
      };">
            <h3 style="margin: 0 0 8px 0; color: #00FF88; font-size: 14px;">${
              exchange.name
            }</h3>
            <p style="margin: 0; font-size: 12px; color: ${
              isDark ? "#ccc" : "#666"
            };">Region: ${exchange.region}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${
              isDark ? "#ccc" : "#666"
            };">Status: <span style="color: #00FF88;">${
        exchange.status
      }</span></p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${
              isDark ? "#ccc" : "#666"
            };">Volume: $${(exchange.volume24h / 1000000000).toFixed(2)}B</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current[`exchange-${exchange.id}`] = marker;
    });
  }, [
    isLoaded,
    memoizedFilters.exchanges,
    selectedExchange,
    setSelectedExchange,
  ]);

  // Add cloud region markers
  useEffect(() => {
    if (!map.current || !isLoaded || !map.current.isStyleLoaded()) return;

    console.log("Cloud markers useEffect triggered, isLoaded:", isLoaded);

    Object.values(markersRef.current).forEach((marker) => {
      if (marker.getElement().classList.contains("cloud-marker")) {
        marker.remove();
      }
    });

    const filteredRegions = cloudRegions.filter((region) =>
      memoizedFilters.cloudProviders.includes(region.provider)
    );

    const providerColors = {
      AWS: "#FF9500",
      GCP: "#4285F4",
      Azure: "#00D4FF",
    };

    filteredRegions.forEach((region) => {
      const isSelected = selectedCloudRegion === region.id;
      const color = providerColors[region.provider];

      const el = document.createElement("div");
      el.className = "cloud-marker";
      el.style.cssText = `
        width: ${isSelected ? "14px" : "10px"};
        height: ${isSelected ? "14px" : "10px"};
        background-color: ${isSelected ? "#FFFFFF" : color};
        border: 2px solid ${color};
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 ${isSelected ? "15px" : "8px"} ${color}40;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
        el.style.boxShadow = `0 0 20px ${color}80`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = `0 0 ${isSelected ? "15px" : "8px"} ${color}40`;
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([region.coordinates[1], region.coordinates[0]])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedCloudRegion(region.id);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="background: ${isDark ? "#1a1a1a" : "#ffffff"}; color: ${
        isDark ? "white" : "black"
      }; padding: 12px; border-radius: 8px; border: 1px solid ${
        isDark ? "#333" : "#ddd"
      };">
            <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 14px;">${
        region.provider
      } ${region.location}</h3>
            <p style="margin: 0; font-size: 12px; color: ${
              isDark ? "#ccc" : "#666"
            };">Region: ${region.regionCode}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${
              isDark ? "#ccc" : "#666"
            };">Zones: ${region.zones.join(", ")}</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current[`cloud-${region.id}`] = marker;
    });
  }, [
    isLoaded,
    memoizedFilters.cloudProviders,
    selectedCloudRegion,
    setSelectedCloudRegion,
    isDark,
  ]);

  // Add latency connections with animation and Tooltip
  useEffect(() => {
    if (!map.current || !isLoaded || !realTimeEnabled) return;

    console.log("Latency useEffect triggered, dependencies:", {
      isLoaded,
      latencyData: JSON.stringify(latencyData, null, 2),
      memoizedFilters: JSON.stringify(memoizedFilters, null, 2),
      realTimeEnabled,
      isDark,
    });

    const addLatencyLayers = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        console.warn("Style not loaded, deferring addLatencyLayers");
        return;
      }

      console.log(
        "Adding latency layers, isStyleLoaded:",
        map.current.isStyleLoaded()
      );

      // Remove existing connection layers and source if they exist
      const layers = ["latency-connections", "latency-connections-glow"];
      layers.forEach((layer) => {
        if (map.current!.getLayer(layer)) {
          map.current!.removeLayer(layer);
        }
      });
      if (map.current.getSource("latency-connections")) {
        map.current.removeSource("latency-connections");
      }

      // Log all exchange and cloud region IDs for debugging
      console.log(
        "Available exchange IDs:",
        exchanges.map((e) => e.id)
      );
      console.log(
        "Available cloud region IDs:",
        cloudRegions.map((r) => r.id)
      );

      // Filter latency data with strict validation
      const filteredLatencyData = latencyData.filter((data) => {
        const exchange = exchanges.find((e) => e.id === data.exchangeId);
        const region = cloudRegions.find((r) => r.id === data.cloudRegionId);

        if (!exchange || !region) {
          console.warn(
            `Invalid latency data: exchangeId=${data.exchangeId}, cloudRegionId=${data.cloudRegionId}, latency=${data.latency}, packetLoss=${data.packetLoss}`
          );
          return false;
        }

        const passesFilter =
          (memoizedFilters.exchanges.length === 0 ||
            memoizedFilters.exchanges.includes(exchange.id)) &&
          memoizedFilters.cloudProviders.includes(region.provider) &&
          data.latency >= memoizedFilters.latencyRange[0] &&
          data.latency <= memoizedFilters.latencyRange[1];

        console.log(
          `Filtering data: exchangeId=${data.exchangeId}, cloudRegionId=${data.cloudRegionId}, latency=${data.latency}, passesFilter=${passesFilter}`
        );
        return passesFilter;
      });

      console.log(
        "Filtered Latency Data:",
        JSON.stringify(filteredLatencyData, null, 2)
      );

      // Create GeoJSON for connections
      const connectionFeatures: Feature<Geometry, ConnectionProperties>[] =
        filteredLatencyData
          .map((data) => {
            const exchange = exchanges.find((e) => e.id === data.exchangeId);
            const region = cloudRegions.find(
              (r) => r.id === data.cloudRegionId
            );

            if (!exchange || !region) {
              console.warn(
                `Skipping feature creation: exchangeId=${data.exchangeId}, cloudRegionId=${data.cloudRegionId}`
              );
              return null;
            }

            let color = "#00FF88"; // Green
            if (data.latency >= 150) color = "#FF3366"; // Red
            else if (data.latency >= 50) color = "#FFB800"; // Yellow

            const feature = {
              type: "Feature",
              properties: {
                latency: data.latency,
                color,
                opacity: Math.max(0.3, 1 - data.latency / 500),
                exchangeName: exchange.name || "Unknown Exchange",
                regionName:
                  `${region.provider} ${region.location}` || "Unknown Region",
                packetLoss: data.packetLoss,
              },
              geometry: {
                type: "LineString",
                coordinates: [
                  [exchange.coordinates[1], exchange.coordinates[0]],
                  [region.coordinates[1], region.coordinates[0]],
                ],
              },
            } as Feature<Geometry, ConnectionProperties>;

            console.log(
              `Created feature: exchange=${feature.properties.exchangeName}, region=${feature.properties.regionName}, latency=${feature.properties.latency}, packetLoss=${feature.properties.packetLoss}`
            );
            return feature;
          })
          .filter(
            (feature): feature is Feature<Geometry, ConnectionProperties> =>
              feature !== null
          );

      console.log(
        "Connection Features:",
        JSON.stringify(connectionFeatures, null, 2)
      );

      if (connectionFeatures.length > 0) {
        // Add connection source
        map.current.addSource("latency-connections", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: connectionFeatures,
          },
        });

        // Add main connection layer (animated dashed line)
        map.current.addLayer({
          id: "latency-connections",
          type: "line",
          source: "latency-connections",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": ["get", "color"],
            "line-width": 4,
            "line-opacity": ["get", "opacity"],
            "line-dasharray": [2, 2],
          },
        });

        // Add glow layer for pulsing effect
        map.current.addLayer({
          id: "latency-connections-glow",
          type: "line",
          source: "latency-connections",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": ["get", "color"],
            "line-width": 8,
            "line-opacity": 0.3,
            "line-blur": 4,
          },
        });

        // Animate dashed lines
        let dashOffset = 0;
        const animateLines = () => {
          if (!map.current || !map.current.isStyleLoaded()) return;
          dashOffset += 0.1;
          if (dashOffset > 4) dashOffset = 0;
          map.current.setPaintProperty(
            "latency-connections",
            "line-dasharray",
            [2, 2 + dashOffset]
          );
          map.current.setPaintProperty(
            "latency-connections-glow",
            "line-opacity",
            0.3 + Math.sin(Date.now() / 500) * 0.1
          );
          animationFrameId.current = requestAnimationFrame(animateLines);
        };

        animationFrameId.current = requestAnimationFrame(animateLines);
      }

      // Add hover interaction for Tooltip
      map.current.on("mouseenter", "latency-connections", (e) => {
        if (!map.current || !e.features || !e.features[0]) {
          console.warn(
            "No features found on mouseenter:",
            JSON.stringify(e, null, 2)
          );
          return;
        }

        const feature = e.features[0];
        const properties = feature.properties as ConnectionProperties;

        console.log(
          `Mouseenter event: exchange=${properties.exchangeName}, region=${properties.regionName}, latency=${properties.latency}, packetLoss=${properties.packetLoss}`
        );

        if (!properties || !properties.exchangeName || !properties.regionName) {
          console.warn(
            "Invalid properties for feature:",
            JSON.stringify(properties, null, 2)
          );
          setTooltipData(null);
          return;
        }

        map.current.getCanvas().style.cursor = "pointer";

        // Convert lngLat to screen coordinates
        const point = map.current.project(e.lngLat!);
        setTooltipData({
          exchangeName: properties.exchangeName,
          regionName: properties.regionName,
          latency: properties.latency,
          packetLoss: properties.packetLoss,
          x: point.x + 10,
          y: point.y - 60, // Offset above cursor
        });
      });

      map.current.on("mousemove", "latency-connections", (e) => {
        if (!map.current || !tooltipData) return;

        const point = map.current.project(e.lngLat!);
        setTooltipData((prev) =>
          prev
            ? {
                ...prev,
                x: point.x + 10,
                y: point.y - 60,
              }
            : null
        );
      });

      map.current.on("mouseleave", "latency-connections", () => {
        if (!map.current) return;

        console.log("Mouseleave event triggered");

        map.current.getCanvas().style.cursor = "";
        setTooltipData(null);
      });
    };

    if (isLoaded && map.current.isStyleLoaded()) {
      addLatencyLayers();
    } else {
      console.warn("Deferring addLatencyLayers until style is loaded");
    }

    const styleLoadListener = () => {
      console.log("Style load listener triggered for latency layers");
      addLatencyLayers();
    };
    map.current.on("style.load", styleLoadListener);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (map.current) {
        map.current.off("style.load", styleLoadListener);
        const layers = ["latency-connections", "latency-connections-glow"];
        layers.forEach((layer) => {
          if (map.current!.getLayer(layer)) {
            map.current!.removeLayer(layer);
          }
        });
        if (map.current.getSource("latency-connections")) {
          map.current.removeSource("latency-connections");
        }
      }
    };
  }, [isLoaded, latencyData, memoizedFilters, realTimeEnabled, isDark]);

  // Add heatmap layer
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    console.log("Heatmap useEffect triggered, dependencies:", {
      isLoaded,
      showHeatmap,
      latencyData,
    });

    const addHeatmapLayer = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        console.warn("Style not loaded, deferring addHeatmapLayer");
        return;
      }

      console.log(
        "Adding heatmap layer, isStyleLoaded:",
        map.current.isStyleLoaded()
      );

      if (map.current.getLayer("latency-heatmap")) {
        map.current.removeLayer("latency-heatmap");
      }
      if (map.current.getSource("latency-heatmap")) {
        map.current.removeSource("latency-heatmap");
      }

      if (showHeatmap) {
        const heatmapPoints: Feature<Geometry, HeatmapProperties>[] =
          latencyData
            .map((data) => {
              const region = cloudRegions.find(
                (r) => r.id === data.cloudRegionId
              );
              if (!region) {
                console.warn(
                  `Missing region: cloudRegionId=${data.cloudRegionId}`
                );
                return null;
              }

              return {
                type: "Feature",
                properties: {
                  intensity: Math.min(1, data.latency / 200),
                },
                geometry: {
                  type: "Point",
                  coordinates: [region.coordinates[1], region.coordinates[0]],
                },
              } as Feature<Geometry, HeatmapProperties>;
            })
            .filter(
              (feature): feature is Feature<Geometry, HeatmapProperties> =>
                feature !== null
            );

        if (heatmapPoints.length > 0) {
          map.current.addSource("latency-heatmap", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: heatmapPoints,
            },
          });

          map.current.addLayer({
            id: "latency-heatmap",
            type: "heatmap",
            source: "latency-heatmap",
            maxzoom: 9,
            paint: {
              "heatmap-weight": ["get", "intensity"],
              "heatmap-intensity": {
                type: "exponential",
                stops: [
                  [0, 1],
                  [9, 3],
                ],
              },
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(33,102,172,0)",
                0.2,
                "rgb(103,169,207)",
                0.4,
                "rgb(209,229,240)",
                0.6,
                "rgb(253,219,199)",
                0.8,
                "rgb(239,138,98)",
                1,
                "rgb(178,24,43)",
              ],
              "heatmap-radius": {
                type: "exponential",
                stops: [
                  [0, 20],
                  [9, 40],
                ],
              },
              "heatmap-opacity": 0.8,
            },
          });
        }
      }
    };

    if (isLoaded && map.current.isStyleLoaded()) {
      addHeatmapLayer();
    } else {
      console.warn("Deferring addHeatmapLayer until style is loaded");
    }

    const styleLoadListener = () => {
      console.log("Style load listener triggered for heatmap layer");
      addHeatmapLayer();
    };
    map.current.on("style.load", styleLoadListener);

    return () => {
      if (map.current) {
        map.current.off("style.load", styleLoadListener);
        if (map.current.getLayer("latency-heatmap")) {
          map.current.removeLayer("latency-heatmap");
        }
        if (map.current.getSource("latency-heatmap")) {
          map.current.removeSource("latency-heatmap");
        }
      }
    };
  }, [isLoaded, showHeatmap, latencyData]);

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: "100vh", position: "relative" }}
      />
      {tooltipData && (
        <div
          style={{
            position: "absolute",
            left: tooltipData.x,
            top: tooltipData.y,
            zIndex: 10000,
            pointerEvents: "none",
            transform: "translate(-50%, 0)",
          }}
        >
          <div
            className={`px-3 py-2 rounded-lg shadow-lg border text-xs font-medium ${
              isDark
                ? "bg-slate-800 border-slate-600 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
            style={{ minWidth: "200px" }}
          >
            <div className="font-semibold mb-1 text-center">
              {tooltipData.exchangeName} → {tooltipData.regionName}
            </div>
            <div className="flex justify-between items-center">
              <span>Latency:</span>
              <span
                className={
                  tooltipData.latency < 50
                    ? "text-green-400"
                    : tooltipData.latency < 150
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {tooltipData.latency}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Packet Loss:</span>
              <span
                className={
                  tooltipData.packetLoss < 1
                    ? "text-green-400"
                    : tooltipData.packetLoss < 3
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {tooltipData.packetLoss.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 currentColor;
          }
          70% {
            box-shadow: 0 0 0 10px transparent;
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
          }
        }

        .recharts-tooltip-wrapper {
          z-index: 10000 !important;
          pointer-events: none;
        }

        .recharts-default-tooltip {
          background-color: ${isDark ? "#1E293B" : "#ffffff"} !important;
          border: 1px solid ${isDark ? "#475569" : "#e2e8f0"} !important;
          border-radius: 8px !important;
          color: ${isDark ? "#F8FAFC" : "#1e293b"} !important;
          padding: 8px !important;
          font-size: 12px !important;
          max-width: 250px !important;
          font-family: Arial, sans-serif !important;
        }
      `}</style>
    </>
  );
};

export default MapboxGlobe;
