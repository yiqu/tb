'use client';

import { useRef, useEffect } from 'react';

import { PET_ZOO_BALL_COLOR, PET_ZOO_BALL_RADIUS_PX } from '../constants/pet-zoo.constants';

import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooBallProps {
  engine: PetZooEngine;
}

/** The ball. Hidden until one is thrown, then the engine moves it every frame. */
export default function PetZooBall({ engine }: PetZooBallProps) {
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
      className="absolute bottom-0 left-0 z-10 hidden rounded-full will-change-transform"
      style={ {
        width: PET_ZOO_BALL_RADIUS_PX * 2,
        height: PET_ZOO_BALL_RADIUS_PX * 2,
        backgroundColor: PET_ZOO_BALL_COLOR,
      } }
      aria-hidden="true"
    />
  );
}
