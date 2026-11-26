import { randomItem, randomBetween } from './pixel-pals-random.utils';
import { PIXEL_PALS_PARTICLE_EFFECTS } from '../constants/pixel-pals-particles.constants';
import { PIXEL_PALS_PARTICLE_TUNING, PIXEL_PALS_RAIN_SPLASH_SECONDS } from '../constants/pixel-pals-behavior.constants';

import type { PixelPalsColorMode, PixelPalsParticleEffectId } from '../models/pixel-pals.models';
import type { PixelPalsWorldBounds, PixelPalsParticleField, PixelPalsParticleRuntime } from '../models/pixel-pals-runtime.models';

/**
 * The weather: snow, falling leaves, gray debris, rain or fog, drawn on one canvas in front of the scene. Each
 * particle is a pixel or two (a fog wisp is a thin smear), so the background always shows through. The level, 0 to 100,
 * only sets how many there are. Unlike pets, `y` here is px from the top of the world.
 */

/** Of the 1 or 2 px particles, how many are the small size. */
const SMALL_PARTICLE_SHARE = 0.75;
/** Fog stays in the lower part of the scene: its wisps sit between this share of the height and the ground. */
const FOG_TOP_SHARE = 0.35;
/** New particles from the top start up to this many px above it, so they don't all come in at once. */
const SPAWN_SPREAD_PX = 12;

export function createPixelPalsParticleField(): PixelPalsParticleField {
  return { effect: null, level: 0, colorMode: 'light', particles: [] };
}

/** Changes the effect, the level or the color mode. A new effect starts over; a new color mode recolors what's there. */
export function setPixelPalsParticleField(
  field: PixelPalsParticleField,
  effect: PixelPalsParticleEffectId | null,
  level: number,
  colorMode: PixelPalsColorMode,
): void {
  if (field.effect !== effect) {
    field.particles = [];
  }
  if (field.colorMode !== colorMode && effect) {
    field.particles.forEach((particle: PixelPalsParticleRuntime) => {
      particle.color = pickColor(effect, colorMode);
    });
  }
  field.effect = effect;
  field.level = level;
  field.colorMode = colorMode;
}

/** How many particles the level asks for at this size of Pixel Pals. */
export function getPixelPalsParticleCount(field: PixelPalsParticleField, bounds: PixelPalsWorldBounds): number {
  if (!field.effect || field.level <= 0) {
    return 0;
  }
  const area: number = bounds.width * bounds.height;
  return Math.round(((PIXEL_PALS_PARTICLE_TUNING[field.effect].maxPer10kPx * area) / 10000) * (field.level / 100));
}

/** Moves every particle. One that lands goes back to the top; the count follows the level and the size. */
export function stepPixelPalsParticles(field: PixelPalsParticleField, seconds: number, bounds: PixelPalsWorldBounds): void {
  const effect: PixelPalsParticleEffectId | null = field.effect;
  const count: number = getPixelPalsParticleCount(field, bounds);
  if (!effect) {
    return;
  }
  // more on the slider: the new ones show up anywhere at once, not only from the top
  while (field.particles.length < count) {
    field.particles.push(createParticle(effect, field.colorMode, bounds));
  }
  if (field.particles.length > count) {
    field.particles.length = count;
  }
  const ground: number = bounds.height - bounds.floor;
  field.particles.forEach((particle: PixelPalsParticleRuntime) => {
    particle.x += particle.vx * seconds;
    particle.y += particle.vy * seconds;
    particle.phase += (2 * Math.PI * seconds) / particle.swaySeconds;
    particle.splashSecondsLeft = Math.max(0, particle.splashSecondsLeft - seconds);
    wrapSideways(particle, bounds.width);
    if (effect === 'fog') {
      return;
    }
    if (effect === 'rain') {
      if (particle.y >= ground) {
        particle.splashSecondsLeft = PIXEL_PALS_RAIN_SPLASH_SECONDS;
        particle.splashX = particle.x;
        respawnAtTop(particle, bounds);
      }
      return;
    }
    // snow, leaves and debris settle somewhere on the ground, between the floor and the bottom
    if (particle.y >= ground + particle.landingDepth * bounds.floor) {
      respawnAtTop(particle, bounds);
    }
  });
}

/** Draws the particles on the canvas, which is the size of the world in px. */
export function drawPixelPalsParticles(context: CanvasRenderingContext2D, field: PixelPalsParticleField, bounds: PixelPalsWorldBounds): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  const effect: PixelPalsParticleEffectId | null = field.effect;
  if (!effect || field.particles.length === 0) {
    return;
  }
  context.globalAlpha = PIXEL_PALS_PARTICLE_EFFECTS[effect].opacity[field.colorMode];
  const ground: number = bounds.height - bounds.floor;
  field.particles.forEach((particle: PixelPalsParticleRuntime) => {
    const x: number = particle.x + Math.sin(particle.phase) * particle.sway;
    context.fillStyle = particle.color;
    if (effect === 'rain') {
      drawRaindrop(context, particle, x, ground);
    } else if (effect === 'fog') {
      drawFogWisp(context, particle, x);
    } else if (effect === 'leaves') {
      drawLeaf(context, particle, x);
    } else {
      context.fillRect(Math.round(x), Math.round(particle.y), particle.size, particle.size);
    }
  });
  context.globalAlpha = 1;
}

function createParticle(effect: PixelPalsParticleEffectId, colorMode: PixelPalsColorMode, bounds: PixelPalsWorldBounds): PixelPalsParticleRuntime {
  const tuning = PIXEL_PALS_PARTICLE_TUNING[effect];
  const size: number = effect === 'fog' ? Math.round(randomBetween(tuning.size)) : smallOrLarge(tuning.size);
  let length = 0;
  if ('streakLength' in tuning) {
    length = Math.round(randomBetween(tuning.streakLength));
  } else if ('thickness' in tuning) {
    length = Math.round(randomBetween(tuning.thickness));
  }
  const particle: PixelPalsParticleRuntime = {
    x: Math.random() * bounds.width,
    y: 0,
    vx: randomBetween(tuning.drift),
    vy: randomBetween(tuning.fallSpeed),
    size,
    length,
    sway: randomBetween(tuning.sway),
    swaySeconds: randomBetween(tuning.swaySeconds),
    phase: Math.random() * 2 * Math.PI,
    color: pickColor(effect, colorMode),
    landingDepth: Math.random(),
    splashSecondsLeft: 0,
    splashX: 0,
  };
  if (effect === 'fog') {
    const top: number = bounds.height * FOG_TOP_SHARE;
    particle.y = top + Math.random() * Math.max(0, bounds.height - bounds.floor - top);
  } else {
    particle.y = Math.random() * (bounds.height - bounds.floor);
  }
  return particle;
}

function respawnAtTop(particle: PixelPalsParticleRuntime, bounds: PixelPalsWorldBounds): void {
  particle.y = -particle.size - particle.length - Math.random() * SPAWN_SPREAD_PX;
  particle.x = Math.random() * bounds.width;
}

/** What leaves one side comes back on the other, so the weather never thins out on one side. */
function wrapSideways(particle: PixelPalsParticleRuntime, width: number): void {
  const margin: number = particle.size + particle.sway + 2;
  if (particle.x < -margin) {
    particle.x += width + margin * 2;
  } else if (particle.x > width + margin) {
    particle.x -= width + margin * 2;
  }
}

function smallOrLarge(range: readonly [number, number]): number {
  return Math.random() < SMALL_PARTICLE_SHARE ? range[0] : range[1];
}

function pickColor(effect: PixelPalsParticleEffectId, colorMode: PixelPalsColorMode): string {
  const colors: readonly string[] = PIXEL_PALS_PARTICLE_EFFECTS[effect].colors[colorMode];
  return randomItem(colors) ?? colors[0];
}

/** A 1 px wide streak, slanted with its speed, and a two-pixel splash where the last one hit. */
function drawRaindrop(context: CanvasRenderingContext2D, particle: PixelPalsParticleRuntime, x: number, ground: number): void {
  const slant: number = particle.vy === 0 ? 0 : particle.vx / particle.vy;
  for (let step = 0; step < particle.length; step += 1) {
    context.fillRect(Math.round(x - slant * step), Math.round(particle.y - step), 1, 1);
  }
  if (particle.splashSecondsLeft > 0) {
    const splashY: number = Math.round(ground) - 1;
    context.fillRect(Math.round(particle.splashX) - 1, splashY, 1, 1);
    context.fillRect(Math.round(particle.splashX) + 1, splashY, 1, 1);
  }
}

/** A leaf tumbling as it falls: flat (2 × 1), on its edge (1 × 2), or turned toward you (1 × 1). */
function drawLeaf(context: CanvasRenderingContext2D, particle: PixelPalsParticleRuntime, x: number): void {
  const turn: number = Math.cos(particle.phase * 2);
  const width: number = turn > 0.3 ? particle.size : 1;
  const height: number = turn < -0.3 ? particle.size : 1;
  context.fillRect(Math.round(x), Math.round(particle.y), width, height);
}

/** A thin wisp of fog: rows of pixels, widest in the middle, narrower above and below. */
function drawFogWisp(context: CanvasRenderingContext2D, particle: PixelPalsParticleRuntime, x: number): void {
  const rows: number = Math.max(1, particle.length);
  for (let row = 0; row < rows; row += 1) {
    const fromMiddle: number = rows === 1 ? 0 : (row - (rows - 1) / 2) / (rows / 2);
    const halfWidth: number = (particle.size / 2) * Math.sqrt(Math.max(0, 1 - fromMiddle * fromMiddle));
    if (halfWidth >= 1) {
      context.fillRect(Math.round(x - halfWidth), Math.round(particle.y + row), Math.round(halfWidth * 2), 1);
    }
  }
}
