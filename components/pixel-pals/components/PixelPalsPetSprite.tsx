'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';

import { PIXEL_PALS_ANIMATION } from '../models/pixel-pals.models';
import PixelPalsNameTag from './PixelPalsNameTag';
import PixelPalsSpeechBubble from './PixelPalsSpeechBubble';
import { getPixelPalsSpriteUrl } from '../utils/pixel-pals-sprite.utils';
import { getPixelPalsPetSize } from '../utils/pixel-pals-behavior.utils';
import { getPixelPalsPetDefinition, getPixelPalsPetDescription } from '../utils/pixel-pals-pet.utils';

import type { PixelPalsPet, PixelPalsPetDefinition } from '../models/pixel-pals.models';
import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsPetSpriteProps {
  pet: PixelPalsPet;
  engine: PixelPalsEngine;
}

/**
 * One pet: its speech bubble, its name tag (shown on hover or keyboard focus) and its sprite. The engine moves it
 * and swaps its sprite every frame through the registered DOM nodes, so the inline styles below are only the starting
 * point (off screen until the first frame places it). Clicking it, or Enter or Space while it has focus, makes it react.
 */
export default function PixelPalsPetSprite({ pet, engine }: PixelPalsPetSpriteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const nameTagRef = useRef<HTMLDivElement>(null);
  const definition: PixelPalsPetDefinition = getPixelPalsPetDefinition(pet.type);
  const size: number = getPixelPalsPetSize(definition.sizeScale);

  useEffect(() => {
    if (!rootRef.current || !bodyRef.current || !imageRef.current || !bubbleRef.current || !nameTagRef.current) {
      return;
    }
    return engine.attachPetElements(pet.id, {
      root: rootRef.current,
      body: bodyRef.current,
      image: imageRef.current,
      bubble: bubbleRef.current,
      nameTag: nameTagRef.current,
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
      aria-label={ getPixelPalsPetDescription(pet) }
      className="
        pixel-pals-pet absolute bottom-0 left-0 z-10 cursor-pointer rounded-sm outline-none will-change-transform
        focus-visible:ring-2 focus-visible:ring-ring
      "
      style={ { width: size, height: size, transform: 'translate3d(-9999px, 0, 0)' } }
      onClick={ handleOnClick }
      onKeyDown={ handleOnKeyDown }
      data-pet-id={ pet.id }
    >
      <PixelPalsSpeechBubble ref={ bubbleRef } />
      <PixelPalsNameTag ref={ nameTagRef } name={ pet.name } />
      <div ref={ bodyRef } className="size-full">
        { /* eslint-disable-next-line @next/next/no-img-element -- animated GIF sprites, swapped by the engine every state change */ }
        <img
          ref={ imageRef }
          src={ getPixelPalsSpriteUrl(pet, definition, PIXEL_PALS_ANIMATION.idle) }
          alt={ pet.name }
          draggable={ false }
          className="pixel-pals-pixelated size-full object-contain object-bottom select-none"
        />
      </div>
    </div>
  );
}
