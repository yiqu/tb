import { PET_ZOO_PETS, PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';

import type { PetZooPet, PetZooPetDefinition, PetZooPetColorDefinition } from '../models/pet-zoo.models';

const MESSAGE_PLACEHOLDER_PATTERN = /\{name\}|\{sound\}/g;

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

/** Fills `{name}` and `{sound}` in a message, in one pass, so a name like `{sound}` is shown as typed. */
export function formatPetZooMessage(template: string, pet: Pick<PetZooPet, 'name'>, definition: PetZooPetDefinition): string {
  return template.replaceAll(MESSAGE_PLACEHOLDER_PATTERN, (placeholder: string) => {
    return placeholder === '{name}' ? pet.name : definition.voice.sound;
  });
}
