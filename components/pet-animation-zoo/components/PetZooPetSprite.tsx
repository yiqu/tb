'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';

import { PET_ZOO_ANIMATION } from '../models/pet-zoo.models';
import PetZooSpeechBubble from './PetZooSpeechBubble';
import { getPetZooSpriteUrl } from '../utils/pet-zoo-sprite.utils';
import { PET_ZOO_SPRITE_SIZE_PX } from '../constants/pet-zoo.constants';
import { getPetZooPetDefinition, getPetZooPetDescription } from '../utils/pet-zoo-pet.utils';

import type { PetZooPet } from '../models/pet-zoo.models';
import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooPetSpriteProps {
  pet: PetZooPet;
  engine: PetZooEngine;
}

/**
 * One pet: its speech bubble and its sprite. The engine moves it and swaps its sprite every frame through
 * the registered DOM nodes, so the inline styles below are only the starting point (off screen until the
 * first frame places it). Clicking it, or Enter or Space while it has focus, makes it react.
 */
export default function PetZooPetSprite({ pet, engine }: PetZooPetSpriteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !bodyRef.current || !imageRef.current || !bubbleRef.current) {
      return;
    }
    return engine.attachPetElements(pet.id, {
      root: rootRef.current,
      body: bodyRef.current,
      image: imageRef.current,
      bubble: bubbleRef.current,
    });
  }, [engine, pet.id]);

  const handleOnClick = () => {
    engine.clickPet(pet.id);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      engine.clickPet(pet.id);
    }
  };

  return (
    <div
      ref={ rootRef }
      role="button"
      tabIndex={ 0 }
      aria-label={ getPetZooPetDescription(pet) }
      className="
        absolute bottom-0 left-0 z-10 cursor-pointer rounded-sm outline-none will-change-transform
        focus-visible:ring-2 focus-visible:ring-ring
      "
      style={ { width: PET_ZOO_SPRITE_SIZE_PX, height: PET_ZOO_SPRITE_SIZE_PX, transform: 'translate3d(-9999px, 0, 0)' } }
      title={ getPetZooPetDescription(pet) }
      onClick={ handleOnClick }
      onKeyDown={ handleOnKeyDown }
      data-pet-id={ pet.id }
    >
      <PetZooSpeechBubble ref={ bubbleRef } />
      <div ref={ bodyRef } className="size-full">
        { /* eslint-disable-next-line @next/next/no-img-element -- animated GIF sprites, swapped by the engine every state change */ }
        <img
          ref={ imageRef }
          src={ getPetZooSpriteUrl(pet, getPetZooPetDefinition(pet.type), PET_ZOO_ANIMATION.idle) }
          alt={ pet.name }
          draggable={ false }
          className="pet-zoo-pixelated size-full object-contain object-bottom select-none"
        />
      </div>
    </div>
  );
}
