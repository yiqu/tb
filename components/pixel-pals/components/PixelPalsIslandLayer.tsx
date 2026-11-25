import { getPixelPalsThemeAssetUrl } from '../utils/pixel-pals-theme.utils';

import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import type { PixelPalsColorMode, PixelPalsThemeIsland } from '../models/pixel-pals.models';

interface PixelPalsIslandLayerProps {
  themeId: PixelPalsThemeId;
  islands: readonly PixelPalsThemeIsland[];
  floorPx: number;
  colorMode: PixelPalsColorMode;
}

/**
 * The stepping stones of a theme, drawn behind the pets. Each one is placed by a share of Pixel Pals' width, the same
 * way the engine places where the pets can stand, and its top row sits on the theme's floor.
 */
export default function PixelPalsIslandLayer({ themeId, islands, floorPx, colorMode }: PixelPalsIslandLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-5" aria-hidden="true">
      { islands.map((island: PixelPalsThemeIsland) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element -- pixel art at its own size
          <img
            key={ island.fileName }
            src={ getPixelPalsThemeAssetUrl(themeId, island.fileName, colorMode) }
            alt=""
            draggable={ false }
            className="pixel-pals-pixelated absolute max-w-none -translate-x-1/2 select-none"
            style={ { left: `${island.centerFraction * 100}%`, top: `calc(100% - ${floorPx}px)`, width: island.imageWidthPx } }
          />
        );
      }) }
    </div>
  );
}
