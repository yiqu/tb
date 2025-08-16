/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import * as React from 'react';
import { CircleIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={ cn(`grid gap-3`, className) } { ...props } />;
}

/**
 * Updated RadioGroupItem component to use the new circleIconClassName prop
 * Date updated: 05/09/2025
 *
 *
 * @param param0
 * @returns
 */
function RadioGroupItem({
  className,
  circleIconClassName,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { circleIconClassName?: string }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={ cn(
        `aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40`,
        className,
      ) }
      { ...props }
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center">
        <CircleIcon
          className={ cn(`absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary`, circleIconClassName) }
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
