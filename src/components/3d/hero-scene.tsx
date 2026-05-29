"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { SceneLoader } from "./scene-loader";

const HeroSceneCanvas = dynamic(
  () =>
    import("./hero-scene-canvas").then((mod) => ({
      default: mod.HeroSceneCanvas,
    })),
  { ssr: false }
);

export function HeroScene() {
  return (
    <div className="h-full w-full">
      <Suspense fallback={<SceneLoader />}>
        <HeroSceneCanvas />
      </Suspense>
    </div>
  );
}
