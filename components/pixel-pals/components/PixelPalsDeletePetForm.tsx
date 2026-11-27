'use client';

import { useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Typography from '@/components/typography/Typography';
import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsPetIcon from './PixelPalsPetIcon';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { getResolvedPixelPets, getPixelPalsPetDescription } from '../utils/pixel-pals-pet.utils';
import { useGetUserPixelPets, usePixelPetStoreActions } from '../store/pixel-pets.store';
import { pixelPalsDeletePetSchema, PixelPalsDeletePetFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPet, ResolvedPixelPet } from '../models/pixel-pals.models';

interface PixelPalsDeletePetFormProps {
  onDone: () => void;
}

/** Choose one of the pets in Pixel Pals. OK removes it. */
export default function PixelPalsDeletePetForm({ onDone }: PixelPalsDeletePetFormProps) {
  const userPixelPets: PixelPet[] = useGetUserPixelPets();
  const { removeUserPixelPet } = usePixelPetStoreActions();
  const pets: ResolvedPixelPet[] = useMemo(() => {
    return getResolvedPixelPets(userPixelPets);
  }, [userPixelPets]);

  const { control, handleSubmit } = useForm<PixelPalsDeletePetFormValues>({
    resolver: zodResolver(pixelPalsDeletePetSchema),
    defaultValues: { id: '' },
  });

  const options: PixelPalsSelectOption[] = pets.map((pet: ResolvedPixelPet) => {
    return {
      value: pet.id,
      label: getPixelPalsPetDescription(pet),
      icon: <PixelPalsPetIcon petId={ pet.petId } color={ pet.color } />,
    };
  });

  const handleOnSubmit: SubmitHandler<PixelPalsDeletePetFormValues> = (values: PixelPalsDeletePetFormValues) => {
    removeUserPixelPet(values.id);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        { pets.length === 0 ?
          <Typography variant="nodata1">{ PIXEL_PALS_LABELS.noPetsToDelete }</Typography>
        : <PixelPalsSelectField
            control={ control }
            name="id"
            label={ PIXEL_PALS_LABELS.deletePetLabel }
            placeholder={ PIXEL_PALS_LABELS.deletePetPlaceholder }
            options={ options }
          />
        }
        <PixelPalsDialogFooter isSubmitDisabled={ pets.length === 0 } />
      </ColumnStack>
    </form>
  );
}
