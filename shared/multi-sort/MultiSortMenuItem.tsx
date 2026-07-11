'use client';

import { GripVertical, ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
import type { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Typography from '@/components/typography/Typography';
import { SortOptions } from '@/store/sorter/table-sort';
import { SortDirection } from '@/shared/table/table.utils';

interface MultiSortMenuItemProps {
  option: SortOptions;
  displayName: string;
  checked: boolean;
  /** The default sort option cannot be unchecked. */
  isDefaultOption: boolean;
  direction?: SortDirection;
  onCheckedChange: (option: SortOptions, checked: boolean) => void;
  onDirectionToggle?: (option: SortOptions) => void;
  isDragging?: boolean;
  innerRef?: (element: HTMLElement | null) => void;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  className?: string;
}

export default function MultiSortMenuItem({
  option,
  displayName,
  checked,
  isDefaultOption,
  direction,
  onCheckedChange,
  onDirectionToggle,
  isDragging,
  innerRef,
  draggableProps,
  dragHandleProps,
  className,
}: MultiSortMenuItemProps) {
  return (
    <div
      ref={ innerRef }
      { ...draggableProps }
      className={ cn(
        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5',
        isDragging ? 'bg-accent shadow-sm' : 'bg-popover',
        className,
      ) }
    >
      <Checkbox
        checked={ checked }
        disabled={ isDefaultOption }
        onCheckedChange={ (checkedState) => onCheckedChange(option, checkedState === true) }
        aria-label={ `Toggle sort by ${displayName}` }
      />
      <Typography variant="body1" as="span" className="pointer-events-none min-w-0 flex-1 truncate select-none">
        { displayName }
      </Typography>
      { checked ?
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-1.5 text-muted-foreground"
          onClick={ () => onDirectionToggle?.(option) }
          aria-label={ `Toggle sort direction for ${displayName}` }
        >
          { direction === 'desc' ?
            <ArrowDownNarrowWide className="size-3.5" />
          : <ArrowUpNarrowWide className="size-3.5" /> }
          <Typography variant="caption0" as="span">
            { direction === 'desc' ? 'desc' : 'asc' }
          </Typography>
        </Button>
      : null }
      { checked ?
        <span
          { ...dragHandleProps }
          className="
            flex cursor-grab items-center text-muted-foreground
            hover:text-foreground
            active:cursor-grabbing
          "
          aria-label={ `Drag to reorder ${displayName}` }
        >
          <GripVertical className="size-4" />
        </span>
      : null }
    </div>
  );
}
