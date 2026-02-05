'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

import { SelectScrollUpButton, SelectScrollDownButton } from '../select';

/**
 * This adds a single class to each SelectContent that targets the checkmark SVG inside any focused/hovered select item and forces it to use accent-foreground 
 * (which matches the text color on hover), overriding the default muted-foreground.
 * 
 * This is a workaround to fix the issue where the checkmark is not visible on hover.
 * @param className - The class name to add to the SelectContent.
 * @param children - The children to render inside the SelectContent.
 * @param position - The position of the SelectContent.
 * @param align - The alignment of the SelectContent.
 * @param props - The props to pass to the SelectContent.
 * @returns The SelectContent component.
 */
function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={ cn(
          `
            relative z-200 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin)
            overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md
            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
            data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
            [&_[data-slot=select-item]:focus_svg]:text-accent-foreground!
          `,
          position === 'popper' &&
            `
              data-[side=bottom]:translate-y-1
              data-[side=left]:-translate-x-1
              data-[side=right]:translate-x-1
              data-[side=top]:-translate-y-1
            `,
          className,
        ) }
        position={ position }
        align={ align }
        { ...props }
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={ cn(
            'p-1',
            position === 'popper' && 'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1',
          ) }
        >
          { children }
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export { SelectContent };
