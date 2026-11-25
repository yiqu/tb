'use client';

import { useRef, useEffect } from 'react';

import PetZooBall from './PetZooBall';
import PetZooPetSprite from './PetZooPetSprite';
import PetZooBackgroundLayer from './PetZooBackgroundLayer';
import { getPetZooTheme } from '../utils/pet-zoo-theme.utils';
import { usePetZooColorMode } from '../hooks/usePetZooColorMode';
import { usePetZooPets, usePetZooThemeId } from '../store/pet-zoo.store';

import type { PetZooEngine } from '../engine/pet-zoo-engine';
import type { PetZooPet, PetZooThemeDefinition } from '../models/pet-zoo.models';

interface PetZooWorldProps {
  engine: PetZooEngine;
}

/**
 * The scene, back to front: the theme's fill color, its background art, the pets and the ball, then
 * the foreground art. Feeds the engine the saved pets, the theme's ground height and the world size.
 */
export default function PetZooWorld({ engine }: PetZooWorldProps) {
  const worldRef = useRef<HTMLDivElement>(null);
  const pets: PetZooPet[] = usePetZooPets();
  const themeId = usePetZooThemeId();
  const colorMode = usePetZooColorMode();
  const theme: PetZooThemeDefinition = getPetZooTheme(themeId);

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
    engine.setFloor(theme.floorPx);
  }, [engine, theme.floorPx]);

  useEffect(() => {
    engine.setPets(pets);
  }, [engine, pets]);

  return (
    <div ref={ worldRef } className="absolute inset-0 overflow-hidden select-none" style={ { backgroundColor: theme.fillColor[colorMode] } }>
      <PetZooBackgroundLayer themeId={ themeId } layers={ theme.backgroundLayers } colorMode={ colorMode } className="z-0" />
      { pets.map((pet: PetZooPet) => {
        return <PetZooPetSprite key={ pet.id } pet={ pet } engine={ engine } />;
      }) }
      <PetZooBall engine={ engine } />
      <PetZooBackgroundLayer themeId={ themeId } layers={ theme.foregroundLayers } colorMode={ colorMode } className="z-20" />
    </div>
  );
}
