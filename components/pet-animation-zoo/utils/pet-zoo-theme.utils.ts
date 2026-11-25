import { PET_ZOO_ASSET_BASE_URL } from '../constants/pet-zoo.constants';
import { PET_ZOO_THEMES, PET_ZOO_THEME_IDS, PetZooThemeId } from '../constants/pet-zoo-themes.constants';

import type { PetZooThemeLayer, PetZooColorMode, PetZooThemeDefinition } from '../models/pet-zoo.models';

export function isPetZooThemeId(value: unknown): value is PetZooThemeId {
  return typeof value === 'string' && (PET_ZOO_THEME_IDS as readonly string[]).includes(value);
}

export function getPetZooTheme(themeId: PetZooThemeId): PetZooThemeDefinition {
  return PET_ZOO_THEMES[themeId];
}

export function getPetZooThemeLayerUrl(themeId: PetZooThemeId, layer: PetZooThemeLayer, colorMode: PetZooColorMode): string {
  return `${PET_ZOO_ASSET_BASE_URL}/backgrounds/${themeId}/${layer.fileName.replace('{mode}', colorMode)}`;
}

export interface PetZooLayerStyle {
  backgroundImage: string;
  backgroundRepeat: string;
}

/** The CSS of a stack of layers: one `url()` and one repeat per layer, first layer on top. Null when there are none. */
export function getPetZooLayerStyle(
  themeId: PetZooThemeId,
  layers: readonly PetZooThemeLayer[],
  colorMode: PetZooColorMode,
): PetZooLayerStyle | null {
  if (layers.length === 0) {
    return null;
  }
  return {
    backgroundImage: layers
      .map((layer: PetZooThemeLayer) => {
        return `url('${getPetZooThemeLayerUrl(themeId, layer, colorMode)}')`;
      })
      .join(', '),
    backgroundRepeat: layers
      .map((layer: PetZooThemeLayer) => {
        return layer.repeat;
      })
      .join(', '),
  };
}
