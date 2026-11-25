'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';

import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import PetZooPetIcon from './PetZooPetIcon';
import PetZooTextField from './PetZooTextField';
import PetZooDialogFooter from './PetZooDialogFooter';
import PetZooSelectField, { PetZooSelectOption } from './PetZooSelectField';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { PET_ZOO_PET_NAME_MAX_LENGTH } from '../constants/pet-zoo.constants';
import { usePetZooPets, usePetZooActions } from '../store/pet-zoo.store';
import { PET_ZOO_PETS, PET_ZOO_PET_TYPES, PetZooPetType } from '../constants/pet-zoo-pets.constants';
import { petZooSpawnPetSchema, PetZooSpawnPetFormValues } from '../schemas/pet-zoo-dialogs.schema';
import { isPetZooColorOf, getRandomPetZooName, getPetZooDefaultColor } from '../utils/pet-zoo-pet.utils';

import type { PetZooPet, PetZooPetColorDefinition } from '../models/pet-zoo.models';

const DEFAULT_PET_TYPE: PetZooPetType = 'dog';

const PET_TYPE_OPTIONS: PetZooSelectOption[] = PET_ZOO_PET_TYPES.map((type: PetZooPetType) => {
  return {
    value: type,
    label: PET_ZOO_PETS[type].label,
    icon: <PetZooPetIcon type={ type } color={ getPetZooDefaultColor(type) } />,
  };
});

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

/** Pick a pet, a color and a name. OK adds it to the zoo, where it hops in and says hi. */
export default function PetZooSpawnPetForm({ onDone }: PetZooSpawnPetFormProps) {
  const pets: PetZooPet[] = usePetZooPets();
  const { addPet } = usePetZooActions();
  // a name none of the current pets has, picked once when the dialog opens
  const [defaultName] = useState<string>(() => {
    return getRandomPetZooName(
      pets.map((pet: PetZooPet) => {
        return pet.name;
      }),
    );
  });

  const { control, handleSubmit, setValue } = useForm<PetZooSpawnPetFormValues>({
    resolver: zodResolver(petZooSpawnPetSchema),
    defaultValues: { type: DEFAULT_PET_TYPE, color: getPetZooDefaultColor(DEFAULT_PET_TYPE), name: defaultName },
  });

  const type: PetZooPetType = useWatch({ control, name: 'type' });
  const color: string = useWatch({ control, name: 'color' });
  const hasValidColor: boolean = isPetZooColorOf(type, color);

  // another kind of pet has other colors: start on its first one
  useEffect(() => {
    if (!hasValidColor) {
      setValue('color', getPetZooDefaultColor(type), { shouldValidate: true });
    }
  }, [type, hasValidColor, setValue]);

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
              options={ PET_TYPE_OPTIONS }
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
            <PetZooPetIcon type={ type } color={ hasValidColor ? color : getPetZooDefaultColor(type) } className="size-16" />
          </RowStack>
        </RowStack>
        <PetZooDialogFooter />
      </ColumnStack>
    </form>
  );
}
