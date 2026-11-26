import { getPixelPalsThemeAssetUrl } from '../utils/pixel-pals-theme.utils';

import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import type { PixelPalsColorMode, PixelPalsThemeIsland } from '../models/pixel-pals.models';

interface PixelPalsIslandProps {
  themeId: PixelPalsThemeId;
  island: PixelPalsThemeIsland;
  floorPx: number;
  colorMode: PixelPalsColorMode;
}

/** One stepping stone, centered on its share of Pixel Pals' width, with its top row on the theme's floor. */
export default function PixelPalsIsland({ themeId, island, floorPx, colorMode }: PixelPalsIslandProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pixel art at its own size
    <img
      src={ getPixelPalsThemeAssetUrl(themeId, island.fileName, colorMode) }
      alt=""
      draggable={ false }
      className="pixel-pals-pixelated absolute max-w-none -translate-x-1/2 select-none"
      style={ { left: `${island.centerFraction * 100}%`, top: `calc(100% - ${floorPx}px)`, width: island.imageWidthPx } }
    />
  );
}
