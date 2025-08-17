'use client';

import type { ReactNode } from 'react';

import { useInViewPort } from './hooks/useInViewPort';

interface InViewPortWrapperProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  fallback?: ReactNode;
}

export function InViewPortWrapper({
  children,
  className,
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '0px',
  fallback = null,
}: InViewPortWrapperProps) {
  const { ref, inView } = useInViewPort({
    threshold,
    triggerOnce,
    rootMargin,
  });

  return (
    <div ref={ ref } className={ className }>
      { inView ? children : fallback }
    </div>
  );
}
