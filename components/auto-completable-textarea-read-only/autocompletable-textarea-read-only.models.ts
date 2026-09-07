import { ReactNode } from 'react';

import { ChipMenuItemConfig, ItemDisplayFunction, RenderItemDetails } from '@/components/auto-completable-shared/autocompletable-shared.models';

/** A plain run of text between matches — rendered as-is. */
export interface ReadOnlyTextSegment {
  kind: 'text';
  text: string;
}

/**
 * A run of text that matched the item regex — rendered as a clickable chip.
 * `item` is undefined when the text looks like an id but no item could be resolved for it
 * (stale id, deleted record, typo); the chip then renders in its "unresolved" style.
 */
export interface ReadOnlyMatchSegment<T> {
  kind: 'match';
  matchedText: string;
  item: T | undefined;
}

export type ReadOnlySegment<T> = ReadOnlyTextSegment | ReadOnlyMatchSegment<T>;

/**
 * What each chip menu entry's `onSelect` receives. Everything the built-in entries need is here,
 * so custom entries can be written without reaching into the component.
 */
export interface AutoCompleteReadOnlyChipMenuContext<T> {
  /** The resolved item, or undefined when the matched text could not be resolved. */
  item: T | undefined;
  /** The raw text that matched the regex (i.e. the id). */
  matchedText: string;
  /** The text the chip displays. */
  displayText: string;
  /**
   * The item's content, per the `itemCopyContentFunction` prop. Undefined when the item could not
   * be resolved or no content function was supplied — the "Copy" entry disables itself then.
   */
  contentText: string | undefined;
  /** Writes arbitrary text to the clipboard. Resolves once the write completed. */
  copyText: (text: string) => Promise<void>;
  /** Opens the details dialog for this chip's item. */
  viewDetails: () => void;
}

/**
 * One entry of the menu shown when a chip is clicked. Data-driven so the menu stays composable:
 * pass your own array via `chipMenuItems` to add, remove or reorder entries.
 * Defaults live in `AutoCompleteReadOnlyChipMenu.tsx`.
 *
 * The shape comes from the shared `ChipMenuItemConfig`; the context stays this component's own,
 * so these entries only ever see read-only actions (view details / copy).
 */
export type AutoCompleteReadOnlyChipMenuItemConfig<T> = ChipMenuItemConfig<AutoCompleteReadOnlyChipMenuContext<T>>;

/**
 * Props for AutoCompletableTextAreaReadOnly. `T` is the item shape — the component knows nothing
 * about it; everything item-specific arrives through the concrete callbacks you pass in.
 */
export interface AutoCompletableTextAreaReadOnlyProps<T> {
  /** The string to display. Any part of it matching `getItemRegex()` becomes a chip. */
  text: string;
  /**
   * Returns the regex identifying chip-able text. Called with no arguments: the regex describes the
   * id FORMAT, which has to be known before any item exists to match it against.
   * Must not be anchored (`^`/`$`) or nothing inside a sentence can match; the `g` flag is applied
   * for you, and a fresh regex is used per scan so `lastIndex` is never carried over.
   */
  getItemRegex: () => RegExp;
  /** Resolves matched text (the id) to its item. Return undefined for unknown ids. */
  resolveItem?: (matchedText: string) => T | undefined;
  /**
   * Shows the string exactly as passed in: the regex scan is skipped entirely, so nothing becomes
   * a chip and the raw ids stay visible as ordinary text.
   */
  showOriginal?: boolean;
  /** Text shown on a chip for a resolved item. Falls back to the matched text. */
  itemDisplayFunction?: ItemDisplayFunction<T>;
  /** Text copied by the "Copy" entry. Without it that entry stays disabled. */
  itemCopyContentFunction?: (item: T) => string;
  /** Body of the details dialog. Falls back to a generic key/value dump. */
  renderItemDetails?: RenderItemDetails<T>;
  /** Title of the details dialog. */
  detailsDialogTitle?: ReactNode;
  /**
   * Shows a copy button in the top right corner that copies the WHOLE display as one string.
   * Defaults to true.
   *
   * Plain text is copied verbatim and every chip is serialized through `itemCopyContentFunction`,
   * so a display reading "she is [Ada Lovelace]" copies as "she is ada@example.com" when that
   * function returns the email. A chip whose id could not be resolved — or any chip at all when no
   * `itemCopyContentFunction` was supplied — copies as the text that matched the regex (the id),
   * so nothing is silently dropped. With `showOriginal` on there are no chips, so the string is
   * copied exactly as passed in.
   */
  showCopyButton?: boolean;
  /** Tailwind classes for the copy button, e.g. to reposition it. */
  copyButtonClassName?: string;
  /** Overrides the chip menu entries. Defaults to View details / Copy / Copy display. */
  chipMenuItems?: AutoCompleteReadOnlyChipMenuItemConfig<T>[];
  /** Tailwind classes for the wrapper around the whole rendered text. */
  className?: string;
  /** Tailwind classes for the plain (non-chip) text runs. */
  textClassName?: string;
  /** Tailwind classes for chips. */
  chipClassName?: string;
  /** Extra Tailwind classes for chips whose id could not be resolved to an item. */
  unresolvedChipClassName?: string;
  id?: string;
}
