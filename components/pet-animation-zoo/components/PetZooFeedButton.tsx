'use client';

import { Hamburger } from 'lucide-react';

import PetZooToolbarButton from './PetZooToolbarButton';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooFeedButtonProps {
  engine: PetZooEngine;
}

/** Drops a random piece of food into the zoo (`PET_ZOO_FOODS`). The pets go for it, and the first one there eats it. */
export default function PetZooFeedButton({ engine }: PetZooFeedButtonProps) {
  const handleOnClick = () => {
    engine.feed();
  };

  return <PetZooToolbarButton label={ PET_ZOO_LABELS.feed } icon={ <Hamburger /> } onClick={ handleOnClick } />;
}
