'use client';

import { XIcon, ChevronDownIcon, ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import { SortConfig, SortOptions } from '@/store/sorter/table-sort';

interface MultiSortTriggerChipsProps {
  sort: SortConfig[];
  displayMap: Record<SortOptions, string>;
  defaultOption: SortOptions;
  open: boolean;
  onToggleOpen: () => void;
  onRemove: (option: SortOptions) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSortTriggerChips({
  sort,
  displayMap,
  defaultOption,
  open,
  onToggleOpen,
  onRemove,
  placeholder = 'Sort by...',
  className,
}: MultiSortTriggerChipsProps) {
  return (
    <div
      role="combobox"
      aria-expanded={ open }
      aria-haspopup="listbox"
      tabIndex={ 0 }
      onClick={ onToggleOpen }
      onKeyDown={ (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleOpen();
        }
      } }
      className={ cn(
        `
          flex min-h-9 w-full cursor-pointer flex-nowrap items-center gap-1.5 overflow-hidden rounded-md border border-input
          bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow]
          focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
          dark:bg-input/30
        `,
        className,
      ) }
    >
      { sort.length === 0 ?
        <Typography variant="subtitle1" as="span" className="truncate">
          { placeholder }
        </Typography>
      : <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden">
          { sort.map((config) => (
            <span
              key={ config.field }
              data-slot="multi-sort-chip"
              className="flex h-[calc(--spacing(5.5))] min-w-0 shrink items-center gap-1 rounded-sm bg-muted px-1.5"
            >
              <Typography variant="caption0" as="span" className="truncate text-foreground">
                { displayMap[config.field] }
              </Typography>
              { config.direction === 'desc' ?
                <ArrowDownNarrowWide className="size-3 shrink-0 text-muted-foreground" />
              : <ArrowUpNarrowWide className="size-3 shrink-0 text-muted-foreground" /> }
              { config.field === defaultOption ? null : (
                <button
                  type="button"
                  aria-label={ `Remove ${displayMap[config.field]} sort` }
                  className="
                    shrink-0 rounded-xs opacity-50
                    hover:opacity-100
                  "
                  onClick={ (event) => {
                    event.stopPropagation();
                    onRemove(config.field);
                  } }
                >
                  <XIcon className="size-3" />
                </button>
              ) }
            </span>
          )) }
        </div>
      }
      <ChevronDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
