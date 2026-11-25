'use client';

import { useState } from 'react';
import { PaintBucket } from 'lucide-react';

import PetZooDialog from './PetZooDialog';
import PetZooToolbarButton from './PetZooToolbarButton';
import PetZooChangeThemeForm from './PetZooChangeThemeForm';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';

/** Opens the Change theme dialog. */
export default function PetZooChangeThemeButton() {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    setOpen(true);
  };

  return (
    <>
      <PetZooToolbarButton label={ PET_ZOO_LABELS.changeTheme } icon={ <PaintBucket /> } onClick={ handleOnClick } />
      <PetZooDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PET_ZOO_LABELS.changeThemeDialogTitle }
        description={ PET_ZOO_LABELS.changeThemeDialogDescription }
      >
        <PetZooChangeThemeForm onDone={ handleOnClose } />
      </PetZooDialog>
    </>
  );
}
