// src/components/Globe.tsx
"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { exchanges, cloudRegions } from "@/data/mockData";
import { useStore } from "@/hooks/useStore";
import { useLatencyData } from "@/hooks/useLatencyData";

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { filters, realTimeEnabled } = useStore();
  const { latencyData } = useLatencyData();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x020617); // Background gradient can be approximated

    // Earth
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2332,
      roughness: 0.8,
      metalness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 8;
    controls.maxDistance = 20;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

    // Add markers (simplified for exchanges)
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    exchanges.forEach((exchange) => {
      const position = latLngToVector3(
        exchange.coordinates[0],
        exchange.coordinates[1],
        5.1
      );
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      scene.add(marker);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [filters, latencyData, realTimeEnabled]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

// Helper function (same as in your original Globe.tsx)
function latLngToVector3(lat: number, lng: number, radius: number = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default Globe;
