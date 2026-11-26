import RowStack from '@/shared/components/RowStack';

import PixelPalsPetIcon from './PixelPalsPetIcon';
import { PIXEL_PALS_PETS, PixelPetId } from '../constants/pixel-pals-pets.constants';

/** The box size of the preview, before the pet's own `sizeScale`: a big panda shows bigger than a little one. */
const PREVIEW_SIZE_PX = 52;

interface PixelPalsPetPreviewProps {
  petId: PixelPetId;
  color: string;
}

/** The picked pet in the picked color, at the side of the Spawn dialog, sized by its kind's `sizeScale`. */
export default function PixelPalsPetPreview({ petId, color }: PixelPalsPetPreviewProps) {
  const previewSize: number = Math.round(PREVIEW_SIZE_PX * PIXEL_PALS_PETS[petId].sizeScale);

  return (
    <RowStack className="mt-6 size-24 shrink-0 items-end justify-center rounded-md border bg-muted/50 p-2">
      <PixelPalsPetIcon petId={ petId } color={ color } className="size-auto" style={ { width: previewSize, height: previewSize } } />
    </RowStack>
  );
}
