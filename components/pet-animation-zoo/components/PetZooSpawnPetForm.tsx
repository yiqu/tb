'use client';

import { DateTime } from 'luxon';
import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';

import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import PetZooPetIcon from './PetZooPetIcon';
import PetZooTextField from './PetZooTextField';
import PetZooLockedLabel from './PetZooLockedLabel';
import PetZooDialogFooter from './PetZooDialogFooter';
import PetZooSelectField, { PetZooSelectOption } from './PetZooSelectField';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';
import { getPetZooNow, isPetZooPetTypeUnlocked } from '../utils/pet-zoo-unlock.utils';
import { usePetZooPets, usePetZooActions, usePetZooUnlocks } from '../store/pet-zoo.store';
import { PET_ZOO_PETS, PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';
import { isPetZooColorOf, getPetZooDefaultColor, getPetZooSuggestedName } from '../utils/pet-zoo-pet.utils';
import { createPetZooSpawnPetSchema, PetZooSpawnPetFormValues } from '../schemas/pet-zoo-dialogs.schema';

import type { PetZooPet, PetZooUnlocks, PetZooPetColorDefinition } from '../models/pet-zoo.models';

const DEFAULT_PET_TYPE: PetZooPetType = 'dog';

/** The preview at the side of the dialog, at the pet's size: a big panda is bigger than a little one. */
const PREVIEW_SIZE_PX = 52;

/** Every kind of pet in the master list. Locked ones are listed with a lock and cannot be picked. */
function getTypeOptions(isTypeUnlocked: (_type: PetZooPetType) => boolean, unlocks: PetZooUnlocks): PetZooSelectOption[] {
  return PET_ZOO_PET_TYPES.map((type: PetZooPetType) => {
    const definition = PET_ZOO_PETS[type];
    const isUnlocked: boolean = isTypeUnlocked(type);
    return {
      value: type,
      label: definition.label,
      icon: <PetZooPetIcon type={ type } color={ getPetZooDefaultColor(type) } />,
      trailing: isUnlocked ? null : <PetZooLockedLabel unlocks={ [definition.unlocked, unlocks.pets[type]] } />,
      disabled: !isUnlocked,
    };
  });
}

function getColorOptions(type: PetZooPetType): PetZooSelectOption[] {
  return PET_ZOO_PETS[type].colors.map((color: PetZooPetColorDefinition) => {
    return {
      value: color.value,
      label: color.label,
      icon: <PetZooPetIcon type={ type } color={ color.value } />,
    };
  });
}

interface PetZooSpawnPetFormProps {
  onDone: () => void;
}

/**
 * Pick a pet, a color and a name. The name starts as the kind's default name and follows the kind until the person
 * types their own. OK adds it to the zoo, where it hops in and says hi.
 */
export default function PetZooSpawnPetForm({ onDone }: PetZooSpawnPetFormProps) {
  const pets: PetZooPet[] = usePetZooPets();
  const { addPet } = usePetZooActions();
  const unlocks: PetZooUnlocks = usePetZooUnlocks();
  // read once when the dialog opens: the names in use, and the time that decides which dated pets are unlocked
  const [takenNames] = useState<string[]>(() => {
    return pets.map((pet: PetZooPet) => {
      return pet.name;
    });
  });
  const [now] = useState<DateTime>(getPetZooNow);
  const isTypeUnlocked = (type: PetZooPetType): boolean => {
    return isPetZooPetTypeUnlocked(type, unlocks, now);
  };
  const [initialName] = useState<string>(() => {
    return getPetZooSuggestedName(DEFAULT_PET_TYPE, takenNames);
  });
  // set once the person types in the name box: from then on the name is theirs. Emptying the box gives it back.
  const isNameTypedRef = useRef<boolean>(false);

  const { control, handleSubmit, setValue, watch } = useForm<PetZooSpawnPetFormValues>({
    resolver: zodResolver(createPetZooSpawnPetSchema(isTypeUnlocked)),
    defaultValues: { type: DEFAULT_PET_TYPE, color: getPetZooDefaultColor(DEFAULT_PET_TYPE), name: initialName },
  });

  const type: PetZooPetType = useWatch({ control, name: 'type' });
  const color: string = useWatch({ control, name: 'color' });
  const hasValidColor: boolean = isPetZooColorOf(type, color);
  const previewSize: number = Math.round(PREVIEW_SIZE_PX * PET_ZOO_PETS[type].sizeScale);

  // another kind of pet has other colors: start on its first one
  useEffect(() => {
    if (!hasValidColor) {
      setValue('color', getPetZooDefaultColor(type), { shouldValidate: true });
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
      setValue('name', getPetZooSuggestedName(type, takenNames));
    }
  }, [type, takenNames, setValue]);

  const handleOnSubmit: SubmitHandler<PetZooSpawnPetFormValues> = (values: PetZooSpawnPetFormValues) => {
    addPet(values);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        <RowStack className="items-start gap-4">
          <ColumnStack className="min-w-0 flex-1 gap-4">
            <PetZooSelectField
              control={ control }
              name="type"
              label={ PET_ZOO_LABELS.petTypeLabel }
              placeholder={ PET_ZOO_LABELS.petTypePlaceholder }
              options={ getTypeOptions(isTypeUnlocked, unlocks) }
            />
            <PetZooSelectField
              control={ control }
              name="color"
              label={ PET_ZOO_LABELS.petColorLabel }
              placeholder={ PET_ZOO_LABELS.petColorPlaceholder }
              options={ getColorOptions(type) }
              disabled={ PET_ZOO_PETS[type].colors.length < 2 }
            />
            <PetZooTextField
              control={ control }
              name="name"
              label={ PET_ZOO_LABELS.petNameLabel }
              placeholder={ PET_ZOO_LABELS.petNamePlaceholder }
              maxLength={ PET_ZOO_PET_NAME_MAX_LENGTH }
            />
          </ColumnStack>
          <RowStack className="mt-6 size-24 shrink-0 items-end justify-center rounded-md border bg-muted/50 p-2">
            <PetZooPetIcon
              type={ type }
              color={ hasValidColor ? color : getPetZooDefaultColor(type) }
              className="size-auto"
              style={ { width: previewSize, height: previewSize } }
            />
          </RowStack>
        </RowStack>
        <PetZooDialogFooter />
      </ColumnStack>
    </form>
  );
}
