import { getPetZooTheme, getPetZooLayerStyle } from '../utils/pet-zoo-theme.utils';

import type { PetZooColorMode } from '../models/pet-zoo.models';
import type { PetZooThemeId } from '../constants/pet-zoo-themes.constants';

interface PetZooThemeSwatchProps {
  themeId: PetZooThemeId;
  colorMode: PetZooColorMode;
}

/** A small crop of a theme's art over its fill color, for the theme dropdown. */
export default function PetZooThemeSwatch({ themeId, colorMode }: PetZooThemeSwatchProps) {
  const theme = getPetZooTheme(themeId);
  const layerStyle = getPetZooLayerStyle(themeId, theme.backgroundLayers, colorMode);

  return (
    <span
      className="pet-zoo-pixelated inline-block h-5 w-8 shrink-0 rounded-xs border bg-muted"
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
