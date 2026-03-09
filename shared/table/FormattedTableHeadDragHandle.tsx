import { GripVertical } from 'lucide-react';

import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import WithTooltip from '../components/WithTooltip';

type FormattedTableHeadDragHandleProps = {
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export default function FormattedTableHeadDragHandle({ dragHandleProps }: FormattedTableHeadDragHandleProps) {
  if (dragHandleProps === null) {
    return null;
  }

  return (
    <WithTooltip tooltip="Drag to reorder">
      <div { ...dragHandleProps } className={ `
        flex cursor-grab items-center
        active:cursor-grabbing
      ` }>
        <GripVertical className="
          size-4 min-w-4 text-muted-foreground/50
          hover:text-chart-2
        " />
      </div>
    </WithTooltip>
  );
}
