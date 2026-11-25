import { getPetZooThemeAssetUrl } from '../utils/pet-zoo-theme.utils';

import type { PetZooThemeId } from '../constants/pet-zoo-themes.constants';
import type { PetZooColorMode, PetZooThemeIsland } from '../models/pet-zoo.models';

interface PetZooIslandLayerProps {
  themeId: PetZooThemeId;
  islands: readonly PetZooThemeIsland[];
  floorPx: number;
  colorMode: PetZooColorMode;
}

/**
 * The stepping stones of a theme, drawn behind the pets. Each one is placed by a share of the zoo's width, the same
 * way the engine places where the pets can stand, and its top row sits on the theme's floor.
 */
export default function PetZooIslandLayer({ themeId, islands, floorPx, colorMode }: PetZooIslandLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-5" aria-hidden="true">
      { islands.map((island: PetZooThemeIsland) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element -- pixel art at its own size
          <img
            key={ island.fileName }
            src={ getPetZooThemeAssetUrl(themeId, island.fileName, colorMode) }
            alt=""
            draggable={ false }
            className="pet-zoo-pixelated absolute max-w-none -translate-x-1/2 select-none"
            style={ { left: `${island.centerFraction * 100}%`, top: `calc(100% - ${floorPx}px)`, width: island.imageWidthPx } }
          />
        );
      }) }
    </div>
  );
}
