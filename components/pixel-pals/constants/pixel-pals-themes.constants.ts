import { DateTime } from 'luxon';

import { PIXEL_PALS_TIME_ZONE } from './pixel-pals.constants';

import type { PixelPalsThemeDefinition } from '../models/pixel-pals.models';

/**
 * The master list of backgrounds: `PIXEL_PALS_THEME_IDS` is every theme in the order the dialog lists them, and
 * `PIXEL_PALS_THEMES` holds each one. A theme taken out of here is gone, even for someone who had it saved.
 *
 * Most art comes from VS Code Pets (MIT), the ones made for this project are listed in
 * `public/pixel-pals/CREDITS.md`. Images are `public/pixel-pals/backgrounds/<id>/<file>`, where
 * `{mode}` is `light` or `dark`.
 *
 * `unlocked` works as it does for the pets: `false` shows the theme with a lock, a time keeps it locked until then.
 */
export const PIXEL_PALS_THEME_IDS = [
  'none',
  'forest',
  'castle',
  'beach',
  'winter',
  'peak',
  'autumn',
  'lake',
  'jungle',
  'volcano',
  'library',
  'classroom',
  'science',
  'barn',
] as const;

export type PixelPalsThemeId = (typeof PIXEL_PALS_THEME_IDS)[number];

export const PIXEL_PALS_DEFAULT_THEME_ID: PixelPalsThemeId = 'library';

/** Barn opens on Christmas day, to show a theme that unlocks on a date. */
const CHRISTMAS_2026: number = DateTime.fromObject({ year: 2026, month: 12, day: 25 }, { zone: PIXEL_PALS_TIME_ZONE }).toMillis();

const BACKGROUND_LAYER = { fileName: 'background-{mode}-nano.png', repeat: 'repeat-x' } as const;
const FOREGROUND_LAYER = { fileName: 'foreground-{mode}-nano.png', repeat: 'repeat-x' } as const;

export const PIXEL_PALS_THEMES: Record<PixelPalsThemeId, PixelPalsThemeDefinition> = {
  none: {
    id: 'none',
    label: 'None',
    unlocked: true,
    floorPx: 0,
    fillColor: { light: 'transparent', dark: 'transparent' },
    backgroundLayers: [],
    foregroundLayers: [],
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    unlocked: true,
    floorPx: 23,
    // the forest is a night scene in both modes, the sky continues its dark canopy
    fillColor: { light: '#0f1626', dark: '#0f1626' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  castle: {
    id: 'castle',
    label: 'Castle',
    unlocked: false,
    floorPx: 45,
    fillColor: { light: '#a8c6e6', dark: '#151c2c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  beach: {
    id: 'beach',
    label: 'Beach',
    unlocked: true,
    floorPx: 45,
    fillColor: { light: '#b9e2f8', dark: '#9fb3f6' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  winter: {
    id: 'winter',
    label: 'Winter',
    unlocked: true,
    floorPx: 18,
    fillColor: { light: '#d3e4f6', dark: '#2b2552' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  peak: {
    id: 'peak',
    label: 'Snowy peak',
    unlocked: true,
    // the pets walk in the snow field, a little below its top edge
    floorPx: 10,
    // the top band of each sky
    fillColor: { light: '#9cc6ec', dark: '#0e1430' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
  },
  autumn: {
    id: 'autumn',
    label: 'Autumn',
    unlocked: true,
    floorPx: 7,
    fillColor: { light: '#fbe5c6', dark: '#2a1f2c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  lake: {
    id: 'lake',
    label: 'Autumn lake',
    unlocked: true,
    // the top of the stepping stones
    floorPx: 14,
    // the top band of each sky
    fillColor: { light: '#8fc1e3', dark: '#1b1630' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
    // three stones spread across the lake, the pets hop from one to the next
    islands: [
      { fileName: 'rock-1-{mode}-nano.png', centerFraction: 1 / 6, imageWidthPx: 68, stoneWidthPx: 60, walkWidthPx: 40 },
      { fileName: 'rock-2-{mode}-nano.png', centerFraction: 1 / 2, imageWidthPx: 60, stoneWidthPx: 52, walkWidthPx: 34 },
      { fileName: 'rock-3-{mode}-nano.png', centerFraction: 5 / 6, imageWidthPx: 64, stoneWidthPx: 56, walkWidthPx: 38 },
    ],
    // a ball floats a little below the water line, which is 9px below the top of the stones
    waterDepthPx: 11,
  },
  jungle: {
    id: 'jungle',
    label: 'Jurassic jungle',
    unlocked: true,
    // the pets walk on the dirt path, under the ferns
    floorPx: 8,
    // the top band of each sky
    fillColor: { light: '#8fd0e6', dark: '#0c1626' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
  },
  volcano: {
    id: 'volcano',
    label: 'Volcano valley',
    unlocked: true,
    floorPx: 8,
    // the top band of each sky
    fillColor: { light: '#f3b37a', dark: '#1a0d1c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
  },
  library: {
    id: 'library',
    label: 'Library',
    unlocked: true,
    floorPx: 16,
    // the top row of the wall in each image
    fillColor: { light: '#e6ceb5', dark: '#212129' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [FOREGROUND_LAYER],
  },
  classroom: {
    id: 'classroom',
    label: 'Classroom',
    unlocked: true,
    // the middle of the wooden floor, in front of the desks
    floorPx: 12,
    // the wall at the top of each image
    fillColor: { light: '#f3e7c9', dark: '#2b2d3c' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
  },
  science: {
    id: 'science',
    label: 'Science class',
    unlocked: true,
    // the middle of the tiled floor, in front of the lab bench
    floorPx: 12,
    // the wall at the top of each image
    fillColor: { light: '#dce8ee', dark: '#1d2532' },
    backgroundLayers: [BACKGROUND_LAYER],
    foregroundLayers: [],
  },
  barn: {
    id: 'barn',
    label: 'Barn',
    unlocked: CHRISTMAS_2026,
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
