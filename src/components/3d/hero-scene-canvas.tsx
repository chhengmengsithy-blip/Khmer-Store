"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function RotatingShape() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.2}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <MeshDistortMaterial
        color="#C6A769"
        metalness={0.9}
        roughness={0.15}
        distort={0.1}
        speed={1.5}
      />
    </mesh>
  );
}

export function HeroSceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      className="h-full w-full"
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#C6A769" />
      <RotatingShape />
    </Canvas>
  );
}
