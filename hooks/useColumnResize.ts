'use client';

import { useRef, useState, useCallback } from 'react';

interface UseColumnResizeOptions {
  columnId: string;
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange: (_columnId: string, _width: number) => void;
}

export default function useColumnResize({ columnId, initialWidth, minWidth = 100, maxWidth = 400, onWidthChange }: UseColumnResizeOptions) {
  const [localWidth, setLocalWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const dragState = useRef({ startX: 0, startWidth: 0 });

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const delta = e.clientX - dragState.current.startX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, dragState.current.startWidth + delta));
      setLocalWidth(newWidth);
    },
    [minWidth, maxWidth],
  );

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
    currentWidth: localWidth ?? initialWidth,
    isResizing,
    handleResizePointerDown,
  };
}
