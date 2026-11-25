'use client';

import { useState, useEffect, RefObject } from 'react';

import { PetZooEngine } from '../engine/pet-zoo-engine';

/**
 * One engine per zoo. It only runs while the zoo is on screen: it pauses while the zoo is hidden
 * (e.g. the left nav collapsed to icons) or scrolled out of view, and goes on where it left off.
 */
export function usePetZooEngine(zooRef: RefObject<HTMLElement | null>): PetZooEngine {
  const [engine] = useState<PetZooEngine>(() => {
    return new PetZooEngine();
  });

  useEffect(() => {
    const zoo: HTMLElement | null = zooRef.current;
    if (!zoo || typeof IntersectionObserver === 'undefined') {
      engine.start();
      return () => {
        engine.stop();
      };
    }
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const latest: IntersectionObserverEntry | undefined = entries[entries.length - 1];
      if (latest?.isIntersecting) {
        engine.start();
      } else {
        engine.stop();
      }
    });
    observer.observe(zoo);
    return () => {
      observer.disconnect();
      engine.stop();
    };
  }, [engine, zooRef]);

  return engine;
}
