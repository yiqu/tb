'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { useSideNavResize } from '@/hooks/useSideNavResize';
import { SIDE_NAV_MAX_WIDTH_PX, SIDE_NAV_MIN_WIDTH_PX } from '@/constants/side-nav-resize.constants';

/**
 * The grab area on the right edge of the left nav. Drag it to resize the nav, past the collapse point it
 * collapses to icons. Double-click resets the width. Not shown on mobile, where the nav is a sheet.
 */
export default function SideNavResizeHandle() {
  const { isMobile } = useSidebar();
  const { width, isResizing, handleProps } = useSideNavResize();

  if (isMobile) {
    return null;
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the left navigation"
      aria-valuemin={ SIDE_NAV_MIN_WIDTH_PX }
      aria-valuemax={ SIDE_NAV_MAX_WIDTH_PX }
      aria-valuenow={ width }
      title="Drag to resize, double-click to reset"
      tabIndex={ 0 }
      data-resizing={ isResizing }
      className="
        absolute inset-y-0 -right-1.5 z-30 w-3 cursor-col-resize touch-none outline-none select-none
        after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-transparent after:transition-colors
        hover:after:bg-primary/60
        focus-visible:after:bg-primary
        data-[resizing=true]:after:bg-primary
      "
      { ...handleProps }
    />
  );
}
