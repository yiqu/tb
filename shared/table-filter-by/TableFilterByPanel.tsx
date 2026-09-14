'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import useTableFilterByQuery from '@/hooks/table-filter-by/useTableFilterByQuery';
import { getTableFilterByColumnConfig } from '@/shared/table-filter-by/table-filter-by.utils';

import TableFilterByInput from './TableFilterByInput';
import TableFilterByClearButton from './TableFilterByClearButton';
import TableFilterByApplyButton from './TableFilterByApplyButton';

export interface TableFilterByPanelProps {
  /** The table the column is rendered in. Prefixes the search param key. */
  tableId: TableId;
  /** The column being filtered. */
  columnId: AppColumnId;
  /** Field label. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Apply button text. */
  applyText?: React.ReactNode;
  /** Clear button text. */
  clearText?: React.ReactNode;
  /** Called after the filter is applied, so the host menu can close itself. */
  onAction?: () => void;
  /** Focus the input as the panel opens, so you can type straight away. @default true */
  autoFocusInput?: boolean;
  className?: string;
}

/**
 * The body of the "Filter By" submenu: a label, the input, and Apply.
 *
 * Typing only moves a draft — Apply (or Enter in the input) is what writes the search param. The
 * button renders off `commitOnChange`, so turning that back on in `useTableFilterByQuery` removes
 * the button here without touching this file.
 */
export default function TableFilterByPanel({
  tableId,
  columnId,
  label,
  applyText,
  clearText,
  onAction,
  autoFocusInput = true,
  className,
}: TableFilterByPanelProps) {
  const inputId: string = useId();
  const { draftValue, isDirty, hasFilterValue, commitOnChange, changeDraftValue, applyFilterValue, clearFilterValue } =
    useTableFilterByQuery(tableId, columnId);
  const hint: string | undefined = getTableFilterByColumnConfig(columnId)?.hint;

  /**
   * The one way this panel commits, shared by the Apply button and Enter in the input, so the two
   * can never drift. Closes the host menu on the way out — applying is the end of the interaction,
   * and the table behind the menu is what you want to look at next.
   */
  const handleApplyFilter = () => {
    applyFilterValue();
    onAction?.();
  };

  return (
    <ColumnStack className={ cn('gap-y-2', className) }>
      { label === null ? null : (
        <Label htmlFor={ inputId }>
          <Typography as="span" variant="labelvalue1" className="font-medium">
            { label ?? 'Filter value' }
          </Typography>
        </Label>
      ) }

      <TableFilterByInput
        id={ inputId }
        columnId={ columnId }
        value={ draftValue }
        autoFocus={ autoFocusInput }
        onValueChange={ changeDraftValue }
        onSubmit={ handleApplyFilter }
        onClear={ clearFilterValue }
      />

      { hint ?
        <Typography variant="caption1">{ hint }</Typography>
      : null }

      { commitOnChange ? null : (
        <TableFilterByApplyButton onApply={ handleApplyFilter } isDirty={ isDirty }>
          { applyText }
        </TableFilterByApplyButton>
      ) }

      { hasFilterValue ?
        <TableFilterByClearButton onClear={ clearFilterValue }>{ clearText }</TableFilterByClearButton>
      : null }
    </ColumnStack>
  );
}
