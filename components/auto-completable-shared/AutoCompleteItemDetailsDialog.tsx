'use client';

import { ReactNode } from 'react';

import { Dialog } from '@/components/ui/dialog';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

import { RenderItemDetails } from './autocompletable-shared.models';

interface AutoCompleteItemDetailsDialogProps<T> {
  /** The item to show. `null` keeps the dialog closed. */
  item: T | null;
  onClose: () => void;
  /** Custom body renderer. When omitted, a generic key/value dump of the item is shown. */
  renderItemDetails?: RenderItemDetails<T>;
  /** Dialog title. */
  title?: ReactNode;
  /** Dialog subtitle under the title. */
  description?: ReactNode;
}

/**
 * Details dialog for an item, shared by the editable text area's chip menu ("Show details") and the
 * read-only display's chip menu ("View details").
 *
 * Both used a byte-identical dialog, and its prop surface is fixed at five — it does not grow when
 * either component changes — so sharing it costs neither component any configurability. Reuses the
 * app-wide `StyledDialogContent` rather than introducing another dialog style; the body is
 * composable through `renderItemDetails`, with a generic key/value listing as the fallback.
 */
export default function AutoCompleteItemDetailsDialog<T>({
  item,
  onClose,
  renderItemDetails,
  title,
  description,
}: AutoCompleteItemDetailsDialogProps<T>) {
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
        headerDescription={ <Typography variant="caption1">{ description ?? 'Everything about this item.' }</Typography> }
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
