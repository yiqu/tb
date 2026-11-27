'use client';

import { Hamburger } from 'lucide-react';

import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsFeedButtonProps {
  engine: PixelPalsEngine;
}

/** Drops a random piece of food into Pixel Pals (`PIXEL_PALS_FOODS`). The pets go for it, and the first one there eats it. */
export default function PixelPalsFeedButton({ engine }: PixelPalsFeedButtonProps) {
  const handleOnClick = () => {
    engine.feed();
  };

  return <PixelPalsToolbarButton label={ PIXEL_PALS_LABELS.feed } icon={ <Hamburger /> } onClick={ handleOnClick } />;
}
