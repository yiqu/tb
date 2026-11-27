'use client';

import { useRef, useState, useEffect, KeyboardEvent, PointerEvent, useSyncExternalStore } from 'react';

import { useSidebar } from '@/components/ui/sidebar';
import { clampSideNavWidth } from '@/lib/side-nav-width.utils';
import {
  SIDE_NAV_DEFAULT_WIDTH_PX,
  SIDE_NAV_DEFAULT_WIDTH_REM,
  SIDE_NAV_WIDTH_COOKIE_NAME,
  SIDE_NAV_COLLAPSE_THRESHOLD_PX,
  SIDE_NAV_WIDTH_KEYBOARD_STEP_PX,
  SIDE_NAV_WIDTH_COOKIE_MAX_AGE_SECONDS,
} from '@/constants/side-nav-resize.constants';

/** The element that holds `--sidebar-width`, see `SidebarProvider`. */
const SIDEBAR_WRAPPER_SELECTOR = '[data-slot="sidebar-wrapper"]';
/** The drawn nav, which holds the handle. */
const SIDEBAR_CONTAINER_SELECTOR = '[data-slot="sidebar-container"]';

interface DragState {
  /** The pointer that started the drag. Only it moves and ends the drag, another finger or a pen is ignored. */
  pointerId: number;
  wrapper: HTMLElement;
  /** Where on the handle it was grabbed, relative to the nav's right edge, so the edge does not jump to the pointer. */
  grabOffset: number;
  width: number;
  isCollapsed: boolean;
  /** Where the pointer went down. A click that never moves from there changes nothing. */
  startClientX: number;
  hasMoved: boolean;
  /** The wrapper's `--sidebar-width` before the drag, put back after a click that did not move. */
  wrapperWidth: string;
  /** The body's own inline cursor and user-select before the drag, put back when it ends. */
  bodyCursor: string;
  bodyUserSelect: string;
}

/**
 * The nav's width as drawn. Before the first resize it is the CSS default (16rem), which follows the root font size,
 * so it can differ from `SIDE_NAV_DEFAULT_WIDTH_PX`.
 */
function getDrawnSideNavWidth(handle: HTMLElement, fallback: number): number {
  const container: Element | null = handle.closest(SIDEBAR_CONTAINER_SELECTOR);
  return container ? container.getBoundingClientRect().width : fallback;
}

/** The root font size does not change while the page is open, so there is nothing to listen to. */
function subscribeToRootFontSize(): () => void {
  return () => {};
}

/** The default width (16rem) in px at this page's root font size, which can differ from 16px. */
function getDefaultSideNavWidth(): number {
  return Math.round(SIDE_NAV_DEFAULT_WIDTH_REM * parseFloat(getComputedStyle(document.documentElement).fontSize));
}

function getServerDefaultSideNavWidth(): number {
  return SIDE_NAV_DEFAULT_WIDTH_PX;
}

function writeSideNavWidthCookie(width: number): void {
  document.cookie = `${SIDE_NAV_WIDTH_COOKIE_NAME}=${width}; path=/; max-age=${SIDE_NAV_WIDTH_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function deleteSideNavWidthCookie(): void {
  document.cookie = `${SIDE_NAV_WIDTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
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
  // the separator announces the width as drawn, also before a resize and after a reset to the CSS default
  const defaultWidth: number = useSyncExternalStore(subscribeToRootFontSize, getDefaultSideNavWidth, getServerDefaultSideNavWidth);
  const width: number = savedWidth ?? defaultWidth;
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
    document.body.style.cursor = drag.bodyCursor;
    document.body.style.userSelect = drag.bodyUserSelect;
    // a click that never moved keeps the width the nav had, or was opening to, and saves nothing
    if (!drag.hasMoved) {
      drag.wrapper.style.setProperty('--sidebar-width', drag.wrapperWidth);
      return;
    }
    // the width written while dragging can differ from the one committed (see `onPointerDown`), and React only
    // writes the variable when the committed width changes, so put the committed one on the wrapper here
    drag.wrapper.style.setProperty('--sidebar-width', `${drag.width}px`);
    commitWidth(drag.width);
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }
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
        // a second pointer (another finger, or a pen beside the mouse) must not restart a drag that is running
        if (dragRef.current || event.button !== 0 || !wrapper) {
          return;
        }
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const isCollapsed: boolean = state === 'collapsed';
        const startWidth: number = isCollapsed ? width : getDrawnSideNavWidth(event.currentTarget, width);
        dragRef.current = {
          pointerId: event.pointerId,
          wrapper,
          grabOffset: isCollapsed ? 0 : startWidth - event.clientX,
          width: clampSideNavWidth(startWidth),
          isCollapsed,
          startClientX: event.clientX,
          hasMoved: false,
          wrapperWidth: wrapper.style.getPropertyValue('--sidebar-width'),
          bodyCursor: document.body.style.cursor,
          bodyUserSelect: document.body.style.userSelect,
        };
        if (!isCollapsed) {
          // `data-resizing` turns the width transition off. Hold the width where it is drawn now, so a drag that
          // starts while the nav is still animating does not snap to the end width before the pointer moves.
          wrapper.style.setProperty('--sidebar-width', `${startWidth}px`);
        }
        wrapper.dataset.resizing = 'true';
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        setIsResizing(true);
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const drag: DragState | null = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) {
          return;
        }
        if (!drag.hasMoved && event.clientX === drag.startClientX) {
          return;
        }
        drag.hasMoved = true;
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
        // back to the default width, the CSS one that follows the root font size, and nothing saved
        setWidth(null);
        deleteSideNavWidthCookie();
        setOpen(true);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
          return;
        }
        event.preventDefault();
        // collapsed: the right arrow opens it at its last width, the left arrow has nothing to shrink
        if (state === 'collapsed') {
          if (event.key === 'ArrowRight') {
            setOpen(true);
          }
          return;
        }
        // Once a width is saved it is the target of the width transition, so step from it: the drawn width lags
        // behind while the transition runs and quick presses would lose steps. Before that, the drawn width is the
        // CSS default, which follows the root font size.
        const startWidth: number = savedWidth !== null ? width : getDrawnSideNavWidth(event.currentTarget, width);
        const step: number = event.key === 'ArrowRight' ? SIDE_NAV_WIDTH_KEYBOARD_STEP_PX : -SIDE_NAV_WIDTH_KEYBOARD_STEP_PX;
        commitWidth(startWidth + step);
      },
    },
  };
}
