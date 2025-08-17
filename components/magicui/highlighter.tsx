'use client';

import { useRef, useEffect } from 'react';
import { annotate } from 'rough-notation';

import type React from 'react';

// Define available annotation actions
type AnnotationAction = 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

// Custom TypeScript interface for supported props
interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  delay?: number;
}

export function Highlighter({
  children,
  action = 'highlight',
  color = '#ffd1dc', // Default pink color
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  delay = 0,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });

      // Apply delay before showing annotation
      const timeoutId = setTimeout(() => {
        annotation.show();
      }, delay);

      // Store the current element in closure for cleanup
      return () => {
        clearTimeout(timeoutId);
        if (element) {
          annotate(element, { type: action }).remove();
        }
      };
    }
  }, [action, color, strokeWidth, animationDuration, iterations, padding, multiline, delay]);

  return (
    <span ref={ elementRef } className="relative inline-block bg-transparent">
      { children }
    </span>
  );
}
