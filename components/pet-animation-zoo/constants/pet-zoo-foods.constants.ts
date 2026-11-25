import type { PetZooFoodDefinition } from '../models/pet-zoo.models';

/**
 * What the Feed button can drop, one picked at random per click. The images are
 * `public/pet-animation-zoo/foods/<fileName>`, 12 by 12 pixel art made for this project.
 */
export const PET_ZOO_FOOD_KINDS = ['hamburger', 'bao', 'pizza', 'carrot', 'dumpling'] as const;

export type PetZooFoodKind = (typeof PET_ZOO_FOOD_KINDS)[number];

export const PET_ZOO_FOODS: Record<PetZooFoodKind, PetZooFoodDefinition> = {
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
export const PET_ZOO_FOOD_SIZE_PX = 12;
/** Food beyond this pushes out the oldest piece. */
export const PET_ZOO_MAX_FOODS = 5;
/** Food nobody eats is gone after this long. */
export const PET_ZOO_FOOD_LIFETIME_SECONDS = 30;
