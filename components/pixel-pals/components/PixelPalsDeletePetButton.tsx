'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import PixelPalsDialog from './PixelPalsDialog';
import PixelPalsDeletePetForm from './PixelPalsDeletePetForm';
import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import { useGetSpawnedPixelPetCount } from '../store/pixel-pets.store';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

/** Opens the Delete pet dialog. Disabled while Pixel Pals is empty. */
export default function PixelPalsDeletePetButton() {
  const [open, setOpen] = useState<boolean>(false);
  const spawnedPetCount: number = useGetSpawnedPixelPetCount();

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    setOpen(true);
  };

  return (
    <>
      <PixelPalsToolbarButton
        label={ PIXEL_PALS_LABELS.deletePet }
        icon={ <Trash2 /> }
        onClick={ handleOnClick }
        disabled={ spawnedPetCount === 0 }
        disabledLabel={ PIXEL_PALS_LABELS.noPetsToDelete }
      />
      <PixelPalsDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PIXEL_PALS_LABELS.deletePetDialogTitle }
        description={ PIXEL_PALS_LABELS.deletePetDialogDescription }
      >
        <PixelPalsDeletePetForm onDone={ handleOnClose } />
      </PixelPalsDialog>
    </>
  );
}
