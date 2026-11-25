import type { PetZooRange } from '../constants/pet-zoo-behavior.constants';

export function randomBetween(range: PetZooRange): number {
  const [min, max] = range;
  return min + Math.random() * (max - min);
}

/** A random item, or undefined when the list is empty. */
export function randomItem<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[Math.floor(Math.random() * items.length)];
}

/** True with the given probability, 0 to 1. */
export function randomChance(probability: number): boolean {
  return Math.random() < probability;
}

export function randomSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

/** Picks a key by weight. Keys with a weight of 0 are never picked. */
export function randomWeightedKey<K extends string>(weights: Partial<Record<K, number>>): K | null {
  const entries: [K, number][] = (Object.entries(weights) as [K, number][]).filter(([, weight]: [K, number]) => {
    return weight > 0;
  });
  const total: number = entries.reduce((sum: number, [, weight]: [K, number]) => {
    return sum + weight;
  }, 0);
  if (entries.length === 0) {
    return null;
  }
  let roll: number = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return key;
    }
  }
  // rounding can leave a sliver over
  return entries[entries.length - 1][0];
}

export function createPetZooId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
