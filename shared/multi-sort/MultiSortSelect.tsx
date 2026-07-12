'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SortConfig,
  SortOptions,
  DEFAULT_SORT_OPTION,
  SORT_ORDER_OPTIONS,
  SortOptionDisplayMap,
  useCurrentSort,
  useTableSortActions,
} from '@/store/sorter/table-sort';

import MultiSortMenu from './MultiSortMenu';
import useClickOutside from './useClickOutside';
import MultiSortTriggerChips from './MultiSortTriggerChips';

interface MultiSortSelectProps {
  /**
   * If true (default), the zustand store is only updated once the dropdown menu closes.
   * If false, the store is updated on every check/uncheck/drag/direction change.
   */
  fireChangeOnClose?: boolean;
  /** Max width of the closed combobox display. Longer content truncates with ellipses. */
  maxWidth?: string;
  /** Label displayed at the top of the opened dropdown menu. */
  menuLabel?: string;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  options?: SortOptions[];
  displayMap?: Record<SortOptions, string>;
  defaultOption?: SortOptions;
}

export default function MultiSortSelect({
  fireChangeOnClose = true,
  maxWidth = '24rem',
  menuLabel,
  placeholder,
  className,
  menuClassName,
  options = SORT_ORDER_OPTIONS,
  displayMap = SortOptionDisplayMap,
  defaultOption = DEFAULT_SORT_OPTION,
}: MultiSortSelectProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [draftSort, setDraftSort] = useState<SortConfig[]>([]);

  const currentSort: SortConfig[] = useCurrentSort();
  const { setCurrentSort } = useTableSortActions();

  // The store is persisted in localstorage, so wait for the client to avoid hydration mismatches.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    if (fireChangeOnClose) {
      setCurrentSort(draftSort);
    }
  }, [fireChangeOnClose, draftSort, setCurrentSort]);

  useClickOutside(wrapperRef, closeMenu, open);

  function handleToggleOpen() {
    if (open) {
      closeMenu();
    } else {
      setDraftSort(currentSort);
      setOpen(true);
    }
  }

  function handleSortChange(next: SortConfig[]) {
    setDraftSort(next);
    if (!fireChangeOnClose) {
      setCurrentSort(next);
    }
  }

  function handleRemove(option: SortOptions) {
    if (option === defaultOption) {
      return;
    }
    if (open) {
      handleSortChange(draftSort.filter((config) => config.field !== option));
    } else {
      setCurrentSort(currentSort.filter((config) => config.field !== option));
    }
  }

  if (!isMounted) {
    return <Skeleton className={ cn('h-9 w-full', className) } style={ { maxWidth } } />;
  }

  const displayedSort: SortConfig[] = open ? draftSort : currentSort;

  return (
    <div ref={ wrapperRef } className={ cn('relative w-full', className) } style={ { maxWidth } }>
      <MultiSortTriggerChips
        sort={ displayedSort }
        displayMap={ displayMap }
        defaultOption={ defaultOption }
        open={ open }
        onToggleOpen={ handleToggleOpen }
        onRemove={ handleRemove }
        placeholder={ placeholder }
      />
      { open ?
        <MultiSortMenu
          sort={ draftSort }
          options={ options }
          displayMap={ displayMap }
          defaultOption={ defaultOption }
          onSortChange={ handleSortChange }
          label={ menuLabel }
          className={ menuClassName }
        />
      : null }
    </div>
  );
}
