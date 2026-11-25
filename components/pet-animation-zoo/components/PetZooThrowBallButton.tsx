'use client';

import { Circle } from 'lucide-react';

import PetZooToolbarButton from './PetZooToolbarButton';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooThrowBallButtonProps {
  engine: PetZooEngine;
}

/** Drops a ball into the zoo. The pets chase it, one catches it and plays with it, then it is gone. */
export default function PetZooThrowBallButton({ engine }: PetZooThrowBallButtonProps) {
  const handleOnClick = () => {
    engine.throwBall();
  };

  return <PetZooToolbarButton label={ PET_ZOO_LABELS.throwBall } icon={ <Circle /> } onClick={ handleOnClick } />;
}
