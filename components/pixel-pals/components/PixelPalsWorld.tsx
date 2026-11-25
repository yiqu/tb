'use client';

import { useRef, useMemo, useEffect } from 'react';

import PixelPalsBall from './PixelPalsBall';
import PixelPalsFood from './PixelPalsFood';
import PixelPalsPetSprite from './PixelPalsPetSprite';
import PixelPalsIslandLayer from './PixelPalsIslandLayer';
import PixelPalsBackgroundLayer from './PixelPalsBackgroundLayer';
import { getPixelPalsTheme } from '../utils/pixel-pals-theme.utils';
import { usePixelPalsColorMode } from '../hooks/usePixelPalsColorMode';
import { getResolvedPixelPets } from '../utils/pixel-pals-pet.utils';
import { useGetUserPixelPets, useGetUserPixelPetBackground } from '../store/pixel-pets.store';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';
import type { PixelPet, ResolvedPixelPet, PixelPalsThemeDefinition } from '../models/pixel-pals.models';

interface PixelPalsWorldProps {
  engine: PixelPalsEngine;
}

/**
 * The scene, back to front: the theme's fill color, its background art, its stepping stones if it has any, the food,
 * the pets and the ball, then the foreground art. Feeds the engine the store's pets (filled in from the master list),
 * the theme's ground and the world size.
 */
export default function PixelPalsWorld({ engine }: PixelPalsWorldProps) {
  const worldRef = useRef<HTMLDivElement>(null);
  const userPixelPets: PixelPet[] = useGetUserPixelPets();
  const themeId = useGetUserPixelPetBackground();
  const colorMode = usePixelPalsColorMode();
  const theme: PixelPalsThemeDefinition = getPixelPalsTheme(themeId);
  const pets: ResolvedPixelPet[] = useMemo(() => {
    return getResolvedPixelPets(userPixelPets);
  }, [userPixelPets]);

  // the size first, so pets that join get a random spot across the real width
  useEffect(() => {
    const world: HTMLDivElement | null = worldRef.current;
    if (!world) {
      return;
    }
    const rect: DOMRect = world.getBoundingClientRect();
    engine.setWorldSize(rect.width, rect.height);
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry: ResizeObserverEntry | undefined = entries[0];
      if (entry) {
        engine.setWorldSize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    observer.observe(world);
    return () => {
      observer.disconnect();
    };
  }, [engine]);

  useEffect(() => {
    engine.setTheme(theme);
  }, [engine, theme]);

  useEffect(() => {
    engine.setPets(pets);
  }, [engine, pets]);

  return (
    <div ref={ worldRef } className="absolute inset-0 overflow-hidden select-none" style={ { backgroundColor: theme.fillColor[colorMode] } }>
      <PixelPalsBackgroundLayer themeId={ themeId } layers={ theme.backgroundLayers } colorMode={ colorMode } className="z-0" />
      { theme.islands ?
        <PixelPalsIslandLayer themeId={ themeId } islands={ theme.islands } floorPx={ theme.floorPx } colorMode={ colorMode } />
      : null }
      <PixelPalsFood engine={ engine } />
      { pets.map((pet: ResolvedPixelPet) => {
        return <PixelPalsPetSprite key={ pet.id } pet={ pet } engine={ engine } />;
      }) }
      <PixelPalsBall engine={ engine } />
      <PixelPalsBackgroundLayer themeId={ themeId } layers={ theme.foregroundLayers } colorMode={ colorMode } className="z-20" />
    </div>
  );
}
