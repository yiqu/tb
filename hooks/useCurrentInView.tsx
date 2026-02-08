import { useRef, useState, useEffect } from 'react';

type UseCurrentInViewOptions = {
  ids: string[];
  containerId?: string;
  threshold?: number;
};

export default function useCurrentInView({ ids, containerId, threshold = 0 }: UseCurrentInViewOptions) {
  const [inViewIds, setInViewIds] = useState<string[]>([]);
  const inViewRef = useRef(new Set<string>());

  useEffect(() => {
    const root = containerId ? document.getElementById(containerId) : null;

    const currentInView = inViewRef.current;

    const getScrollEdge = () => {
      const { scrollTop, scrollHeight, clientHeight } = root ?? document.documentElement;
      if (scrollTop <= 0) return 'top';
      if (scrollTop + clientHeight >= scrollHeight - 1) return 'bottom';
      return null;
    };

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
        for (const { target: { id }, isIntersecting } of entries) {
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

    const handleScroll = () => updateInView();
    (root ?? window).addEventListener('scroll', handleScroll, { passive: true });

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      (root ?? window).removeEventListener('scroll', handleScroll);
      currentInView.clear();
    };
  }, [ids, containerId, threshold]);

  return inViewIds;
}