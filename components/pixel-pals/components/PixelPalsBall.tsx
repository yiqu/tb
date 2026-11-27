'use client';

import { useRef, useEffect } from 'react';

import { PIXEL_PALS_BALL_COLOR, PIXEL_PALS_BALL_RADIUS_PX } from '../constants/pixel-pals.constants';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsBallProps {
  engine: PixelPalsEngine;
}

/** The ball. Hidden until one is thrown, then the engine moves it every frame. */
export default function PixelPalsBall({ engine }: PixelPalsBallProps) {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    engine.attachBallElement(ballRef.current);
    return () => {
      engine.attachBallElement(null);
    };
  }, [engine]);

  return (
    <div
      ref={ ballRef }
      className="pointer-events-none absolute bottom-0 left-0 z-10 hidden rounded-full will-change-transform"
      style={ {
        width: PIXEL_PALS_BALL_RADIUS_PX * 2,
        height: PIXEL_PALS_BALL_RADIUS_PX * 2,
        backgroundColor: PIXEL_PALS_BALL_COLOR,
      } }
      aria-hidden="true"
    />
  );
}
