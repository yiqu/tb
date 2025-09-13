import { ComponentProps } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function WithTooltip({
  children,
  tooltip,
  contentProps,
  ...props
}: { children: React.ReactNode; tooltip?: string; contentProps?: ComponentProps<typeof TooltipContent> } & ComponentProps<
  typeof TooltipPrimitive.Root
>) {
  return (
    <Tooltip { ...props }>
      <TooltipTrigger asChild>{ children }</TooltipTrigger>
      <TooltipContent { ...contentProps }>
        <p>{ tooltip }</p>
      </TooltipContent>
    </Tooltip>
  );
}
