import { DateTime } from 'luxon';

import { PET_ZOO_PETS, PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_TIME_ZONE, PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';

import type { PetZooPet, PetZooPetDefinition, PetZooPetColorDefinition } from '../models/pet-zoo.models';

export function isPetZooPetType(value: unknown): value is PetZooPetType {
  return typeof value === 'string' && (PET_ZOO_PET_TYPES as readonly string[]).includes(value);
}

export function getPetZooPetDefinition(type: PetZooPetType): PetZooPetDefinition {
  return PET_ZOO_PETS[type];
}

export function isPetZooColorOf(type: PetZooPetType, color: string): boolean {
  return PET_ZOO_PETS[type].colors.some((definition: PetZooPetColorDefinition) => {
    return definition.value === color;
  });
}

export function getPetZooDefaultColor(type: PetZooPetType): string {
  return PET_ZOO_PETS[type].colors[0].value;
}

export function getPetZooColorLabel(type: PetZooPetType, color: string): string {
  const definition: PetZooPetColorDefinition | undefined = PET_ZOO_PETS[type].colors.find((item: PetZooPetColorDefinition) => {
    return item.value === color;
  });
  return definition?.label ?? color;
}

/** e.g. "Bella, brown dog". Used in the delete dialog and as the tooltip of a pet. */
export function getPetZooPetDescription(pet: PetZooPet): string {
  const definition: PetZooPetDefinition = PET_ZOO_PETS[pet.type];
  if (definition.colors.length === 1) {
    return `${pet.name}, ${definition.label.toLowerCase()}`;
  }
  return `${pet.name}, ${getPetZooColorLabel(pet.type, pet.color).toLowerCase()} ${definition.label.toLowerCase()}`;
}

/**
 * Whether a kind of pet can be spawned now. `unlocked` is true or false, or the time it unlocks.
 * `now` is passed in by tests and by the dialog, which reads the clock once when it opens.
 */
export function isPetZooPetUnlocked(definition: PetZooPetDefinition, now: DateTime = DateTime.now().setZone(PET_ZOO_TIME_ZONE)): boolean {
  if (typeof definition.unlocked === 'boolean') {
    return definition.unlocked;
  }
  return now.toMillis() >= definition.unlocked;
}

/** When a locked kind of pet unlocks, e.g. "Dec 25", or null when it has no date. Shown in Eastern time. */
export function getPetZooUnlockDateLabel(definition: PetZooPetDefinition): string | null {
  if (typeof definition.unlocked === 'boolean') {
    return null;
  }
  return DateTime.fromMillis(definition.unlocked, { zone: PET_ZOO_TIME_ZONE }).toFormat('LLL d');
}

/**
 * The name the Spawn dialog starts with: the kind's default name, or "Biscuit 2", "Biscuit 3"... when a pet in the
 * zoo already has it.
 */
export function getPetZooSuggestedName(type: PetZooPetType, takenNames: readonly string[] = []): string {
  const defaultName: string = PET_ZOO_PETS[type].defaultName;
  if (!takenNames.includes(defaultName)) {
    return defaultName;
  }
  for (let count = 2; count < 100; count += 1) {
    const suffix = ` ${count}`;
    const name: string = `${defaultName.slice(0, PET_ZOO_PET_NAME_MAX_LENGTH - suffix.length)}${suffix}`;
    if (!takenNames.includes(name)) {
      return name;
    }
  }
  return defaultName;
}

/** Fills `{name}` and `{sound}` in a message. */
export function formatPetZooMessage(template: string, pet: Pick<PetZooPet, 'name'>, definition: PetZooPetDefinition): string {
  return template.replaceAll('{name}', pet.name).replaceAll('{sound}', definition.voice.sound);
}
