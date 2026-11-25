'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Typography from '@/components/typography/Typography';
import ColumnStack from '@/shared/components/ColumnStack';

import PixelPalsPetIcon from './PixelPalsPetIcon';
import PixelPalsDialogFooter from './PixelPalsDialogFooter';
import PixelPalsSelectField, { PixelPalsSelectOption } from './PixelPalsSelectField';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { getPixelPalsPetDescription } from '../utils/pixel-pals-pet.utils';
import { usePixelPalsPets, usePixelPalsActions } from '../store/pixel-pals.store';
import { pixelPalsDeletePetSchema, PixelPalsDeletePetFormValues } from '../schemas/pixel-pals-dialogs.schema';

import type { PixelPalsPet } from '../models/pixel-pals.models';

interface PixelPalsDeletePetFormProps {
  onDone: () => void;
}

/** Choose one of the pets in Pixel Pals. OK removes it. */
export default function PixelPalsDeletePetForm({ onDone }: PixelPalsDeletePetFormProps) {
  const pets: PixelPalsPet[] = usePixelPalsPets();
  const { removePet } = usePixelPalsActions();

  const { control, handleSubmit } = useForm<PixelPalsDeletePetFormValues>({
    resolver: zodResolver(pixelPalsDeletePetSchema),
    defaultValues: { petId: '' },
  });

  const options: PixelPalsSelectOption[] = pets.map((pet: PixelPalsPet) => {
    return {
      value: pet.id,
      label: getPixelPalsPetDescription(pet),
      icon: <PixelPalsPetIcon type={ pet.type } color={ pet.color } />,
    };
  });

  const handleOnSubmit: SubmitHandler<PixelPalsDeletePetFormValues> = (values: PixelPalsDeletePetFormValues) => {
    removePet(values.petId);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        { pets.length === 0 ?
          <Typography variant="nodata1">{ PIXEL_PALS_LABELS.noPetsToDelete }</Typography>
        : <PixelPalsSelectField
            control={ control }
            name="petId"
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
