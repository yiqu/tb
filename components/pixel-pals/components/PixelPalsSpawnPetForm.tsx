'use client';

import { DateTime } from 'luxon';
import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';

import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsPetIcon from './PixelPalsPetIcon';
import PixelPalsTextField from './PixelPalsTextField';
import PixelPalsLockedLabel from './PixelPalsLockedLabel';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';
import { getPixelPalsNow, isPixelPalsPetTypeUnlocked } from '../utils/pixel-pals-unlock.utils';
import { usePixelPalsPets, usePixelPalsActions, usePixelPalsUnlocks } from '../store/pixel-pals.store';
import { PIXEL_PALS_PETS, PIXEL_PALS_PET_TYPES, PixelPalsPetType } from '../constants/pixel-pals-pets.constants';
import { isPixelPalsColorOf, getPixelPalsDefaultColor, getPixelPalsSuggestedName } from '../utils/pixel-pals-pet.utils';
import { createPixelPalsSpawnPetSchema, PixelPalsSpawnPetFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPalsPet, PixelPalsUnlocks, PixelPalsPetColorDefinition } from '../models/pixel-pals.models';

const DEFAULT_PET_TYPE: PixelPalsPetType = 'dog';

/** The preview at the side of the dialog, at the pet's size: a big panda is bigger than a little one. */
const PREVIEW_SIZE_PX = 52;

/** Every kind of pet in the master list. Locked ones are listed with a lock and cannot be picked. */
function getTypeOptions(isTypeUnlocked: (_type: PixelPalsPetType) => boolean, unlocks: PixelPalsUnlocks): PixelPalsSelectOption[] {
  return PIXEL_PALS_PET_TYPES.map((type: PixelPalsPetType) => {
    const definition = PIXEL_PALS_PETS[type];
    const isUnlocked: boolean = isTypeUnlocked(type);
    return {
      value: type,
      label: definition.label,
      icon: <PixelPalsPetIcon type={ type } color={ getPixelPalsDefaultColor(type) } />,
      trailing: isUnlocked ? null : <PixelPalsLockedLabel unlocks={ [definition.unlocked, unlocks.pets[type]] } />,
      disabled: !isUnlocked,
    };
  });
}

function getColorOptions(type: PixelPalsPetType): PixelPalsSelectOption[] {
  return PIXEL_PALS_PETS[type].colors.map((color: PixelPalsPetColorDefinition) => {
    return {
      value: color.value,
      label: color.label,
      icon: <PixelPalsPetIcon type={ type } color={ color.value } />,
    };
  });
}

interface PixelPalsSpawnPetFormProps {
  onDone: () => void;
}

/**
 * Pick a pet, a color and a name. The name starts as the kind's default name and follows the kind until the person
 * types their own. OK adds it to Pixel Pals, where it hops in and says hi.
 */
export default function PixelPalsSpawnPetForm({ onDone }: PixelPalsSpawnPetFormProps) {
  const pets: PixelPalsPet[] = usePixelPalsPets();
  const { addPet } = usePixelPalsActions();
  const unlocks: PixelPalsUnlocks = usePixelPalsUnlocks();
  // read once when the dialog opens: the names in use, and the time that decides which dated pets are unlocked
  const [takenNames] = useState<string[]>(() => {
    return pets.map((pet: PixelPalsPet) => {
      return pet.name;
    });
  });
  const [now] = useState<DateTime>(getPixelPalsNow);
  const isTypeUnlocked = (type: PixelPalsPetType): boolean => {
    return isPixelPalsPetTypeUnlocked(type, unlocks, now);
  };
  const [initialName] = useState<string>(() => {
    return getPixelPalsSuggestedName(DEFAULT_PET_TYPE, takenNames);
  });
  // set once the person types in the name box: from then on the name is theirs. Emptying the box gives it back.
  const isNameTypedRef = useRef<boolean>(false);

  const { control, handleSubmit, setValue, watch } = useForm<PixelPalsSpawnPetFormValues>({
    resolver: zodResolver(createPixelPalsSpawnPetSchema(isTypeUnlocked)),
    defaultValues: { type: DEFAULT_PET_TYPE, color: getPixelPalsDefaultColor(DEFAULT_PET_TYPE), name: initialName },
  });

  const type: PixelPalsPetType = useWatch({ control, name: 'type' });
  const color: string = useWatch({ control, name: 'color' });
  const hasValidColor: boolean = isPixelPalsColorOf(type, color);
  const previewSize: number = Math.round(PREVIEW_SIZE_PX * PIXEL_PALS_PETS[type].sizeScale);

  // another kind of pet has other colors: start on its first one
  useEffect(() => {
    if (!hasValidColor) {
      setValue('color', getPixelPalsDefaultColor(type), { shouldValidate: true });
    }
  }, [type, hasValidColor, setValue]);

  // only typing counts: `setValue` below has no event type
  useEffect(() => {
    const subscription = watch((values, { name, type: eventType }) => {
      if (name === 'name' && eventType === 'change') {
        isNameTypedRef.current = (values.name ?? '') !== '';
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  // another kind of pet: its default name, unless the person typed a name of their own
  useEffect(() => {
    if (!isNameTypedRef.current) {
      setValue('name', getPixelPalsSuggestedName(type, takenNames));
    }
  }, [type, takenNames, setValue]);

  const handleOnSubmit: SubmitHandler<PixelPalsSpawnPetFormValues> = (values: PixelPalsSpawnPetFormValues) => {
    addPet(values);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        <RowStack className="items-start gap-4">
          <ColumnStack className="min-w-0 flex-1 gap-4">
            <PixelPalsSelectField
              control={ control }
              name="type"
              label={ PIXEL_PALS_LABELS.petTypeLabel }
              placeholder={ PIXEL_PALS_LABELS.petTypePlaceholder }
              options={ getTypeOptions(isTypeUnlocked, unlocks) }
            />
            <PixelPalsSelectField
              control={ control }
              name="color"
              label={ PIXEL_PALS_LABELS.petColorLabel }
              placeholder={ PIXEL_PALS_LABELS.petColorPlaceholder }
              options={ getColorOptions(type) }
              disabled={ PIXEL_PALS_PETS[type].colors.length < 2 }
            />
            <PixelPalsTextField
              control={ control }
              name="name"
              label={ PIXEL_PALS_LABELS.petNameLabel }
              placeholder={ PIXEL_PALS_LABELS.petNamePlaceholder }
              maxLength={ PIXEL_PALS_PET_NAME_MAX_LENGTH }
            />
          </ColumnStack>
          <RowStack className="mt-6 size-24 shrink-0 items-end justify-center rounded-md border bg-muted/50 p-2">
            <PixelPalsPetIcon
              type={ type }
              color={ hasValidColor ? color : getPixelPalsDefaultColor(type) }
              className="size-auto"
              style={ { width: previewSize, height: previewSize } }
            />
          </RowStack>
        </RowStack>
        <PixelPalsDialogFooter />
      </ColumnStack>
    </form>
  );
}
