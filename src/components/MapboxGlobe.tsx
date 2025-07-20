"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useStore } from "@/hooks/useStore";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import type { Feature, Geometry } from "geojson";

// Set Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2ttdXNoYXJhZjEwIiwiYSI6ImNsd2RxZ3A1YzE3MW4ycXBwMDZieDl3Z3cifQ.Y3P6YoJSYwi_3w66luCAqg";

// Define types for GeoJSON properties
interface ConnectionProperties {
  latency: number;
  color: string;
  opacity: number;
}

interface HeatmapProperties {
  intensity: number;
}

const MapboxGlobe = () => {
  const { isDark } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const {
    selectedExchange,
    selectedCloudRegion,
    filters,
    realTimeEnabled,
    isDark,
    showHeatmap,
    setSelectedExchange,
    setSelectedCloudRegion,
  } = useStore();

  const { latencyData } = useRealTimeLatency();

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11",
      projection: { name: "globe" }, // Updated to ProjectionSpecification
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
    });

    // Add atmosphere and space styling
    map.current.on("style.load", () => {
      if (!map.current) return;

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

    // Auto-rotate the globe
    let userInteracting = false;
    let spinEnabled = true;

    const spinGlobe = () => {
      if (!map.current || !spinEnabled || userInteracting) return;

      const center = map.current.getCenter();
      center.lng -= 0.2;
      map.current.easeTo({ center, duration: 1000 });
    };

    const spinInterval = setInterval(spinGlobe, 1000);

    // Pause spinning on user interaction
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
    if (!map.current || !isLoaded) return;

    const newStyle = isDark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11";
    map.current.setStyle(newStyle);

    map.current.once("style.load", () => {
      if (!map.current) return;

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
    });
  }, [isDark, isLoaded]);
  // Add exchange markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing exchange markers
    Object.values(markersRef.current).forEach((marker) => {
      if (marker.getElement().classList.contains("exchange-marker")) {
        marker.remove();
      }
    });

    // Filter exchanges based on current filters
    const filteredExchanges = exchanges.filter(
      (exchange) =>
        filters.exchanges.length === 0 ||
        filters.exchanges.includes(exchange.id)
    );

    filteredExchanges.forEach((exchange) => {
      const isSelected = selectedExchange === exchange.id;

      // Create custom marker element
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

      // Add hover effects
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

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([exchange.coordinates[1], exchange.coordinates[0]])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener("click", () => {
        setSelectedExchange(exchange.id);
      });

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="background: ${isDark ? '#1a1a1a' : '#ffffff'}; color: ${isDark ? 'white' : 'black'}; padding: 12px; border-radius: 8px; border: 1px solid ${isDark ? '#333' : '#ddd'};">
            <h3 style="margin: 0 0 8px 0; color: #00FF88; font-size: 14px;">${
              exchange.name
            }</h3>
            <p style="margin: 0; font-size: 12px; color: ${isDark ? '#ccc' : '#666'};">Region: ${
              exchange.region
            }</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${isDark ? '#ccc' : '#666'};">Status: <span style="color: #00FF88;">${
              exchange.status
            }</span></p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${isDark ? '#ccc' : '#666'};">Volume: $${(
              exchange.volume24h / 1000000000
            ).toFixed(2)}B</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current[`exchange-${exchange.id}`] = marker;
    });
  }, [isLoaded, filters.exchanges, selectedExchange, setSelectedExchange]);

  // Add cloud region markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing cloud region markers
    Object.values(markersRef.current).forEach((marker) => {
      if (marker.getElement().classList.contains("cloud-marker")) {
        marker.remove();
      }
    });

    // Filter cloud regions based on current filters
    const filteredRegions = cloudRegions.filter((region) =>
      filters.cloudProviders.includes(region.provider)
    );

    const providerColors = {
      AWS: "#FF9500",
      GCP: "#4285F4",
      Azure: "#00D4FF",
    };

    filteredRegions.forEach((region) => {
      const isSelected = selectedCloudRegion === region.id;
      const color = providerColors[region.provider];

      // Create custom marker element
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

      // Add hover effects
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
        el.style.boxShadow = `0 0 20px ${color}80`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = `0 0 ${isSelected ? "15px" : "8px"} ${color}40`;
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([region.coordinates[1], region.coordinates[0]])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener("click", () => {
        setSelectedCloudRegion(region.id);
      });

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="background: ${isDark ? '#1a1a1a' : '#ffffff'}; color: ${isDark ? 'white' : 'black'}; padding: 12px; border-radius: 8px; border: 1px solid ${isDark ? '#333' : '#ddd'};">
            <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 14px;">${
        region.provider
      } ${region.location}</h3>
            <p style="margin: 0; font-size: 12px; color: ${isDark ? '#ccc' : '#666'};">Region: ${
              region.regionCode
            }</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${isDark ? '#ccc' : '#666'};">Zones: ${region.zones.join(
              ", "
            )}</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current[`cloud-${region.id}`] = marker;
    });
  }, [
    isLoaded,
    filters.cloudProviders,
    selectedCloudRegion,
    setSelectedCloudRegion,
    isDark,
  ]);

  // Add latency connections
  useEffect(() => {
    if (!map.current || !isLoaded || !realTimeEnabled) return;

    // Remove existing connection layers
    if (map.current.getLayer("latency-connections")) {
      map.current.removeLayer("latency-connections");
    }
    if (map.current.getSource("latency-connections")) {
      map.current.removeSource("latency-connections");
    }

    // Filter latency data based on current filters
    const filteredLatencyData = latencyData.filter((data) => {
      const exchange = exchanges.find((e) => e.id === data.exchangeId);
      const region = cloudRegions.find((r) => r.id === data.cloudRegionId);

      return (
        exchange &&
        region &&
        (filters.exchanges.length === 0 ||
          filters.exchanges.includes(exchange.id)) &&
        filters.cloudProviders.includes(region.provider) &&
        data.latency >= filters.latencyRange[0] &&
        data.latency <= filters.latencyRange[1]
      );
    });

    // Create GeoJSON for connections
    const connectionFeatures: Feature<Geometry, ConnectionProperties>[] =
      filteredLatencyData
        .map((data) => {
          const exchange = exchanges.find((e) => e.id === data.exchangeId);
          const region = cloudRegions.find((r) => r.id === data.cloudRegionId);

          if (!exchange || !region) return null;

          // Determine color based on latency
          let color = "#00FF88"; // Green
          if (data.latency >= 150) color = "#FF3366"; // Red
          else if (data.latency >= 50) color = "#FFB800"; // Yellow

          return {
            type: "Feature",
            properties: {
              latency: data.latency,
              color,
              opacity: Math.max(0.3, 1 - data.latency / 500),
              exchangeName: exchange.name,
              regionName: `${region.provider} ${region.location}`,
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
        })
        .filter(
          (feature): feature is Feature<Geometry, ConnectionProperties> =>
            feature !== null
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

      // Add connection layer
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
        },
      });

      // Add hover interaction for connection lines
      map.current.on("mouseenter", "latency-connections", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        
        map.current.getCanvas().style.cursor = "pointer";
        
        const feature = e.features[0];
        const properties = feature.properties;
        
        if (properties) {
          // Remove existing popup
          if ((map.current as any)._connectionPopup) {
            (map.current as any)._connectionPopup.remove();
          }
          
          const popup = new mapboxgl.Popup({ 
            closeButton: false,
            closeOnClick: false,
            offset: 15,
            className: 'latency-popup'
          })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="background: ${isDark ? '#1a1a1a' : '#ffffff'}; color: ${isDark ? 'white' : 'black'}; padding: 8px; border-radius: 6px; border: 1px solid ${isDark ? '#333' : '#ddd'}; font-size: 12px;">
                <div style="font-weight: bold; margin-bottom: 8px; color: ${isDark ? '#fff' : '#000'};">
                  ${properties.exchangeName} → ${properties.regionName}
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: ${isDark ? '#ccc' : '#666'};">Latency:</span>
                  <span style="color: ${properties.color}; font-weight: bold;">${properties.latency}ms</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: ${isDark ? '#ccc' : '#666'};">Quality:</span>
                  <span style="color: ${properties.latency < 50 ? '#00FF88' : properties.latency < 150 ? '#FFB800' : '#FF3366'};">
                    ${properties.latency < 50 ? 'Excellent' : properties.latency < 150 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: ${isDark ? '#ccc' : '#666'};">Packet Loss:</span>
                  <span style="color: ${properties.packetLoss < 1 ? '#00FF88' : properties.packetLoss < 3 ? '#FFB800' : '#FF3366'};">
                    ${properties.packetLoss.toFixed(1)}%
                  </span>
                </div>
              </div>
            `)
            .addTo(map.current);
          
          // Store popup reference to remove it later
          (map.current as any)._connectionPopup = popup;
        }
      });

      map.current.on("mouseleave", "latency-connections", () => {
        if (!map.current) return;
        
        map.current.getCanvas().style.cursor = "";
        
        // Remove the popup
        if ((map.current as any)._connectionPopup) {
          (map.current as any)._connectionPopup.remove();
          (map.current as any)._connectionPopup = null;
        }
      });
    }
  }, [isLoaded, latencyData, filters, realTimeEnabled]);

  // Add heatmap layer
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    if (showHeatmap) {
      // Remove existing heatmap
      if (map.current.getLayer("latency-heatmap")) {
        map.current.removeLayer("latency-heatmap");
      }
      if (map.current.getSource("latency-heatmap")) {
        map.current.removeSource("latency-heatmap");
      }

      // Create heatmap data points
      const heatmapPoints: Feature<Geometry, HeatmapProperties>[] = latencyData
        .map((data) => {
          const region = cloudRegions.find((r) => r.id === data.cloudRegionId);
          if (!region) return null;

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
    } else {
      // Remove heatmap
      if (map.current.getLayer("latency-heatmap")) {
        map.current.removeLayer("latency-heatmap");
      }
      if (map.current.getSource("latency-heatmap")) {
        map.current.removeSource("latency-heatmap");
      }
    }
  }, [isLoaded, showHeatmap, latencyData]);

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: "100vh" }}
      />

      {/* Add custom CSS for animations */}
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

        .mapboxgl-popup-content {
          background: ${isDark ? '#1a1a1a' : '#ffffff'} !important;
          border: 1px solid ${isDark ? '#333' : '#ddd'} !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        }

        .mapboxgl-popup-tip {
          border-top-color: ${isDark ? '#1a1a1a' : '#ffffff'} !important;
        }

        .mapboxgl-popup-close-button {
          color: ${isDark ? '#fff' : '#000'} !important;
          font-size: 16px !important;
          padding: 4px !important;
        }

        .mapboxgl-popup-close-button:hover {
          background: ${isDark ? '#333' : '#f0f0f0'} !important;
          border-radius: 4px !important;
        }
      `}</style>
    </>
  );
};

export default MapboxGlobe;
