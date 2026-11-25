'use client';

import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { PIXEL_PALS_MAX_HEIGHT_PX } from '../constants/pixel-pals.constants';
import { PIXEL_PALS_MIN_HEIGHT_PX } from '../constants/pixel-pals-height.constants';

import type { PixelPalsHeightResize } from '../hooks/usePixelPalsHeightResize';

interface PixelPalsHeightResizeHandleProps {
  height: number;
  isResizing: boolean;
  handleProps: PixelPalsHeightResize['handleProps'];
}

/** The top edge of Pixel Pals: drag it up or down to resize, double-click to reset, or focus it and use the arrow keys. */
export default function PixelPalsHeightResizeHandle({ height, isResizing, handleProps }: PixelPalsHeightResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label={ PIXEL_PALS_LABELS.resizeHandleAriaLabel }
      aria-valuemin={ PIXEL_PALS_MIN_HEIGHT_PX }
      aria-valuemax={ PIXEL_PALS_MAX_HEIGHT_PX }
      aria-valuenow={ height }
      title={ PIXEL_PALS_LABELS.resizeHandleTitle }
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
