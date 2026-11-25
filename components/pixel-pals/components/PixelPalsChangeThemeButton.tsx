'use client';

import { useState } from 'react';
import { PaintBucket } from 'lucide-react';

import PixelPalsDialog from './PixelPalsDialog';
import PixelPalsToolbarButton from './PixelPalsToolbarButton';
import PixelPalsChangeThemeForm from './PixelPalsChangeThemeForm';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';

/** Opens the Change theme dialog. */
export default function PixelPalsChangeThemeButton() {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnClick = () => {
    setOpen(true);
  };

  return (
    <>
      <PixelPalsToolbarButton label={ PIXEL_PALS_LABELS.changeTheme } icon={ <PaintBucket /> } onClick={ handleOnClick } />
      <PixelPalsDialog
        open={ open }
        onOpenChange={ setOpen }
        title={ PIXEL_PALS_LABELS.changeThemeDialogTitle }
        description={ PIXEL_PALS_LABELS.changeThemeDialogDescription }
      >
        <PixelPalsChangeThemeForm onDone={ handleOnClose } />
      </PixelPalsDialog>
    </>
  );
}
