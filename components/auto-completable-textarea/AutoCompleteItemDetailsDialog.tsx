'use client';

import { ReactNode } from 'react';

import { Dialog } from '@/components/ui/dialog';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

interface AutoCompleteItemDetailsDialogProps<T> {
  /** The item to show. `null` keeps the dialog closed. */
  item: T | null;
  onClose: () => void;
  /** Custom body renderer. When omitted, a generic key/value dump of the item is shown. */
  renderItemDetails?: (item: T) => ReactNode;
  title?: ReactNode;
}

/**
 * "Show details" dialog for an autocompleted item. Reuses the app-wide `StyledDialogContent`
 * shared dialog instead of introducing a new dialog style. The body is composable through
 * `renderItemDetails`, so any object shape can present itself however it wants; without it a
 * generic key/value listing of the item is rendered.
 */
export default function AutoCompleteItemDetailsDialog<T>({ item, onClose, renderItemDetails, title }: AutoCompleteItemDetailsDialogProps<T>) {
  return (
    <Dialog
      open={ item !== null }
      onOpenChange={ (open: boolean) => {
        if (!open) {
          onClose();
        }
      } }
    >
      <StyledDialogContent
        headerTitle={ title ?? 'Item details' }
        headerDescription={ <Typography variant="caption1">Everything about this autocompleted item.</Typography> }
        className="sm:max-w-[520px] md:max-w-[520px] lg:max-w-[520px]"
        contentWrapperClassName="pb-4"
      >
        { item !== null ?
          renderItemDetails ?
            renderItemDetails(item)
          : <DefaultItemDetails item={ item } />
        : null }
      </StyledDialogContent>
    </Dialog>
  );
}

/**
 * Fallback details body: lists every own property of the item as a label/value row.
 */
function DefaultItemDetails<T>({ item }: { item: T }) {
  if (typeof item !== 'object' || item === null) {
    return <Typography variant="body1">{ String(item) }</Typography>;
  }

  const entries = Object.entries(item as Record<string, unknown>);

  return (
    <ColumnStack className="gap-y-2">
      { entries.map(([key, entryValue]: [string, unknown]) => {
        return (
          <RowStack key={ key } className="items-start gap-x-2">
            <Typography variant="label1" className="min-w-24 capitalize">
              { key }
            </Typography>
            <Typography variant="body1" className="break-all">
              { typeof entryValue === 'string' ? entryValue : JSON.stringify(entryValue) }
            </Typography>
          </RowStack>
        );
      }) }
    </ColumnStack>
  );
}
