import RowStack from '@/shared/components/RowStack';
import { TooltipProvider } from '@/components/ui/tooltip';

import PixelPalsSpawnPetButton from './PixelPalsSpawnPetButton';
import PixelPalsFeedButton from './PixelPalsFeedButton';
import PixelPalsThrowBallButton from './PixelPalsThrowBallButton';
import PixelPalsDeletePetButton from './PixelPalsDeletePetButton';
import PixelPalsChangeThemeButton from './PixelPalsChangeThemeButton';

import type { PixelPalsEngine } from '../engine/pixel-pals-engine';

interface PixelPalsToolbarProps {
  engine: PixelPalsEngine;
}

/**
 * Spawn pet, Throw ball, Feed, Delete pet and Change theme, in the top right corner while Pixel Pals is hovered or one of
 * them has keyboard focus. While hidden it lets clicks and taps through to the pets under it.
 */
export default function PixelPalsToolbar({ engine }: PixelPalsToolbarProps) {
  return (
    // its own provider, so the tooltips work in an app that has none
    <TooltipProvider>
      <RowStack
        className="
          pointer-events-none absolute top-2 right-1.5 z-30 gap-1 opacity-0 transition-opacity duration-150
          group-hover/pixel-pals:pointer-events-auto group-hover/pixel-pals:opacity-100
          group-has-[:focus-visible]/pixel-pals:pointer-events-auto group-has-[:focus-visible]/pixel-pals:opacity-100
        "
      >
        <PixelPalsSpawnPetButton />
        <PixelPalsThrowBallButton engine={ engine } />
        <PixelPalsFeedButton engine={ engine } />
        <PixelPalsDeletePetButton />
        <PixelPalsChangeThemeButton />
      </RowStack>
    </TooltipProvider>
  );
}
