/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { useRef, useState, useEffect } from 'react';

import type React from 'react';

// Custom hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px',
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
}

// Animated section component
interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
}

export function AnimatedWrapper({ children, direction = 'left', delay = 0 }: AnimatedSectionProps) {
  const [ref, isVisible] = useScrollAnimation();

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return '-translate-x-32 translate-y-16';
      case 'right':
        return 'translate-x-32 translate-y-16';
      case 'top':
        return 'translate-y-32';
      case 'bottom':
        return '-translate-y-32';
      default:
        return '-translate-x-32 translate-y-16';
    }
  };

  return (
    <div
      ref={ ref }
      className={ `
        transition-all duration-2000 ease-out
        ${
        isVisible ?
          'translate-x-0 translate-y-0 opacity-100'
        : `
          opacity-0
          ${getInitialTransform()}
        `
      }
      ` }
      style={ { transitionDelay: `${delay}ms` } }
    >
      { children }
    </div>
  );
}
