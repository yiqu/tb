'use client';

import { useState, useEffect, RefObject } from 'react';

import { PixelPalsEngine } from '../engine/pixel-pals-engine';

/**
 * One engine per Pixel Pals instance. It only runs while Pixel Pals is on screen: it pauses while Pixel Pals is hidden
 * (e.g. the left nav collapsed to icons) or scrolled out of view, and goes on where it left off.
 */
export function usePixelPalsEngine(pixelPalsRef: RefObject<HTMLElement | null>): PixelPalsEngine {
  const [engine] = useState<PixelPalsEngine>(() => {
    return new PixelPalsEngine();
  });

  useEffect(() => {
    const element: HTMLElement | null = pixelPalsRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      engine.start();
      return () => {
        engine.stop();
      };
    }
    // a callback already queued when the effect cleans up still runs after `disconnect`, it must not restart the engine
    let isActive = true;
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (!isActive) {
        return;
      }
      const latest: IntersectionObserverEntry | undefined = entries[entries.length - 1];
      if (latest?.isIntersecting) {
        engine.start();
      } else {
        engine.stop();
      }
    });
    observer.observe(element);
    return () => {
      isActive = false;
      observer.disconnect();
      engine.stop();
    };
  }, [engine, pixelPalsRef]);

  return engine;
}
