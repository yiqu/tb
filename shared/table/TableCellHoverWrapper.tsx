import { ReactNode } from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import { TableCellHoverFilterAddButton } from './TableCellHoverFilterAddButton';

interface HoverFilterDialogProps {
  payload: string;
  columnId: string;
  children: ReactNode;
  showHoverFilter?: boolean;
}

export function TableCellHoverWrapper({ payload, columnId, children, showHoverFilter }: HoverFilterDialogProps) {
  if (!showHoverFilter) {
    return children;
  }

  return (
    <HoverCard openDelay={ 150 } closeDelay={ 100 }>
      <HoverCardTrigger asChild>{ children }</HoverCardTrigger>
      <HoverCardContent
        className="flex h-3 w-20 flex-col items-start justify-center bg-background/50 backdrop-blur-lg"
        side="top"
        align="end"
      >
        <TableCellHoverFilterAddButton payload={ payload } columnId={ columnId } />
      </HoverCardContent>
    </HoverCard>
  );
}
