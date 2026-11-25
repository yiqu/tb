import RowStack from '@/shared/components/RowStack';
import { TooltipProvider } from '@/components/ui/tooltip';

import PetZooSpawnPetButton from './PetZooSpawnPetButton';
import PetZooFeedButton from './PetZooFeedButton';
import PetZooThrowBallButton from './PetZooThrowBallButton';
import PetZooDeletePetButton from './PetZooDeletePetButton';
import PetZooChangeThemeButton from './PetZooChangeThemeButton';

import type { PetZooEngine } from '../engine/pet-zoo-engine';

interface PetZooToolbarProps {
  engine: PetZooEngine;
}

/** Spawn pet, Throw ball, Feed, Delete pet and Change theme, in the top right corner while the zoo is hovered or one of them has keyboard focus. */
export default function PetZooToolbar({ engine }: PetZooToolbarProps) {
  return (
    // its own provider, so the tooltips work in an app that has none
    <TooltipProvider>
      <RowStack
        className="
          absolute top-2 right-1.5 z-30 gap-1 opacity-0 transition-opacity duration-150
          group-hover/pet-zoo:opacity-100
          group-has-[:focus-visible]/pet-zoo:opacity-100
        "
      >
        <PetZooSpawnPetButton />
        <PetZooThrowBallButton engine={ engine } />
        <PetZooFeedButton engine={ engine } />
        <PetZooDeletePetButton />
        <PetZooChangeThemeButton />
      </RowStack>
    </TooltipProvider>
  );
}
