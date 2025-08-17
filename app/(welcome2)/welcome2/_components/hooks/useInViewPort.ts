import { useInView } from 'react-intersection-observer';

interface UseInViewPortOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useInViewPort(options?: UseInViewPortOptions) {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options || {};

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  return { ref, inView };
}
