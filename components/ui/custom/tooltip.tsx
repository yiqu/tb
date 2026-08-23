'use client';

import { cn } from '@/lib/utils';
import { Z_INDEX_LAYER } from '@/constants/z-index.constants';
import { TooltipContent as TooltipContentBase } from '@/components/ui/tooltip';

/**
 * Tooltip content is portalled to `<body>`, so at the stock z-50 it paints below the dialog backdrop
 * and a tooltip shown from inside a dialog is hidden. This wrapper lifts it onto the floating layer.
 *
 * The token comes first so a caller's own z-* class still wins, and tailwind-merge drops the base z-50.
 *
 * @param className - The class name to add to the TooltipContent.
 * @param props - The props to pass to the TooltipContent.
 * @returns The TooltipContent component on the floating layer.
 */
function TooltipContent({ className, ...props }: React.ComponentProps<typeof TooltipContentBase>) {
  return <TooltipContentBase className={ cn(Z_INDEX_LAYER.floating, className) } { ...props } />;
}

export { TooltipContent };
export { Tooltip, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
