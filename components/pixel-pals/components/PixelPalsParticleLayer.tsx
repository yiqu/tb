'use client';

import { useRef, useEffect } from 'react';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsParticleLayerProps {
  engine: PixelPalsEngine;
}

/** The weather (snow, leaves, debris, rain or fog) in front of the scene. The engine sizes the canvas and draws on it every frame. */
export default function PixelPalsParticleLayer({ engine }: PixelPalsParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    engine.attachParticleCanvas(canvasRef.current);
    return () => {
      engine.attachParticleCanvas(null);
    };
  }, [engine]);

  return <canvas ref={ canvasRef } aria-hidden="true" className="pixel-pals-pixelated pointer-events-none absolute inset-0 z-25 size-full" />;
}
