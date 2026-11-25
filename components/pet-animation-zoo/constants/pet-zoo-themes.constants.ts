import type { PetZooThemeDefinition } from '../models/pet-zoo.models';

/**
 * The backgrounds. Art comes from VS Code Pets (MIT), see `public/pet-animation-zoo/CREDITS.md`.
 * Images are `public/pet-animation-zoo/backgrounds/<id>/<file>`, where `{mode}` is `light` or `dark`.
 */
export const PET_ZOO_THEME_IDS = ['none', 'forest', 'castle', 'beach', 'winter', 'autumn', 'library', 'barn'] as const;

export type PetZooThemeId = (typeof PET_ZOO_THEME_IDS)[number];

export const PET_ZOO_DEFAULT_THEME_ID: PetZooThemeId = 'library';

const BACKGROUND_LAYER = { fileName: 'background-{mode}-nano.png', repeat: 'repeat-x' } as const;
const FOREGROUND_LAYER = { fileName: 'foreground-{mode}-nano.png', repeat: 'repeat-x' } as const;

export const PET_ZOO_THEMES: Record<PetZooThemeId, PetZooThemeDefinition> = {
  none: {
    id: 'none',
    label: 'None',
    floorPx: 0,
    fillColor: { light: 'transparent', dark: 'transparent' },
    backgroundLayers: [],
    foregroundLayers: [],
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    floorPx: 23,
    // the forest is a night scene in both modes, the sky continues its dark canopy
    fillColor: { light: '#0f1626', dark: '#0f1626' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  castle: {
    id: 'castle',
    label: 'Castle',
    floorPx: 45,
    fillColor: { light: '#a8c6e6', dark: '#151c2c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  beach: {
    id: 'beach',
    label: 'Beach',
    floorPx: 45,
    fillColor: { light: '#b9e2f8', dark: '#9fb3f6' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  winter: {
    id: 'winter',
    label: 'Winter',
    floorPx: 18,
    fillColor: { light: '#d3e4f6', dark: '#2b2552' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  autumn: {
    id: 'autumn',
    label: 'Autumn',
    floorPx: 7,
    fillColor: { light: '#fbe5c6', dark: '#2a1f2c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  library: {
    id: 'library',
    label: 'Library',
    floorPx: 16,
    // the top row of the wall in each image
    fillColor: { light: '#e6ceb5', dark: '#212129' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  barn: {
    id: 'barn',
    label: 'Barn',
    floorPx: 16,
    // the sky at the top of each image
    fillColor: { light: '#62b6fd', dark: '#0c2147' },
    // the barn is drawn once, the pasture repeats behind it
    backgroundLayers: [
      { fileName: 'background-{mode}-nano.png', repeat: 'no-repeat' },
      { fileName: 'pasture-background-{mode}-nano.png', repeat: 'repeat-x' },
    ],
    foregroundLayers: [
      { fileName: 'foreground-{mode}-nano.png', repeat: 'no-repeat' },
      { fileName: 'pasture-foreground-{mode}-nano.png', repeat: 'repeat-x' },
    ],
  },
};
