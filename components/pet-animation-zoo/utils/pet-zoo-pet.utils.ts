import { randomItem } from './pet-zoo-random.utils';
import { PET_ZOO_PET_NAMES } from '../constants/pet-zoo-messages.constants';
import { PET_ZOO_PETS, PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';

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

/** A random name that none of the current pets has, when there is one left. */
export function getRandomPetZooName(takenNames: readonly string[] = []): string {
  const freeNames: string[] = PET_ZOO_PET_NAMES.filter((name: string) => {
    return !takenNames.includes(name);
  });
  // an empty name only happens with an empty name list, the name field then starts blank
  return randomItem(freeNames.length > 0 ? freeNames : PET_ZOO_PET_NAMES) ?? '';
}

/** Fills `{name}` in a message. */
export function formatPetZooMessage(template: string, name: string): string {
  return template.replaceAll('{name}', name);
}
