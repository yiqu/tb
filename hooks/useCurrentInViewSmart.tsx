import { useRef, useState, useEffect, useCallback } from 'react';

type UseCurrentInViewOptions = {
  /** Element IDs to observe for viewport intersection. */
  ids: string[];
  /** Optional ID of a scrollable container element. Defaults to the window/document viewport. */
  containerId?: string;
  /** IntersectionObserver threshold (0-1). Defaults to 0 (any pixel visible). */
  threshold?: number;
};

type UseCurrentInViewSmartReturn = {
  /** The single active element ID, or `null` if none are visible. */
  activeId: string | null;
  /** Temporarily force-select an ID (e.g. on nav click). Auto-clears on next user scroll. */
  forceSelect: (_id: string) => void;
};

/**
 * Tracks which element (by ID) is the "active" one within a scrollable container or viewport.
 * Returns a single ID — the best match — unlike {@link useCurrentInView} which returns all visible IDs.
 *
 * Disambiguation logic when multiple elements are visible:
 * - Scrolled to the very top → first ID.
 * - Scrolled to the very bottom → last ID.
 * - Otherwise → the element whose vertical center is closest to the viewport/container center.
 *
 * Supports lazily-mounted containers (e.g. dialogs/portals) by deferring setup
 * until the container element appears in the DOM.
 *
 * The returned `forceSelect` function temporarily overrides the active ID (e.g. on nav click).
 * It auto-clears on the next user scroll so observer-based logic resumes.
 *
 * @example
 * ```tsx
 * const { activeId, forceSelect } = useCurrentInViewSmart({
 *   ids: ['section-1', 'section-2', 'section-3'],
 *   containerId: 'my-scrollable-dialog', // optional, for portaled containers
 * });
 * // activeId: 'section-2' — the single best match
 * // forceSelect('section-3') — temporarily locks to section-3
 * ```
 *
 * @see {@link useCurrentInView} for returning all visible IDs.
 */
export default function useCurrentInViewSmart({ ids, containerId, threshold = 0 }: UseCurrentInViewOptions): UseCurrentInViewSmartReturn {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [forceId, setForceId] = useState<string | null>(null);
  const inViewRef = useRef(new Set<string>());
  const forceLockedRef = useRef(false);
  const forceIdRef = useRef<string | null>(null);
  const forceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep ref in sync with state so the scroll handler (inside useEffect closure) can read it.
  forceIdRef.current = forceId;

  const forceSelect = useCallback((id: string) => {
    setForceId(id);
    forceLockedRef.current = true;

    if (forceTimeoutRef.current) clearTimeout(forceTimeoutRef.current);

    // Short delay so the programmatic scroll from scrollIntoView doesn't immediately clear.
    forceTimeoutRef.current = setTimeout(() => {
      forceLockedRef.current = false;
    }, 100);
  }, []);

  // Cleanup force timeout on unmount.
  useEffect(() => {
    return () => {
      if (forceTimeoutRef.current) clearTimeout(forceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const currentInView = inViewRef.current;
    let observer: IntersectionObserver | null = null;
    let handleScroll: (() => void) | null = null;
    let scrollTarget: Element | Window | null = null;
    let mutationObserver: MutationObserver | null = null;
    let rafId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const setup = (root: Element | null) => {
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

      // Select the single best ID from all currently visible elements.
      const pickBestId = (): string | null => {
        // At scroll edges, force-select the first/last ID to avoid gaps
        // where no element crosses the intersection threshold.
        const edge = getScrollEdge();
        if (edge === 'top' && ids.length > 0) {
          return ids[0];
        }
        if (edge === 'bottom' && ids.length > 0) {
          return ids[ids.length - 1];
        }

        const visibleIds = ids.filter((id) => currentInView.has(id));

        if (visibleIds.length === 0) {
          return null;
        }
        if (visibleIds.length === 1) {
          return visibleIds[0];
        }

        // When multiple elements are visible, pick the one whose vertical center
        // is closest to the viewport/container center.
        const viewportHeight = root ? root.clientHeight : window.innerHeight;
        const viewportTop = root ? root.getBoundingClientRect().top : 0;
        const center = viewportTop + viewportHeight / 2;

        let bestId = visibleIds[0];
        let bestDistance = Infinity;

        for (const id of visibleIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elCenter - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestId = id;
          }
        }

        return bestId;
      };

      const update = () => {
        // Clear force selection on user scroll (after the lock window expires).
        if (forceIdRef.current && !forceLockedRef.current) {
          setForceId(null);
        }
        setActiveId(pickBestId());
      };

      observer = new IntersectionObserver(
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
          update();
        },
        { root, threshold },
      );

      // Scroll listener supplements the IntersectionObserver for edge detection.
      handleScroll = update;
      scrollTarget = root ?? window;
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
        }
      }
    };

    // When a containerId is provided (e.g. for a dialog/portal), the container
    // may not exist in the DOM yet. Defer setup with a short delay, then fall
    // back to a MutationObserver to catch it when it mounts.
    if (containerId) {
      const trySetup = () => {
        const root = document.getElementById(containerId);
        if (root) {
          mutationObserver?.disconnect();
          mutationObserver = null;
          setup(root);
          return true;
        }
        return false;
      };

      timeoutId = setTimeout(() => {
        if (trySetup()) {
          return;
        }
        // Container still not found — watch for it to appear in the DOM.
        mutationObserver = new MutationObserver(() => {
          if (trySetup()) {
            return;
          }
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      }, 50);
    } else {
      setup(null);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      mutationObserver?.disconnect();
      observer?.disconnect();
      if (handleScroll && scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
      }
      currentInView.clear();
    };
  }, [ids, containerId, threshold]);

  return { activeId: forceId ?? activeId, forceSelect };
}
