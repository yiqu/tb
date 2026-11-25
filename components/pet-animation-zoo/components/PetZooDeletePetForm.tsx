'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Typography from '@/components/typography/Typography';
import ColumnStack from '@/shared/components/ColumnStack';

import PetZooPetIcon from './PetZooPetIcon';
import PetZooDialogFooter from './PetZooDialogFooter';
import PetZooSelectField, { PetZooSelectOption } from './PetZooSelectField';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { getPetZooPetDescription } from '../utils/pet-zoo-pet.utils';
import { usePetZooPets, usePetZooActions } from '../store/pet-zoo.store';
import { petZooDeletePetSchema, PetZooDeletePetFormValues } from '../schemas/pet-zoo-dialogs.schema';

import type { PetZooPet } from '../models/pet-zoo.models';

interface PetZooDeletePetFormProps {
  onDone: () => void;
}

/** Choose one of the pets in the zoo. OK removes it. */
export default function PetZooDeletePetForm({ onDone }: PetZooDeletePetFormProps) {
  const pets: PetZooPet[] = usePetZooPets();
  const { removePet } = usePetZooActions();

  const { control, handleSubmit } = useForm<PetZooDeletePetFormValues>({
    resolver: zodResolver(petZooDeletePetSchema),
    defaultValues: { petId: '' },
  });

  const options: PetZooSelectOption[] = pets.map((pet: PetZooPet) => {
    return {
      value: pet.id,
      label: getPetZooPetDescription(pet),
      icon: <PetZooPetIcon type={ pet.type } color={ pet.color } />,
    };
  });

  const handleOnSubmit: SubmitHandler<PetZooDeletePetFormValues> = (values: PetZooDeletePetFormValues) => {
    removePet(values.petId);
    onDone();
  };

  return (
    <form onSubmit={ handleSubmit(handleOnSubmit) } noValidate>
      <ColumnStack className="gap-6">
        { pets.length === 0 ?
          <Typography variant="nodata1">{ PET_ZOO_LABELS.noPetsToDelete }</Typography>
        : <PetZooSelectField
            control={ control }
            name="petId"
            label={ PET_ZOO_LABELS.deletePetLabel }
            placeholder={ PET_ZOO_LABELS.deletePetPlaceholder }
            options={ options }
          />
        }
        <PetZooDialogFooter isSubmitDisabled={ pets.length === 0 } />
      </ColumnStack>
    </form>
  );
}
