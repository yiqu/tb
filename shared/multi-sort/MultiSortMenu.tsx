'use client';

import { ListX } from 'lucide-react';
import { Draggable, Droppable, DragDropContext, type DropResult } from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { SortConfig, SortOptions } from '@/store/sorter/table-sort';

import MultiSortMenuItem from './MultiSortMenuItem';
import { reorderList, getUncheckedOptions } from './multi-sort.utils';

const DROPPABLE_ID = 'multi-sort-checked-options';

interface MultiSortMenuProps {
  sort: SortConfig[];
  options: SortOptions[];
  displayMap: Record<SortOptions, string>;
  defaultOption: SortOptions;
  onSortChange: (sort: SortConfig[]) => void;
  label?: string;
  className?: string;
}

export default function MultiSortMenu({
  sort,
  options,
  displayMap,
  defaultOption,
  onSortChange,
  label = 'Sort order. Columns are sorted top to bottom.',
  className,
}: MultiSortMenuProps) {
  const uncheckedOptions: SortOptions[] = getUncheckedOptions(sort, options);
  const hasExtraChecked: boolean = sort.length > 1;

  function handleCheckedChange(option: SortOptions, checked: boolean) {
    if (option === defaultOption && !checked) {
      return;
    }

    if (checked) {
      onSortChange([...sort, { field: option, direction: 'asc' }]);
    } else {
      onSortChange(sort.filter((config) => config.field !== option));
    }
  }

  function handleDirectionToggle(option: SortOptions) {
    onSortChange(
      sort.map((config) => {
        if (config.field !== option) {
          return config;
        }
        return { ...config, direction: config.direction === 'desc' ? 'asc' : 'desc' };
      }),
    );
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }
    onSortChange(reorderList(sort, result.source.index, result.destination.index));
  }

  function handleClearAllButDefault() {
    const defaultConfig: SortConfig | undefined = sort.find((config) => config.field === defaultOption);
    onSortChange([defaultConfig ?? { field: defaultOption, direction: 'asc' }]);
  }

  return (
    <div
      className={ cn(
        'absolute top-full left-0 z-50 mt-1 w-full min-w-60 rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      ) }
    >
      <Typography variant="caption0" as="div" className="px-2 py-1.5">
        { label }
      </Typography>
      <Separator className="mb-1" />
      <DragDropContext onDragEnd={ handleDragEnd }>
        <Droppable droppableId={ DROPPABLE_ID }>
          { (droppableProvided) => (
            <div ref={ droppableProvided.innerRef } { ...droppableProvided.droppableProps }>
              { sort.map((config, index) => (
                <Draggable key={ config.field } draggableId={ config.field } index={ index }>
                  { (draggableProvided, snapshot) => (
                    <MultiSortMenuItem
                      option={ config.field }
                      displayName={ displayMap[config.field] }
                      checked={ true }
                      isDefaultOption={ config.field === defaultOption }
                      direction={ config.direction }
                      onCheckedChange={ handleCheckedChange }
                      onDirectionToggle={ handleDirectionToggle }
                      isDragging={ snapshot.isDragging }
                      innerRef={ draggableProvided.innerRef }
                      draggableProps={ draggableProvided.draggableProps }
                      dragHandleProps={ draggableProvided.dragHandleProps }
                    />
                  ) }
                </Draggable>
              )) }
              { droppableProvided.placeholder }
            </div>
          ) }
        </Droppable>
      </DragDropContext>
      { uncheckedOptions.map((option) => (
        <MultiSortMenuItem
          key={ option }
          option={ option }
          displayName={ displayMap[option] }
          checked={ false }
          isDefaultOption={ option === defaultOption }
          onCheckedChange={ handleCheckedChange }
        />
      )) }
      { hasExtraChecked ?
        <>
          <Separator className="my-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 px-2 text-muted-foreground"
            onClick={ handleClearAllButDefault }
          >
            <ListX className="size-4" />
            <Typography variant="body0" as="span">
              Clear all but default
            </Typography>
          </Button>
        </>
      : null }
    </div>
  );
}
