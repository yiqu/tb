'use client';

import { cn } from '@/lib/utils';
import { AppColumnId } from '@/store/subscriptions/table.store';
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/custom/dropdown-menu';
import { getIsColumnFilterable } from '@/shared/table-filter-by/table-filter-by.utils';

import TableFilterBySubMenu from './TableFilterBySubMenu';

export interface TableFilterByMenuSectionProps {
  /** The column whose header this menu belongs to. */
  columnId: AppColumnId;
  /** Section heading. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Draw a separator above the section. @default true */
  showSeparator?: boolean;
  /** Class for the group wrapper. */
  className?: string;
  /** Class for the section heading. */
  labelClassName?: string;
  /** Class for the submenu panel — where to change its width or padding. */
  subMenuContentClassName?: string;
}

/**
 * The "Filter" section of a column's three dot menu.
 *
 * Renders nothing for a column that is not in `TABLE_FILTER_BY_COLUMNS`, so a host menu can drop
 * this in unconditionally instead of carrying its own "is this column filterable" flag.
 *
 * Drop it into an existing `<DropdownMenuContent>` that already has other options.
 */
export default function TableFilterByMenuSection({
  columnId,
  label,
  showSeparator = true,
  className,
  labelClassName,
  subMenuContentClassName,
}: TableFilterByMenuSectionProps) {
  if (!getIsColumnFilterable(columnId)) {
    return null;
  }

  return (
    <>
      { showSeparator ? <DropdownMenuSeparator /> : null }
      <DropdownMenuGroup className={ className }>
        { label === null ? null : (
          <DropdownMenuLabel className={ cn('text-foreground/50', labelClassName) }>{ label ?? 'Filter' }</DropdownMenuLabel>
        ) }
        <TableFilterBySubMenu columnId={ columnId } contentClassName={ subMenuContentClassName } />
      </DropdownMenuGroup>
    </>
  );
}
