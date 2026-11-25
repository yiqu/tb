import type { PetZooRange } from '../constants/pet-zoo-behavior.constants';

export function randomBetween(range: PetZooRange): number {
  const [min, max] = range;
  return min + Math.random() * (max - min);
}

export function randomItem<T>(items: readonly T[]): T {
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
  const entries = Object.entries(weights) as [K, number][];
  const total: number = entries.reduce((sum: number, [, weight]: [K, number]) => {
    return sum + weight;
  }, 0);
  if (total <= 0) {
    return null;
  }
  let roll: number = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return key;
    }
  }
  return entries[entries.length - 1][0];
}

export function createPetZooId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
