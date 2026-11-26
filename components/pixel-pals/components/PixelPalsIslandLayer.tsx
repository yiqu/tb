import PixelPalsIsland from './PixelPalsIsland';

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
        return <PixelPalsIsland key={ island.fileName } themeId={ themeId } island={ island } floorPx={ floorPx } colorMode={ colorMode } />;
      }) }
    </div>
  );
}
