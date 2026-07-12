'use client';

import { RefObject, useEffect } from 'react';

/**
 * Calls `handler` when a pointer down event happens outside of the given element.
 * Only active while `enabled` is true.
 */
export default function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const element = ref.current;
      if (!element) {
        return;
      }
      if (event.target instanceof Node && !element.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [ref, handler, enabled]);
}
