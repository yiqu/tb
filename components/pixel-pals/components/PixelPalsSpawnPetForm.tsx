'use client';

import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';

import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsPetIcon from './PixelPalsPetIcon';
import PixelPalsFormError from './PixelPalsFormError';
import PixelPalsTextField from './PixelPalsTextField';
import PixelPalsPetPreview from './PixelPalsPetPreview';
import PixelPalsLockedLabel from './PixelPalsLockedLabel';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { PIXEL_PALS_PET_NAME_MAX_LENGTH } from '../constants/pixel-pals.constants';
import { useGetUnlockedPets, useGetUserPixelPets, usePixelPetStoreActions } from '../store/pixel-pets.store';
import { PIXEL_PALS_PETS, PIXEL_PALS_PET_IDS, PIXEL_PALS_DEFAULT_PET_ID, PixelPetId } from '../constants/pixel-pals-pets.constants';
import { isPixelPalsColorOf, getResolvedPixelPet, getPixelPalsDefaultColor, getPixelPalsSuggestedName } from '../utils/pixel-pals-pet.utils';
import { createPixelPalsSpawnPetSchema, PixelPalsSpawnPetFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPet, NewPixelPet, PixelPetUnlockedPets, PixelPalsPetColorDefinition } from '../models/pixel-pals.models';

/** The kind the dialog starts on: the default pet when it is unlocked, otherwise the first unlocked kind in the master list. */
function getInitialPetId(unlockedPets: PixelPetUnlockedPets): PixelPetId {
  if (unlockedPets[PIXEL_PALS_DEFAULT_PET_ID]) {
    return PIXEL_PALS_DEFAULT_PET_ID;
  }
  const firstUnlocked: PixelPetId | undefined = PIXEL_PALS_PET_IDS.find((petId: PixelPetId) => {
    return unlockedPets[petId];
  });
  // every kind locked: the dialog turns the pick down with "This pet is locked"
  return firstUnlocked ?? PIXEL_PALS_DEFAULT_PET_ID;
}

/** Every kind of pet in the master list. The ones locked in `unlockedPets` are listed with a lock and cannot be picked. */
function getPetIdOptions(unlockedPets: PixelPetUnlockedPets): PixelPalsSelectOption[] {
  return PIXEL_PALS_PET_IDS.map((petId: PixelPetId) => {
    const definition = PIXEL_PALS_PETS[petId];
    const isUnlocked: boolean = unlockedPets[petId];
    return {
      value: petId,
      label: definition.label,
      icon: <PixelPalsPetIcon petId={ petId } color={ getPixelPalsDefaultColor(petId) } />,
      trailing: isUnlocked ? null : <PixelPalsLockedLabel />,
      disabled: !isUnlocked,
    };
  });
}

function getColorOptions(petId: PixelPetId): PixelPalsSelectOption[] {
  return PIXEL_PALS_PETS[petId].colors.map((color: PixelPalsPetColorDefinition) => {
    return {
      value: color.value,
      label: color.label,
      icon: <PixelPalsPetIcon petId={ petId } color={ color.value } />,
    };
  });
}

interface PixelPalsSpawnPetFormProps {
  onDone: () => void;
}

/**
 * Pick a pet, a color and a name. The name starts as the kind's default name and follows the kind until the person
 * types their own. OK adds it to `userPixelPets`, and it hops into Pixel Pals and says hi. Only a name other than the
 * kind's default name is saved, as its `nickName`.
 */
export default function PixelPalsSpawnPetForm({ onDone }: PixelPalsSpawnPetFormProps) {
  const userPixelPets: PixelPet[] = useGetUserPixelPets();
  const { addUserPixelPet } = usePixelPetStoreActions();
  const unlockedPets: PixelPetUnlockedPets = useGetUnlockedPets();
  const isPetUnlocked = (petId: PixelPetId): boolean => {
    return unlockedPets[petId];
  };
  // read once when the dialog opens: the names in use, and the kind it starts on
  const [takenNames] = useState<string[]>(() => {
    return userPixelPets.map((pet: PixelPet) => {
      return getResolvedPixelPet(pet).name;
    });
  });
  const [initialPetId] = useState<PixelPetId>(() => {
    return getInitialPetId(unlockedPets);
  });
  const [initialName] = useState<string>(() => {
    return getPixelPalsSuggestedName(initialPetId, takenNames);
  });
  // set once the person types in the name box: from then on the name is theirs. Emptying the box gives it back.
  const isNameTypedRef = useRef<boolean>(false);

  const { control, handleSubmit, setValue, setError, clearErrors, watch, formState } = useForm<PixelPalsSpawnPetFormValues>({
    resolver: zodResolver(createPixelPalsSpawnPetSchema(isPetUnlocked)),
    defaultValues: { petId: initialPetId, color: getPixelPalsDefaultColor(initialPetId), name: initialName },
  });

  const petId: PixelPetId = useWatch({ control, name: 'petId' });
  const color: string = useWatch({ control, name: 'color' });
  const hasValidColor: boolean = isPixelPalsColorOf(petId, color);

  // another kind of pet has other colors: start on its first one
  useEffect(() => {
    if (!hasValidColor) {
      setValue('color', getPixelPalsDefaultColor(petId), { shouldValidate: true });
    }
  }, [petId, hasValidColor, setValue]);

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

  // another kind of pet: its default name, unless the person typed a name of their own. The suggestion is always a
  // valid name, so a "name is required" error left from an empty box goes away with it.
  useEffect(() => {
    if (!isNameTypedRef.current) {
      setValue('name', getPixelPalsSuggestedName(petId, takenNames));
      clearErrors('name');
    }
  }, [petId, takenNames, setValue, clearErrors]);

  const handleOnSubmit: SubmitHandler<PixelPalsSpawnPetFormValues> = (values: PixelPalsSpawnPetFormValues) => {
    const newPet: NewPixelPet = { petId: values.petId, color: values.color };
    if (values.name !== PIXEL_PALS_PETS[values.petId].defaultName) {
      newPet.nickName = values.name;
    }
    // the store turns the pet down when Pixel Pals filled up while the dialog was open
    if (addUserPixelPet(newPet) === null) {
      setError('root', { message: PIXEL_PALS_LABELS.maxPetsReached });
      return;
    }
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        <RowStack className="items-start gap-4">
          <ColumnStack className="min-w-0 flex-1 gap-4">
            <PixelPalsSelectField
              control={ control }
              name="petId"
              label={ PIXEL_PALS_LABELS.petTypeLabel }
              placeholder={ PIXEL_PALS_LABELS.petTypePlaceholder }
              options={ getPetIdOptions(unlockedPets) }
            />
            <PixelPalsSelectField
              control={ control }
              name="color"
              label={ PIXEL_PALS_LABELS.petColorLabel }
              placeholder={ PIXEL_PALS_LABELS.petColorPlaceholder }
              options={ getColorOptions(petId) }
              disabled={ PIXEL_PALS_PETS[petId].colors.length < 2 }
            />
            <PixelPalsTextField
              control={ control }
              name="name"
              label={ PIXEL_PALS_LABELS.petNameLabel }
              placeholder={ PIXEL_PALS_LABELS.petNamePlaceholder }
              maxLength={ PIXEL_PALS_PET_NAME_MAX_LENGTH }
            />
          </ColumnStack>
          <PixelPalsPetPreview petId={ petId } color={ hasValidColor ? color : getPixelPalsDefaultColor(petId) } />
        </RowStack>
        { formState.errors.root?.message ?
          <PixelPalsFormError message={ formState.errors.root.message } />
        : null }
        <PixelPalsDialogFooter />
      </ColumnStack>
    </form>
  );
}
