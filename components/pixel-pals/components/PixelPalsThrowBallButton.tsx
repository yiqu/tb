'use client';

import { Circle } from 'lucide-react';

import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsThrowBallButtonProps {
  engine: PixelPalsEngine;
}

/** Drops a ball into Pixel Pals. The pets chase it, one catches it and plays with it, then it is gone. */
export default function PixelPalsThrowBallButton({ engine }: PixelPalsThrowBallButtonProps) {
  const handleOnClick = () => {
    engine.throwBall();
  };

  return <PixelPalsToolbarButton label={ PIXEL_PALS_LABELS.throwBall } icon={ <Circle /> } onClick={ handleOnClick } />;
}
