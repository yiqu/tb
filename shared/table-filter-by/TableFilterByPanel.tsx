'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { AppColumnId } from '@/store/subscriptions/table.store';
import useTableFilterByQuery from '@/hooks/table-filter-by/useTableFilterByQuery';
import { getTableFilterByColumnConfig } from '@/shared/table-filter-by/table-filter-by.utils';

import TableFilterByInput from './TableFilterByInput';
import TableFilterByApplyButton from './TableFilterByApplyButton';

export interface TableFilterByPanelProps {
  /** The column being filtered. */
  columnId: AppColumnId;
  /** Field label. Pass `null` to drop it. */
  label?: React.ReactNode;
  /** Apply button text. */
  applyText?: React.ReactNode;
  className?: string;
}

/**
 * The body of the "Filter By" submenu: a label, the input, and Apply.
 *
 * Typing only moves a draft — Apply (or Enter in the input) is what writes the search param. The
 * button renders off `commitOnChange`, so turning that back on in `useTableFilterByQuery` removes
 * the button here without touching this file.
 */
export default function TableFilterByPanel({ columnId, label, applyText, className }: TableFilterByPanelProps) {
  const inputId: string = useId();
  const { draftValue, isDirty, commitOnChange, changeDraftValue, applyFilterValue, clearFilterValue } =
    useTableFilterByQuery(columnId);
  const hint: string | undefined = getTableFilterByColumnConfig(columnId)?.hint;

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
        onValueChange={ changeDraftValue }
        onSubmit={ applyFilterValue }
        onClear={ clearFilterValue }
      />

      { hint ?
        <Typography variant="caption1">{ hint }</Typography>
      : null }

      { commitOnChange ? null : (
        <TableFilterByApplyButton onApply={ applyFilterValue } isDirty={ isDirty }>
          { applyText }
        </TableFilterByApplyButton>
      ) }
    </ColumnStack>
  );
}
