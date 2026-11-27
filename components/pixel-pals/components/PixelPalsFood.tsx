'use client';

import { useRef, useEffect } from 'react';

import PixelPalsFoodSlot from './PixelPalsFoodSlot';
import { PIXEL_PALS_MAX_FOODS } from '../constants/pixel-pals-behavior.constants';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsFoodProps {
  engine: PixelPalsEngine;
}

const SLOTS: readonly number[] = Array.from({ length: PIXEL_PALS_MAX_FOODS }, (_: unknown, index: number) => {
  return index;
});

/** One hidden image slot per piece of food Pixel Pals can hold. The engine shows, swaps and moves them every frame. */
export default function PixelPalsFood({ engine }: PixelPalsFoodProps) {
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    engine.attachFoodElements(
      imageRefs.current.filter((image: HTMLImageElement | null): image is HTMLImageElement => {
        return image !== null;
      }),
    );
    return () => {
      engine.attachFoodElements([]);
    };
  }, [engine]);

  return SLOTS.map((slot: number) => {
    return (
      <PixelPalsFoodSlot
        key={ slot }
        ref={ (image: HTMLImageElement | null) => {
          imageRefs.current[slot] = image;
        } }
      />
    );
  });
}
