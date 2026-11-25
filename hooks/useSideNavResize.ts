'use client';

import { useRef, useState, useEffect, KeyboardEvent, PointerEvent } from 'react';

import { useSidebar } from '@/components/ui/sidebar';
import { clampSideNavWidth } from '@/lib/side-nav-width.utils';
import {
  SIDE_NAV_DEFAULT_WIDTH_PX,
  SIDE_NAV_WIDTH_COOKIE_NAME,
  SIDE_NAV_COLLAPSE_THRESHOLD_PX,
  SIDE_NAV_WIDTH_KEYBOARD_STEP_PX,
  SIDE_NAV_WIDTH_COOKIE_MAX_AGE_SECONDS,
} from '@/constants/side-nav-resize.constants';

/** The element that holds `--sidebar-width`, see `SidebarProvider`. */
const SIDEBAR_WRAPPER_SELECTOR = '[data-slot="sidebar-wrapper"]';

interface DragState {
  wrapper: HTMLElement;
  /** Where on the handle it was grabbed, relative to the nav's right edge, so the edge does not jump to the pointer. */
  grabOffset: number;
  width: number;
  isCollapsed: boolean;
}

function writeSideNavWidthCookie(width: number): void {
  document.cookie = `${SIDE_NAV_WIDTH_COOKIE_NAME}=${width}; path=/; max-age=${SIDE_NAV_WIDTH_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export interface SideNavResize {
  width: number;
  isResizing: boolean;
  handleProps: {
    onPointerDown: (_event: PointerEvent<HTMLElement>) => void;
    onPointerMove: (_event: PointerEvent<HTMLElement>) => void;
    onPointerUp: (_event: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (_event: PointerEvent<HTMLElement>) => void;
    onDoubleClick: () => void;
    onKeyDown: (_event: KeyboardEvent<HTMLElement>) => void;
  };
}

/**
 * Drag the right edge of the left nav to resize it.
 * - while dragging, `--sidebar-width` is written straight to the wrapper, so the app does not re-render on every move
 * - dragged narrower than `SIDE_NAV_COLLAPSE_THRESHOLD_PX` it collapses to icons, like the collapse button;
 *   dragged back out it opens again
 * - on release the width goes into the sidebar state and a cookie, which the server and the boot script read on the next load
 * - double-click resets the width, arrow keys nudge it
 */
export function useSideNavResize(): SideNavResize {
  const { width: savedWidth, setWidth, state, setOpen, isMobile } = useSidebar();
  const width: number = savedWidth ?? SIDE_NAV_DEFAULT_WIDTH_PX;
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const dragRef = useRef<DragState | null>(null);

  const commitWidth = (nextWidth: number) => {
    const clamped: number = clampSideNavWidth(nextWidth);
    setWidth(clamped);
    writeSideNavWidthCookie(clamped);
  };

  /** Ends a drag: clears the drag styles and keeps the width it reached. Does nothing when no drag is going on. */
  const finishDrag = () => {
    const drag: DragState | null = dragRef.current;
    if (!drag) {
      return;
    }
    dragRef.current = null;
    setIsResizing(false);
    delete drag.wrapper.dataset.resizing;
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
    commitWidth(drag.width);
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishDrag();
  };

  // The handle goes away at mobile widths and when it unmounts, and with it the pointer up that ends a drag.
  // This cleanup runs on both, so a drag in progress ends there instead of leaving the page stuck in resize mode.
  // (`finishDrag` only uses refs and stable setters, so an older render's copy works the same.)
  useEffect(() => {
    return () => {
      finishDrag();
    };
  }, [isMobile]);

  return {
    width,
    isResizing,
    handleProps: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        const wrapper: HTMLElement | null = event.currentTarget.closest(SIDEBAR_WRAPPER_SELECTOR);
        if (event.button !== 0 || !wrapper) {
          return;
        }
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const isCollapsed: boolean = state === 'collapsed';
        dragRef.current = {
          wrapper,
          grabOffset: isCollapsed ? 0 : width - event.clientX,
          width,
          isCollapsed,
        };
        wrapper.dataset.resizing = 'true';
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        setIsResizing(true);
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const drag: DragState | null = dragRef.current;
        if (!drag) {
          return;
        }
        // the nav starts at the left edge of the window, so its width is where the pointer is
        const pointerWidth: number = event.clientX + drag.grabOffset;
        if (pointerWidth < SIDE_NAV_COLLAPSE_THRESHOLD_PX) {
          if (!drag.isCollapsed) {
            drag.isCollapsed = true;
            setOpen(false);
          }
          return;
        }
        if (drag.isCollapsed) {
          drag.isCollapsed = false;
          setOpen(true);
        }
        drag.width = clampSideNavWidth(pointerWidth);
        drag.wrapper.style.setProperty('--sidebar-width', `${drag.width}px`);
        // React only renders the width on release, keep the separator's value current for assistive tech meanwhile
        event.currentTarget.setAttribute('aria-valuenow', String(drag.width));
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick: () => {
        commitWidth(SIDE_NAV_DEFAULT_WIDTH_PX);
        setOpen(true);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          commitWidth(width + SIDE_NAV_WIDTH_KEYBOARD_STEP_PX);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          commitWidth(width - SIDE_NAV_WIDTH_KEYBOARD_STEP_PX);
        }
      },
    },
  };
}
