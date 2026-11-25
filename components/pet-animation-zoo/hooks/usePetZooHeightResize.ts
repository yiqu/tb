'use client';

import { useRef, useState, KeyboardEvent, PointerEvent } from 'react';

import { clampPetZooHeight } from '../utils/pet-zoo-height.utils';
import { writePetZooHeightCookie } from '../utils/pet-zoo-height-cookie.utils';
import { PET_ZOO_DEFAULT_HEIGHT_PX, PET_ZOO_HEIGHT_KEYBOARD_STEP_PX } from '../constants/pet-zoo.constants';

interface DragStart {
  /** The pointer that started the drag. Only it moves and ends the drag, another finger or a pen is ignored. */
  pointerId: number;
  pointerY: number;
  height: number;
}

export interface PetZooHeightResize {
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
 * Drag the top edge of the zoo to make it taller or shorter, between the min and the max height.
 * The new height is saved to a cookie when the drag ends. Double-click resets it, arrow keys nudge it.
 */
export function usePetZooHeightResize(initialHeight: number): PetZooHeightResize {
  const [height, setHeight] = useState<number>(() => {
    return clampPetZooHeight(initialHeight);
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const dragStartRef = useRef<DragStart | null>(null);
  const latestHeightRef = useRef<number>(height);

  const applyHeight = (nextHeight: number) => {
    const clamped: number = clampPetZooHeight(nextHeight);
    latestHeightRef.current = clamped;
    setHeight(clamped);
    return clamped;
  };

  const commitHeight = (nextHeight: number) => {
    writePetZooHeightCookie(applyHeight(nextHeight));
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
    writePetZooHeightCookie(latestHeightRef.current);
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
        // the handle is on the top edge: dragging up makes the zoo taller
        applyHeight(dragStart.height + (dragStart.pointerY - event.clientY));
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick: () => {
        commitHeight(PET_ZOO_DEFAULT_HEIGHT_PX);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          commitHeight(latestHeightRef.current + PET_ZOO_HEIGHT_KEYBOARD_STEP_PX);
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          commitHeight(latestHeightRef.current - PET_ZOO_HEIGHT_KEYBOARD_STEP_PX);
        }
      },
    },
  };
}
