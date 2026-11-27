'use client';

import { useRef, useState, KeyboardEvent, PointerEvent } from 'react';

import { clampPixelPalsHeight } from '../utils/pixel-pals-height.utils';
import { writePixelPalsHeightCookie } from '../utils/pixel-pals-height-cookie.utils';
import { PIXEL_PALS_DEFAULT_HEIGHT_PX, PIXEL_PALS_HEIGHT_KEYBOARD_STEP_PX } from '../constants/pixel-pals.constants';

interface DragStart {
  /** The pointer that started the drag. Only it moves and ends the drag, another finger or a pen is ignored. */
  pointerId: number;
  pointerY: number;
  height: number;
}

export interface PixelPalsHeightResize {
  height: number;
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
 * Drag the top edge of Pixel Pals to make it taller or shorter, between the min and the max height.
 * The new height is saved to a cookie when the drag ends. Double-click resets it, arrow keys nudge it.
 */
export function usePixelPalsHeightResize(initialHeight: number): PixelPalsHeightResize {
  const [height, setHeight] = useState<number>(() => {
    return clampPixelPalsHeight(initialHeight);
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const dragStartRef = useRef<DragStart | null>(null);
  const latestHeightRef = useRef<number>(height);

  const applyHeight = (nextHeight: number) => {
    const clamped: number = clampPixelPalsHeight(nextHeight);
    latestHeightRef.current = clamped;
    setHeight(clamped);
    return clamped;
  };

  const commitHeight = (nextHeight: number) => {
    writePixelPalsHeightCookie(applyHeight(nextHeight));
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) {
      return;
    }
    dragStartRef.current = null;
    setIsResizing(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    writePixelPalsHeightCookie(latestHeightRef.current);
  };

  return {
    height,
    isResizing,
    handleProps: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        // a second pointer (another finger, or a pen beside the mouse) must not restart a drag that is running
        if (dragStartRef.current || event.button !== 0) {
          return;
        }
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStartRef.current = { pointerId: event.pointerId, pointerY: event.clientY, height: latestHeightRef.current };
        setIsResizing(true);
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const dragStart: DragStart | null = dragStartRef.current;
        if (!dragStart || event.pointerId !== dragStart.pointerId) {
          return;
        }
        // the handle is on the top edge: dragging up makes Pixel Pals taller
        applyHeight(dragStart.height + (dragStart.pointerY - event.clientY));
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick: () => {
        commitHeight(PIXEL_PALS_DEFAULT_HEIGHT_PX);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          commitHeight(latestHeightRef.current + PIXEL_PALS_HEIGHT_KEYBOARD_STEP_PX);
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          commitHeight(latestHeightRef.current - PIXEL_PALS_HEIGHT_KEYBOARD_STEP_PX);
        }
      },
    },
  };
}
