import { useRef, useState, useEffect } from 'react';

type UseCurrentInViewOptions = {
  /** Element IDs to observe for viewport intersection. */
  ids: string[];
  /** Optional ID of a scrollable container element. Defaults to the window/document viewport. */
  containerId?: string;
  /** IntersectionObserver threshold (0-1). Defaults to 0 (any pixel visible). */
  threshold?: number;
};

/**
 * Tracks which elements (by ID) are currently visible within a scrollable container or the viewport.
 * Returns ALL visible IDs at once.
 *
 * Uses IntersectionObserver for visibility detection and a scroll listener for edge cases:
 * - When scrolled to the very top, returns only the first ID.
 * - When scrolled to the very bottom, returns only the last ID.
 *
 * @example
 * ```tsx
 * const visibleIds = useCurrentInView({ ids: ['section-1', 'section-2', 'section-3'] });
 * // visibleIds: ['section-1', 'section-2'] — all currently visible
 * ```
 *
 * @see {@link useCurrentInViewSmart} for single-ID selection with disambiguation logic.
 */
export default function useCurrentInView({ ids, containerId, threshold = 0 }: UseCurrentInViewOptions) {
  const [inViewIds, setInViewIds] = useState<string[]>([]);
  const inViewRef = useRef(new Set<string>());

  useEffect(() => {
    const root = containerId ? document.getElementById(containerId) : null;
    const currentInView = inViewRef.current;

    // Detect if the scroll position is at the very top or bottom edge.
    const getScrollEdge = () => {
      const { scrollTop, scrollHeight, clientHeight } = root ?? document.documentElement;
      if (scrollTop <= 0) {
        return 'top';
      }
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        return 'bottom';
      }
      return null;
    };

    // At scroll edges, force-select the first/last ID to avoid gaps
    // where no element crosses the intersection threshold.
    const updateInView = () => {
      const edge = getScrollEdge();
      if (edge === 'top' && ids.length > 0) {
        setInViewIds([ids[0]]);
        return;
      }
      if (edge === 'bottom' && ids.length > 0) {
        setInViewIds([ids[ids.length - 1]]);
        return;
      }
      setInViewIds(ids.filter((id) => currentInView.has(id)));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const {
          target: { id },
          isIntersecting,
        } of entries) {
          if (isIntersecting) {
            currentInView.add(id);
          } else {
            currentInView.delete(id);
          }
        }
        updateInView();
      },
      { root, threshold },
    );

    // Scroll listener supplements the IntersectionObserver for edge detection.
    const handleScroll = () => updateInView();
    (root ?? window).addEventListener('scroll', handleScroll, { passive: true });

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => {
      observer.disconnect();
      (root ?? window).removeEventListener('scroll', handleScroll);
      currentInView.clear();
    };
  }, [ids, containerId, threshold]);

  return inViewIds;
}
