'use client';

import { useState, useEffect } from 'react';

import { PetZooEngine } from '../engine/pet-zoo-engine';

/** One engine per zoo, running while the zoo is mounted. */
export function usePetZooEngine(): PetZooEngine {
  const [engine] = useState<PetZooEngine>(() => {
    return new PetZooEngine();
  });

  useEffect(() => {
    engine.start();
    return () => {
      engine.stop();
    };
  }, [engine]);

  return engine;
}
