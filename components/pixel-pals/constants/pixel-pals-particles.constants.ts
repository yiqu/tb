import type { PixelPalsColorMode } from '../models/pixel-pals.models';

/**
 * The weather a theme can have, drawn in front of the scene: which theme has which is `particles` in its master list
 * entry (`pixel-pals-themes.constants.ts`), how much of it is the slider in the Change theme dialog. How fast and how
 * many are in section 12 of `pixel-pals-behavior.constants.ts`. Each particle is a pixel or two, like the art.
 */
export const PIXEL_PALS_PARTICLE_EFFECT_IDS = ['snow', 'leaves', 'debris', 'rain', 'fog'] as const;

export type PixelPalsParticleEffectId = (typeof PIXEL_PALS_PARTICLE_EFFECT_IDS)[number];

export interface PixelPalsParticleEffectDefinition {
  /** Shown over the slider. */
  label: string;
  /** Each particle gets one of these at random. Light mode first, then dark mode. */
  colors: Record<PixelPalsColorMode, readonly string[]>;
  /** How see-through the particles are, 0 to 1. */
  opacity: Record<PixelPalsColorMode, number>;
}

export const PIXEL_PALS_PARTICLE_EFFECTS: Record<PixelPalsParticleEffectId, PixelPalsParticleEffectDefinition> = {
  snow: {
    label: 'Snow',
    colors: { light: ['#ffffff', '#f2f6ff', '#e4ecfa'], dark: ['#eef2fc', '#d4def2', '#b9c6e2'] },
    opacity: { light: 1, dark: 0.85 },
  },
  leaves: {
    label: 'Falling leaves',
    colors: { light: ['#d9622b', '#e8a33c', '#b8402a', '#f0c24a', '#9a5a2a'], dark: ['#9c4a26', '#a8772e', '#7e3024', '#b08c38', '#6a4022'] },
    opacity: { light: 1, dark: 1 },
  },
  debris: {
    label: 'Gray debris',
    colors: { light: ['#8a8a92', '#6c6c74', '#a6a6ae', '#55555c'], dark: ['#6e6e78', '#55555e', '#8a8a94', '#44444b'] },
    opacity: { light: 0.9, dark: 0.85 },
  },
  rain: {
    label: 'Rain',
    colors: { light: ['#c8dcec', '#b4cce0', '#dce8f2'], dark: ['#7d9cbc', '#6a88a8', '#90aecb'] },
    opacity: { light: 0.6, dark: 0.55 },
  },
  fog: {
    label: 'Fog',
    colors: { light: ['#ffffff', '#eef2f4'], dark: ['#a4afc0', '#8d98aa'] },
    opacity: { light: 0.3, dark: 0.2 },
  },
};

/** The slider: 0 is off, 100 is the most particles. */
export const PIXEL_PALS_PARTICLE_LEVEL_MIN = 0;
export const PIXEL_PALS_PARTICLE_LEVEL_MAX = 100;
export const PIXEL_PALS_PARTICLE_LEVEL_STEP = 5;
