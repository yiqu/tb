import { PIXEL_PALS_ASSET_BASE_URL } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_THEMES, PIXEL_PALS_THEME_IDS, PixelPalsThemeId } from '../constants/pixel-pals-themes.constants';

import type { PixelPalsThemeLayer, PixelPalsColorMode, PixelPalsThemeDefinition } from '../models/pixel-pals.models';

export function isPixelPalsThemeId(value: unknown): value is PixelPalsThemeId {
  return typeof value === 'string' && (PIXEL_PALS_THEME_IDS as readonly string[]).includes(value);
}

export function getPixelPalsTheme(themeId: PixelPalsThemeId): PixelPalsThemeDefinition {
  return PIXEL_PALS_THEMES[themeId];
}

/** A theme image. `{mode}` in the file name is replaced by `light` or `dark`. */
export function getPixelPalsThemeAssetUrl(themeId: PixelPalsThemeId, fileName: string, colorMode: PixelPalsColorMode): string {
  return `${PIXEL_PALS_ASSET_BASE_URL}/backgrounds/${themeId}/${fileName.replace('{mode}', colorMode)}`;
}

export function getPixelPalsThemeLayerUrl(themeId: PixelPalsThemeId, layer: PixelPalsThemeLayer, colorMode: PixelPalsColorMode): string {
  return getPixelPalsThemeAssetUrl(themeId, layer.fileName, colorMode);
}

export interface PixelPalsLayerStyle {
  backgroundImage: string;
  backgroundRepeat: string;
}

/** The CSS of a stack of layers: one `url()` and one repeat per layer, first layer on top. Null when there are none. */
export function getPixelPalsLayerStyle(
  themeId: PixelPalsThemeId,
  layers: readonly PixelPalsThemeLayer[],
  colorMode: PixelPalsColorMode,
): PixelPalsLayerStyle | null {
  if (layers.length === 0) {
    return null;
  }
  return {
    backgroundImage: layers
      .map((layer: PixelPalsThemeLayer) => {
        return `url('${getPixelPalsThemeLayerUrl(themeId, layer, colorMode)}')`;
      })
      .join(', '),
    backgroundRepeat: layers
      .map((layer: PixelPalsThemeLayer) => {
        return layer.repeat;
      })
      .join(', '),
  };
}
