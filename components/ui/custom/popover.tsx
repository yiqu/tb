'use client';

import { cn } from '@/lib/utils';
import { Z_INDEX_LAYER } from '@/constants/z-index.constants';
import { PopoverContent as PopoverContentBase } from '@/components/ui/popover';

/**
 * The shadcn PopoverContent renders through a Radix Portal, which lands it under `<body>` as a
 * sibling of any open dialog rather than inside it. At the stock z-50 it paints below the dialog
 * backdrop, so a popover opened from inside a dialog is dimmed and unclickable.
 *
 * This wrapper lifts it onto the floating layer. The token comes first so a caller's own z-* class
 * still wins, and tailwind-merge drops the base z-50.
 *
 * @param className - The class name to add to the PopoverContent.
 * @param props - The props to pass to the PopoverContent.
 * @returns The PopoverContent component on the floating layer.
 */
function PopoverContent({ className, ...props }: React.ComponentProps<typeof PopoverContentBase>) {
  return <PopoverContentBase className={ cn(Z_INDEX_LAYER.floating, className) } { ...props } />;
}

export { PopoverContent };
export {
  Popover,
  PopoverTitle,
  PopoverAnchor,
  PopoverHeader,
  PopoverPortal,
  PopoverTrigger,
  PopoverDescription,
} from '@/components/ui/popover';
