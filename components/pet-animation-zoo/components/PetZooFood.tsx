'use client';

import { useRef, useEffect } from 'react';

import { PET_ZOO_MAX_FOODS, PET_ZOO_FOOD_SIZE_PX } from '../constants/pet-zoo-foods.constants';

import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooFoodProps {
  engine: PetZooEngine;
}

const SLOTS: readonly number[] = Array.from({ length: PET_ZOO_MAX_FOODS }, (_: unknown, index: number) => {
  return index;
});

/** One hidden image slot per piece of food the zoo can hold. The engine shows, swaps and moves them every frame. */
export default function PetZooFood({ engine }: PetZooFoodProps) {
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
        className="pet-zoo-pixelated pointer-events-none absolute bottom-0 left-0 z-10 hidden will-change-transform select-none"
        style={ { width: PET_ZOO_FOOD_SIZE_PX, height: PET_ZOO_FOOD_SIZE_PX } }
      />
    );
  });
}
