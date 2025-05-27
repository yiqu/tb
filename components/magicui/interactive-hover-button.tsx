import React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  dotClassName?: string;
  postAnimationClassName?: string;
  postAnimationIcon?: React.ReactNode;
}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ children, className, dotClassName, postAnimationClassName, postAnimationIcon, ...props }, ref) => {
    return (
      <button
        ref={ ref }
        className={ cn(
          'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-1.5 px-6 text-center font-medium',
          className,
        ) }
        { ...props }
      >
        <div className="flex items-center gap-2">
          <div
            className={ cn(
              'h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]',
              dotClassName,
            ) }
          ></div>
          <span className="inline-block font-medium transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            { children }
          </span>
        </div>
        <div
          className={ cn(
            `
              absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 font-medium text-primary-foreground opacity-0
              transition-all duration-300
              group-hover:-translate-x-5 group-hover:opacity-100
            `,
            postAnimationClassName,
          ) }
        >
          <span>{ children }</span>
          { postAnimationIcon ?? <ArrowRight /> }
        </div>
      </button>
    );
  },
);

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
