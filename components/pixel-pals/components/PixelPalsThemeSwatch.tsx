import { getPixelPalsTheme, getPixelPalsLayerStyle } from '../utils/pixel-pals-theme.utils';

import type { PixelPalsColorMode } from '../models/pixel-pals.models';
import type { PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';

interface PixelPalsThemeSwatchProps {
  themeId: PixelPalsThemeId;
  colorMode: PixelPalsColorMode;
}

/** A small crop of a theme's art over its fill color, for the theme dropdown. */
export default function PixelPalsThemeSwatch({ themeId, colorMode }: PixelPalsThemeSwatchProps) {
  const theme = getPixelPalsTheme(themeId);
  const layerStyle = getPixelPalsLayerStyle(themeId, theme.backgroundLayers, colorMode);

  return (
    <span
      className="pixel-pals-pixelated inline-block h-5 w-8 shrink-0 rounded-xs border bg-muted"
      style={ {
        backgroundColor: theme.fillColor[colorMode] === 'transparent' ? undefined : theme.fillColor[colorMode],
        backgroundImage: layerStyle?.backgroundImage,
        backgroundRepeat: layerStyle?.backgroundRepeat,
        backgroundPosition: 'left bottom',
        backgroundSize: 'auto 100%',
      } }
      aria-hidden="true"
    />
  );
}
