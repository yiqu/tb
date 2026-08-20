'use client';

import { ReactNode } from 'react';

import { Dialog } from '@/components/ui/dialog';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

interface AutoCompleteReadOnlyDetailsDialogProps<T> {
  /** The item to show. `null` keeps the dialog closed. */
  item: T | null;
  onClose: () => void;
  /** Custom body renderer. Falls back to a generic key/value dump of the item. */
  renderItemDetails?: (item: T) => ReactNode;
  title?: ReactNode;
}

/**
 * "View details" dialog for a read-only chip. Reuses the app-wide `StyledDialogContent` shared
 * dialog rather than introducing another dialog style.
 */
export default function AutoCompleteReadOnlyDetailsDialog<T>({
  item,
  onClose,
  renderItemDetails,
  title,
}: AutoCompleteReadOnlyDetailsDialogProps<T>) {
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
        headerDescription={ <Typography variant="caption1">Everything about this item.</Typography> }
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

/** Fallback body: lists every own property of the item as a label/value row. */
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
