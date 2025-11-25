import { ComponentProps } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import Typography from '@/components/typography/Typography';
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
        <Typography variant="body0">{ tooltip }</Typography>
      </TooltipContent>
    </Tooltip>
  );
}
