'use client';

import { useRef, useState, useCallback } from 'react';

interface UseColumnResizeOptions {
  /** Identifier for the column being resized, forwarded to onWidthChange. */
  columnId: string;
  /** The column's current persisted width (px). Used as the baseline for each drag. */
  initialWidth: number;
  /** Minimum allowed width in px. @default 100 */
  minWidth?: number;
  /** Maximum allowed width in px. @default 400 */
  maxWidth?: number;
  /** Called once on pointer-up with the final clamped width so the consumer can persist it. */
  onWidthChange: (_columnId: string, _width: number) => void;
}

/**
 * Manages pointer-based column resize for table headers.
 *
 * How it works:
 * 1. Attach `handleResizePointerDown` to a resize-handle element inside a column header.
 * 2. On pointer-down the hook records the starting cursor position and column width,
 *    then adds document-level `pointermove` / `pointerup` listeners so the drag works
 *    even if the pointer leaves the handle.
 * 3. During the drag, `localWidth` is updated on every move frame (clamped to min/max).
 *    The returned `currentWidth` reflects this live value so the column resizes in real-time.
 * 4. On pointer-up the final width is committed via `onWidthChange`, local state is cleared,
 *    listeners are removed, and a one-shot capture-phase click handler swallows the
 *    subsequent click event to prevent it from triggering column sort.
 *
 * @returns
 * - `currentWidth`  – the width to apply to the column (live during drag, `initialWidth` otherwise).
 * - `isResizing`    – `true` while a drag is in progress; useful for styling.
 * - `handleResizePointerDown` – attach to the resize handle's `onPointerDown`.
 */
export default function useColumnResize({ columnId, initialWidth, minWidth = 100, maxWidth = 400, onWidthChange }: UseColumnResizeOptions) {
  // Tracks the live width during a drag; null when idle so we fall back to initialWidth.
  const [localWidth, setLocalWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  // Ref instead of state so move/up handlers always read the latest values without re-renders.
  const dragState = useRef({ startX: 0, startWidth: 0 });

  /** Document-level pointermove: updates the live column width as the user drags. */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const delta = e.clientX - dragState.current.startX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, dragState.current.startWidth + delta));
      setLocalWidth(newWidth);
    },
    [minWidth, maxWidth],
  );

  /** Document-level pointerup: commits the final width and tears down the drag. */
  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      const delta = e.clientX - dragState.current.startX;
      const finalWidth = Math.min(maxWidth, Math.max(minWidth, dragState.current.startWidth + delta));

      onWidthChange(columnId, finalWidth);

      setLocalWidth(null);
      setIsResizing(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Swallow the click event that fires after pointerup to prevent sort triggering
      document.addEventListener(
        'click',
        (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
        },
        { capture: true, once: true },
      );
    },
    [columnId, minWidth, maxWidth, onWidthChange, handlePointerMove],
  );

  /** Attach to the resize handle's onPointerDown to initiate a column resize drag. */
  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();

      dragState.current.startX = e.clientX;
      dragState.current.startWidth = initialWidth;
      setIsResizing(true);

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [initialWidth, handlePointerMove, handlePointerUp],
  );

  return {
    /** The width (px) to apply to the column — live during drag, `initialWidth` otherwise. */
    currentWidth: localWidth ?? initialWidth,
    /** Whether a resize drag is currently in progress. */
    isResizing,
    /** Pointer-down handler to attach to the resize handle element. */
    handleResizePointerDown,
  };
}
