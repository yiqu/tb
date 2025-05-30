/* eslint-disable readable-tailwind/multiline */
import React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  dotClassName?: string;
  postAnimationClassName?: string;
  postAnimationIcon?: React.ReactNode;
  postAnimationText?: string;
}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  (
    { children, className, dotClassName, postAnimationClassName, postAnimationIcon, postAnimationText, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ ref }
        className={ cn(
          'bg-background group relative w-auto cursor-pointer overflow-hidden rounded-full border p-1.5 px-6 text-center font-medium',
          className,
        ) }
        { ...props }
      >
        <div className="flex items-center gap-2">
          <div
            className={ cn(
              'bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]',
              dotClassName,
            ) }
          ></div>
          <span className="inline-block font-medium transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            { children }
          </span>
        </div>
        <div
          className={ cn(
            `text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100`,
            postAnimationClassName,
          ) }
        >
          <span>{ postAnimationText ?? children }</span>
          { postAnimationIcon ?? <ArrowRight /> }
        </div>
      </button>
    );
  },
);

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
