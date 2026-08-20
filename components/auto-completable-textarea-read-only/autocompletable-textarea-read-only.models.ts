import { ReactNode } from 'react';

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
 */
export interface AutoCompleteReadOnlyChipMenuItemConfig<T> {
  /** Unique key for React rendering. */
  key: string;
  /** Label shown in the menu. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Renders the entry in the destructive (red) style. */
  destructive?: boolean;
  /** Greys out the entry, e.g. an action that needs a resolved item. */
  isDisabled?: (context: AutoCompleteReadOnlyChipMenuItemContextForState<T>) => boolean;
  /** Runs when the entry is picked. */
  onSelect: (context: AutoCompleteReadOnlyChipMenuContext<T>) => void;
}

/** The subset of the context available while deciding whether an entry is disabled. */
export type AutoCompleteReadOnlyChipMenuItemContextForState<T> = Pick<
  AutoCompleteReadOnlyChipMenuContext<T>,
  'item' | 'matchedText' | 'displayText' | 'contentText'
>;

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
  /** Text shown on a chip for a resolved item. Falls back to the matched text. */
  itemDisplayFunction?: (item: T) => string;
  /** Text copied by the "Copy" entry. Without it that entry stays disabled. */
  itemCopyContentFunction?: (item: T) => string;
  /** Body of the details dialog. Falls back to a generic key/value dump. */
  renderItemDetails?: (item: T) => ReactNode;
  /** Title of the details dialog. */
  detailsDialogTitle?: ReactNode;
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
