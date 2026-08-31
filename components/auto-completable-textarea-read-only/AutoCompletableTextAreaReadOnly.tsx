'use client';

import { useMemo, useState, Fragment } from 'react';

import { cn } from '@/lib/utils';

import AutoCompleteReadOnlyChip from './AutoCompleteReadOnlyChip';
import { getDefaultReadOnlyChipMenuItems } from './AutoCompleteReadOnlyChipMenu';
import AutoCompleteReadOnlyCopyButton from './AutoCompleteReadOnlyCopyButton';
import { splitTextByItemRegex, readOnlySegmentsToCopyText } from './autocompletable-textarea-read-only.utils';
import AutoCompleteItemDetailsDialog from '@/components/auto-completable-shared/AutoCompleteItemDetailsDialog';
import { ReadOnlySegment, AutoCompletableTextAreaReadOnlyProps } from './autocompletable-textarea-read-only.models';

/**
 * AutoCompletableTextAreaReadOnly — the view-only counterpart of AutoCompletableTextArea.
 *
 * It takes a plain string, scans it with `getItemRegex()`, and renders every match as a clickable
 * chip (menu: View details / Copy / Copy display) while the rest stays plain text. There is no
 * editing, no caret handling and no dropdown: this is a display component, so it is a separate
 * component in its own folder rather than a "readOnly" flag on the editable one — that would have
 * piled view-only props onto a component already busy with contentEditable mechanics.
 *
 * Generic over `T`: the component knows nothing about the item shape; `resolveItem`,
 * `itemDisplayFunction`, `itemCopyContentFunction` and `renderItemDetails` are written against your
 * concrete type at the call site.
 */
export default function AutoCompletableTextAreaReadOnly<T>({
  text,
  getItemRegex,
  resolveItem,
  showOriginal,
  itemDisplayFunction,
  itemCopyContentFunction,
  renderItemDetails,
  detailsDialogTitle,
  chipMenuItems,
  showCopyButton = true,
  copyButtonClassName,
  className,
  textClassName,
  chipClassName,
  unresolvedChipClassName,
  id,
}: AutoCompletableTextAreaReadOnlyProps<T>) {
  const [detailsItem, setDetailsItem] = useState<T | null>(null);

  // Re-scan only when the text, the pattern or the resolver actually change.
  // showOriginal skips the scan altogether: the whole string stays one plain-text run.
  const segments: ReadOnlySegment<T>[] = useMemo(
    () => (showOriginal ? [{ kind: 'text', text: text }] : splitTextByItemRegex<T>(text, getItemRegex(), resolveItem)),
    [text, getItemRegex, resolveItem, showOriginal],
  );

  const resolvedChipMenuItems = useMemo(
    () => chipMenuItems ?? getDefaultReadOnlyChipMenuItems<T>(),
    [chipMenuItems],
  );

  // Nothing to copy from an empty display, so the button is not rendered at all then.
  const hasCopyButton = showCopyButton && segments.length > 0;

  return (
    <div
      id={ id }
      className={ cn(
        'relative w-full text-base break-words whitespace-pre-wrap md:text-sm',
        // Keeps the text clear of the button pinned in the corner.
        { 'pr-8': hasCopyButton },
        className,
      ) }
    >
      { hasCopyButton ?
        <AutoCompleteReadOnlyCopyButton
          className={ copyButtonClassName }
          getCopyText={ () => readOnlySegmentsToCopyText(segments, itemCopyContentFunction) }
        />
      : null }
      { segments.map((segment: ReadOnlySegment<T>, index: number) => {
        if (segment.kind === 'text') {
          return (
            <span key={ `text-${index}` } className={ textClassName }>
              { segment.text }
            </span>
          );
        }
        return (
          <Fragment key={ `match-${index}` }>
            <AutoCompleteReadOnlyChip<T>
              item={ segment.item }
              matchedText={ segment.matchedText }
              // An unresolved id has no item to display, so the raw matched text is shown instead.
              displayText={ segment.item !== undefined && itemDisplayFunction ? itemDisplayFunction(segment.item) : segment.matchedText }
              contentText={ segment.item !== undefined ? itemCopyContentFunction?.(segment.item) : undefined }
              menuItems={ resolvedChipMenuItems }
              className={ chipClassName }
              unresolvedClassName={ unresolvedChipClassName }
              onViewDetails={ setDetailsItem }
            />
          </Fragment>
        );
      }) }

      <AutoCompleteItemDetailsDialog<T>
        item={ detailsItem }
        onClose={ () => setDetailsItem(null) }
        renderItemDetails={ renderItemDetails }
        title={ detailsDialogTitle }
      />
    </div>
  );
}
