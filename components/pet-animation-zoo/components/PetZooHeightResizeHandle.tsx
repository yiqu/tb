'use client';

import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { PET_ZOO_MAX_HEIGHT_PX, PET_ZOO_MIN_HEIGHT_PX } from '../constants/pet-zoo.constants';

import type { PetZooHeightResize } from '../hooks/usePetZooHeightResize';

interface PetZooHeightResizeHandleProps {
  height: number;
  isResizing: boolean;
  handleProps: PetZooHeightResize['handleProps'];
}

/** The top edge of the zoo: drag it up or down to resize, double-click to reset, or focus it and use the arrow keys. */
export default function PetZooHeightResizeHandle({ height, isResizing, handleProps }: PetZooHeightResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label={ PET_ZOO_LABELS.resizeHandleAriaLabel }
      aria-valuemin={ PET_ZOO_MIN_HEIGHT_PX }
      aria-valuemax={ PET_ZOO_MAX_HEIGHT_PX }
      aria-valuenow={ height }
      title={ PET_ZOO_LABELS.resizeHandleTitle }
      tabIndex={ 0 }
      data-resizing={ isResizing }
      className="
        absolute inset-x-0 top-0 z-40 h-1.5 cursor-row-resize touch-none outline-none select-none
        after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-transparent after:transition-colors
        hover:after:bg-primary/70
        focus-visible:after:bg-primary
        data-[resizing=true]:after:bg-primary
      "
      { ...handleProps }
    />
  );
}
