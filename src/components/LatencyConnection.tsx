"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, TubeGeometry } from "three";
import { exchanges, cloudRegions } from "@/data/mockData";
import type { LatencyData } from "@/types";

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number = 5) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const getLatencyColor = (latency: number) => {
  if (latency < 50) return "#00FF88";
  if (latency < 150) return "#FFB800";
  return "#FF3366"; // Red
};

const LatencyConnection = ({ connection }: { connection: LatencyData }) => {
  const meshRef = useRef<any>();

  const { curve, color, opacity } = useMemo(() => {
    const exchange = exchanges.find((e) => e.id === connection.exchangeId);
    const region = cloudRegions.find((r) => r.id === connection.cloudRegionId);

    if (!exchange || !region) {
      return { curve: null, color: "#FFFFFF", opacity: 0 };
    }

    const startPos = latLngToVector3(
      exchange.coordinates[0],
      exchange.coordinates[1],
      5.1
    );
    const endPos = latLngToVector3(
      region.coordinates[0],
      region.coordinates[1],
      5.15
    );

    // Create an arc between the two points
    const midPoint = new Vector3()
      .addVectors(startPos, endPos)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(6); // Raise the arc above the surface

    const curve = new CatmullRomCurve3([startPos, midPoint, endPos]);
    const color = getLatencyColor(connection.latency);
    const opacity = Math.max(0.3, 1 - connection.latency / 500);

    return { curve, color, opacity };
  }, [connection]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing animation based on latency
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      meshRef.current.material.opacity = opacity * pulse;
    }
  });

  if (!curve) return null;

  const geometry = new TubeGeometry(curve, 20, 0.01, 8, false);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

export default LatencyConnection;
