import { cn } from '@/lib/utils';

import { getPetZooLayerStyle } from '../utils/pet-zoo-theme.utils';

import type { PetZooThemeId } from '../constants/pet-zoo-themes.constants';
import type { PetZooThemeLayer, PetZooColorMode } from '../models/pet-zoo.models';

interface PetZooBackgroundLayerProps {
  themeId: PetZooThemeId;
  layers: readonly PetZooThemeLayer[];
  colorMode: PetZooColorMode;
  className?: string;
}

/**
 * A stack of theme images pinned to the bottom left and repeated sideways, at their own pixel size.
 * When the zoo is taller than the art, the theme's fill color behind it shows above.
 */
export default function PetZooBackgroundLayer({ themeId, layers, colorMode, className }: PetZooBackgroundLayerProps) {
  const layerStyle = getPetZooLayerStyle(themeId, layers, colorMode);
  if (!layerStyle) {
    return null;
  }

  return (
    <div
      className={ cn('pet-zoo-pixelated pointer-events-none absolute inset-0', className) }
      style={ {
        backgroundImage: layerStyle.backgroundImage,
        backgroundRepeat: layerStyle.backgroundRepeat,
        backgroundPosition: 'left bottom',
      } }
      aria-hidden="true"
    />
  );
}
