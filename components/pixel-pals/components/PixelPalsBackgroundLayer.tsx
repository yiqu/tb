import { cn } from '@/lib/utils';

import { getPixelPalsLayerStyle } from '../utils/pixel-pals-theme.utils';

import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';
import type { PixelPalsThemeLayer, PixelPalsColorMode } from '../models/pixel-pals.models';

interface PixelPalsBackgroundLayerProps {
  themeId: PixelPalsThemeId;
  layers: readonly PixelPalsThemeLayer[];
  colorMode: PixelPalsColorMode;
  className?: string;
}

/**
 * A stack of theme images pinned to the bottom left and repeated sideways, at their own pixel size.
 * When Pixel Pals is taller than the art, the theme's fill color behind it shows above.
 */
export default function PixelPalsBackgroundLayer({ themeId, layers, colorMode, className }: PixelPalsBackgroundLayerProps) {
  const layerStyle = getPixelPalsLayerStyle(themeId, layers, colorMode);
  if (!layerStyle) {
    return null;
  }

  return (
    <div
      className={ cn('pixel-pals-pixelated pointer-events-none absolute inset-0', className) }
      style={ {
        backgroundImage: layerStyle.backgroundImage,
        backgroundRepeat: layerStyle.backgroundRepeat,
        backgroundPosition: 'left bottom',
      } }
      aria-hidden="true"
    />
  );
}
