import type { PixelPalsFoodDefinition } from '../models/pixel-pals.models';

/**
 * What the Feed button can drop, one picked at random per click. The images are
 * `public/pixel-pals/foods/<fileName>`, 12 by 12 pixel art made for this project.
 */
export const PIXEL_PALS_FOOD_KINDS = ['hamburger', 'bao', 'pizza', 'carrot', 'dumpling'] as const;

export type PixelPalsFoodKind = (typeof PIXEL_PALS_FOOD_KINDS)[number];

export const PIXEL_PALS_FOODS: Record<PixelPalsFoodKind, PixelPalsFoodDefinition> = {
  hamburger: {
    label: 'Hamburger',
    fileName: 'hamburger.png',
    line: 'Yum! 🍔',
  },
  bao: {
    label: 'Bao',
    fileName: 'bao.png',
    line: 'So fluffy!',
  },
  pizza: {
    label: 'Pizza',
    fileName: 'pizza.png',
    line: 'Pizza time! 🍕',
  },
  carrot: {
    label: 'Carrot',
    fileName: 'carrot.png',
    line: 'Crunchy! 🥕',
  },
  dumpling: {
    label: 'Dumpling',
    fileName: 'dumpling.png',
    line: 'Dumpling! 🥟',
  },
};

/** The size a food is drawn at, in px. */
export const PIXEL_PALS_FOOD_SIZE_PX = 12;
/** Food beyond this pushes out the oldest piece. */
export const PIXEL_PALS_MAX_FOODS = 5;
/** Food nobody eats is gone after this long. */
export const PIXEL_PALS_FOOD_LIFETIME_SECONDS = 30;
