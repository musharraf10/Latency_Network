"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { ShaderMaterial, Vector3 } from "three";
import { useRealTimeLatency } from "@/hooks/useRealTimeLatency";

// Custom shader for heatmap visualization
const heatmapVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const heatmapFragmentShader = `
  uniform float time;
  uniform vec3 hotspots[10];
  uniform float intensities[10];
  uniform int hotspotCount;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  vec3 getHeatmapColor(float intensity) {
    // Blue to Red heatmap
    if (intensity < 0.25) {
      return mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), intensity * 4.0);
    } else if (intensity < 0.5) {
      return mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (intensity - 0.25) * 4.0);
    } else if (intensity < 0.75) {
      return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (intensity - 0.5) * 4.0);
    } else {
      return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (intensity - 0.75) * 4.0);
    }
  }
  
  void main() {
    float totalIntensity = 0.0;
    
    for (int i = 0; i < hotspotCount && i < 10; i++) {
      float distance = length(vPosition - hotspots[i]);
      float influence = exp(-distance * 2.0) * intensities[i];
      totalIntensity += influence;
    }
    
    totalIntensity = clamp(totalIntensity, 0.0, 1.0);
    
    vec3 heatColor = getHeatmapColor(totalIntensity);
    float alpha = totalIntensity * 0.6 + 0.1;
    
    // Add some animation
    alpha *= (sin(time * 2.0) * 0.1 + 0.9);
    
    gl_FragColor = vec4(heatColor, alpha);
  }
`;

const LatencyHeatmap = ({ visible = false }: { visible?: boolean }) => {
  const { latencyData } = useRealTimeLatency();
  const materialRef = useRef<ShaderMaterial>(null);

  // Convert latency data to heatmap hotspots
  const { hotspots, intensities } = useMemo(() => {
    if (!latencyData.length) return { hotspots: [], intensities: [] };

    // Group latency data by geographic regions
    const regionData = new Map<
      string,
      { position: Vector3; avgLatency: number; count: number }
    >();

    latencyData.forEach((data) => {
      // Simplified region mapping - in a real app, for proper coordinates
      const regionKey = data.cloudRegionId;

      if (!regionData.has(regionKey)) {
        // Converting region to approximate 3D position on sphere
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const position = new Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ).multiplyScalar(5.1);

        regionData.set(regionKey, {
          position,
          avgLatency: data.latency,
          count: 1,
        });
      } else {
        const existing = regionData.get(regionKey)!;
        existing.avgLatency =
          (existing.avgLatency * existing.count + data.latency) /
          (existing.count + 1);
        existing.count++;
      }
    });

    const hotspots: Vector3[] = [];
    const intensities: number[] = [];

    Array.from(regionData.values()).forEach((region) => {
      hotspots.push(region.position);
      // Converting latency to intensity (higher latency = higher intensity)
      const intensity = Math.min(1.0, region.avgLatency / 200);
      intensities.push(intensity);
    });

    return { hotspots, intensities };
  }, [latencyData]);

  // Updating the shader uniforms
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.hotspots.value = hotspots.slice(0, 10);
      materialRef.current.uniforms.intensities.value = intensities.slice(0, 10);
      materialRef.current.uniforms.hotspotCount.value = Math.min(
        hotspots.length,
        10
      );
    }
  });

  if (!visible) return null;

  return (
    <Sphere args={[5.2, 64, 64]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={heatmapVertexShader}
        fragmentShader={heatmapFragmentShader}
        uniforms={{
          time: { value: 0 },
          hotspots: { value: hotspots.slice(0, 10) },
          intensities: { value: intensities.slice(0, 10) },
          hotspotCount: { value: Math.min(hotspots.length, 10) },
        }}
        transparent
        depthWrite={false}
      />
    </Sphere>
  );
};

export default LatencyHeatmap;
// Completed
