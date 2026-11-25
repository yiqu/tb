'use client';

import { useRef, useEffect } from 'react';

import { PIXEL_PALS_MAX_FOODS, PIXEL_PALS_FOOD_SIZE_PX } from '../constants/pixel-pals-foods.constants';

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
      // eslint-disable-next-line @next/next/no-img-element -- tiny pixel art, its source is set by the engine
      <img
        key={ slot }
        ref={ (image: HTMLImageElement | null) => {
          imageRefs.current[slot] = image;
        } }
        alt=""
        aria-hidden="true"
        draggable={ false }
        className="pixel-pals-pixelated pointer-events-none absolute bottom-0 left-0 z-10 hidden will-change-transform select-none"
        style={ { width: PIXEL_PALS_FOOD_SIZE_PX, height: PIXEL_PALS_FOOD_SIZE_PX } }
      />
    );
  });
}
