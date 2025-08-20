import { ReactNode } from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import { TableCellHoverFilterAddButton } from './TableCellHoverFilterAddButton';

interface HoverFilterDialogProps {
  payload: string;
  columnId: string;
  children: ReactNode;
}

export function TableCellHoverWrapper({ payload, columnId, children }: HoverFilterDialogProps) {
  return (
    <HoverCard openDelay={ 100 } closeDelay={ 50 }>
      <HoverCardTrigger asChild>{ children }</HoverCardTrigger>
      <HoverCardContent className="flex h-3 w-20 flex-col items-center justify-center" side="top" align="start">
        <TableCellHoverFilterAddButton payload={ payload } columnId={ columnId } />
      </HoverCardContent>
    </HoverCard>
  );
}
