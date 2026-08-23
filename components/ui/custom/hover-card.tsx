'use client';

import { cn } from '@/lib/utils';
import { Z_INDEX_LAYER } from '@/constants/z-index.constants';
import { HoverCardContent as HoverCardContentBase } from '@/components/ui/hover-card';

/**
 * Hover card content is portalled to `<body>`, so at the stock z-50 it paints below the dialog
 * backdrop and a hover card opened from inside a dialog is hidden. This wrapper lifts it onto the
 * floating layer.
 *
 * The token comes first so a caller's own z-* class still wins, and tailwind-merge drops the base z-50.
 *
 * @param className - The class name to add to the HoverCardContent.
 * @param props - The props to pass to the HoverCardContent.
 * @returns The HoverCardContent component on the floating layer.
 */
function HoverCardContent({ className, ...props }: React.ComponentProps<typeof HoverCardContentBase>) {
  return <HoverCardContentBase className={ cn(Z_INDEX_LAYER.floating, className) } { ...props } />;
}

export { HoverCardContent };
export { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
