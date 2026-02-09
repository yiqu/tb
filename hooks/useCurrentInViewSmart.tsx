import { useRef, useState, useEffect } from 'react';

type UseCurrentInViewOptions = {
  ids: string[];
  containerId?: string;
  threshold?: number;
};

export default function useCurrentInViewSmart({ ids, containerId, threshold = 0 }: UseCurrentInViewOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const inViewRef = useRef(new Set<string>());

  useEffect(() => {
    const currentInView = inViewRef.current;
    let observer: IntersectionObserver | null = null;
    let handleScroll: (() => void) | null = null;
    let scrollTarget: Element | Window | null = null;
    let mutationObserver: MutationObserver | null = null;
    let rafId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const setup = (root: Element | null) => {
      const getScrollEdge = () => {
        const { scrollTop, scrollHeight, clientHeight } = root ?? document.documentElement;
        if (scrollTop <= 0) return 'top';
        if (scrollTop + clientHeight >= scrollHeight - 1) return 'bottom';
        return null;
      };

      const pickBestId = (): string | null => {
        const edge = getScrollEdge();
        if (edge === 'top' && ids.length > 0) return ids[0];
        if (edge === 'bottom' && ids.length > 0) return ids[ids.length - 1];

        const visibleIds = ids.filter((id) => currentInView.has(id));
        if (visibleIds.length === 0) return null;
        if (visibleIds.length === 1) return visibleIds[0];

        // Pick the element whose top is closest to the viewport center
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

      const update = () => setActiveId(pickBestId());

      observer = new IntersectionObserver(
        (entries) => {
          for (const { target: { id }, isIntersecting } of entries) {
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

      handleScroll = update;
      scrollTarget = root ?? window;
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    // If containerId is provided, wait for the element to appear in the DOM
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

      // Delay to let the portal and its children fully mount
      timeoutId = setTimeout(() => {
        if (trySetup()) return;
        // If still not found, watch for it
        mutationObserver = new MutationObserver(() => {
          if (trySetup()) return;
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

  return activeId;
}