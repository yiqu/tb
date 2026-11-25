import { PIXEL_PALS_PETS, PIXEL_PALS_PET_TYPES, PixelPalsPetType } from '../constants/pixel-pals-pets.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';

import type { PixelPalsPet, PixelPalsPetDefinition, PixelPalsPetColorDefinition } from '../models/pixel-pals.models';

const MESSAGE_PLACEHOLDER_PATTERN = /\{name\}|\{sound\}/g;

export function isPixelPalsPetType(value: unknown): value is PixelPalsPetType {
  return typeof value === 'string' && (PIXEL_PALS_PET_TYPES as readonly string[]).includes(value);
}

export function getPixelPalsPetDefinition(type: PixelPalsPetType): PixelPalsPetDefinition {
  return PIXEL_PALS_PETS[type];
}

export function isPixelPalsColorOf(type: PixelPalsPetType, color: string): boolean {
  return PIXEL_PALS_PETS[type].colors.some((definition: PixelPalsPetColorDefinition) => {
    return definition.value === color;
  });
}

export function getPixelPalsDefaultColor(type: PixelPalsPetType): string {
  return PIXEL_PALS_PETS[type].colors[0].value;
}

export function getPixelPalsColorLabel(type: PixelPalsPetType, color: string): string {
  const definition: PixelPalsPetColorDefinition | undefined = PIXEL_PALS_PETS[type].colors.find((item: PixelPalsPetColorDefinition) => {
    return item.value === color;
  });
  return definition?.label ?? color;
}

/** e.g. "Bella, brown dog". Used in the delete dialog and as the tooltip of a pet. */
export function getPixelPalsPetDescription(pet: PixelPalsPet): string {
  const definition: PixelPalsPetDefinition = PIXEL_PALS_PETS[pet.type];
  if (definition.colors.length === 1) {
    return `${pet.name}, ${definition.label.toLowerCase()}`;
  }
  return `${pet.name}, ${getPixelPalsColorLabel(pet.type, pet.color).toLowerCase()} ${definition.label.toLowerCase()}`;
}

/**
 * The name the Spawn dialog starts with: the kind's default name, or "Biscuit 2", "Biscuit 3"... when a pet in the
 * Pixel Pals already has it.
 */
export function getPixelPalsSuggestedName(type: PixelPalsPetType, takenNames: readonly string[] = []): string {
  const defaultName: string = PIXEL_PALS_PETS[type].defaultName;
  if (!takenNames.includes(defaultName)) {
    return defaultName;
  }
  for (let count = 2; count < 100; count += 1) {
    const suffix = ` ${count}`;
    const name: string = `${defaultName.slice(0, PIXEL_PALS_PET_NAME_MAX_LENGTH - suffix.length)}${suffix}`;
    if (!takenNames.includes(name)) {
      return name;
    }
  }
  return defaultName;
}

/** Fills `{name}` and `{sound}` in a message, in one pass, so a name like `{sound}` is shown as typed. */
export function formatPixelPalsMessage(template: string, pet: Pick<PixelPalsPet, 'name'>, definition: PixelPalsPetDefinition): string {
  return template.replaceAll(MESSAGE_PLACEHOLDER_PATTERN, (placeholder: string) => {
    return placeholder === '{name}' ? pet.name : definition.voice.sound;
  });
}
