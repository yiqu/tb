import { ReactNode } from 'react';

/**
 * A plain text chunk the user typed themselves inside the text area.
 */
export interface AutoCompleteTextSegment {
  kind: 'text';
  text: string;
}

/**
 * An "autocompleted item": an item that was selected from the dropdown list and
 * auto-filled into the text area. It is rendered as a chip (Gmail style) instead of plain text.
 * `chipId` is a unique id generated at insert time so the same item can be inserted multiple times.
 */
export interface AutoCompleteItemSegment<T> {
  kind: 'item';
  chipId: string;
  item: T;
}

export type AutoCompleteSegment<T> = AutoCompleteTextSegment | AutoCompleteItemSegment<T>;

/**
 * The value of the AutoCompletableTextArea: an ordered mix of typed text and autocompleted items.
 * This is what flows through react-hook-form / onChange. Use the helpers in
 * `autocompletable-textarea.utils.ts` to turn it into a plain string (for display or for the server).
 */
export type AutoCompleteValue<T> = AutoCompleteSegment<T>[];

/**
 * Everything a chip menu item's `onSelect` callback receives. The built-in actions
 * (edit / show details / remove) are exposed as callbacks so custom menu items can reuse them,
 * or completely ignore them and do their own thing with `item`.
 */
export interface AutoCompleteChipMenuContext<T> {
  /** The item this chip represents. */
  item: T;
  /** Unique id of this chip instance inside the text area. */
  chipId: string;
  /** Re-opens the dropdown list anchored at this chip so the user can pick a different item. */
  startEdit: () => void;
  /** Opens the shared details dialog for this chip's item. */
  showDetails: () => void;
  /** Removes this chip from the text area. */
  removeChip: () => void;
}

/**
 * One entry of the popover menu shown when an autocompleted item (chip) is clicked.
 * The menu is fully composable: pass your own array via the `chipMenuItems` prop to add,
 * remove or reorder options. Defaults live in `AutoCompleteChipMenu.tsx`.
 */
export interface AutoCompleteChipMenuItemConfig<T> {
  /** Unique key for React rendering. */
  key: string;
  /** Label shown in the menu, can be any node. */
  label: ReactNode;
  /** Optional leading icon node. */
  icon?: ReactNode;
  /** Renders the menu item in the destructive style (red) when true. */
  destructive?: boolean;
  /** Called when the menu item is picked. Use the context to run built-in actions or your own. */
  onSelect: (context: AutoCompleteChipMenuContext<T>) => void;
}

/**
 * Where the caret-anchored dropdown should be positioned, relative to the component wrapper.
 */
export interface AutoCompleteAnchorPosition {
  left: number;
  top: number;
  height: number;
}

/**
 * Props for the controlled AutoCompletableTextArea. `T` is the shape of the list items —
 * the component itself knows nothing about it, everything item-specific comes in through
 * the callback props, which keeps it droppable into any codebase with any object shape.
 */
export interface AutoCompletableTextAreaProps<T> {
  /** Full list of selectable items. All local — no remote search, no pagination. */
  items: T[];
  /** Controlled value (mix of text and autocompleted items). Works with react-hook-form's `field.value`. */
  value: AutoCompleteValue<T>;
  /** Controlled change callback. Works with react-hook-form's `field.onChange`. */
  onValueChange: (value: AutoCompleteValue<T>) => void;
  /** Filter callback used by the dropdown's search inbox. Return true to keep the item. */
  filterFunction: (item: T, filter: string) => boolean;
  /** Returns the text shown inside the chip once an item is autocompleted into the text area. */
  itemDisplayFunction: (item: T) => string;
  /**
   * Serializes an autocompleted item to its "real" text (e.g. `item => item.id`).
   * Used when copying/cutting text-area content to the clipboard — chips are copied as this text —
   * and to recognize item ids inside an incoming value (see `getItemIdPrefix`).
   * Falls back to `itemDisplayFunction` when omitted.
   */
  itemTransformFunction?: (item: T) => string;
  /**
   * Returns the prefix every item id (the `itemTransformFunction` output) starts with, e.g. 'GIST-'.
   * When provided, incoming values (initial value, form resets) and the content on every blur of
   * the text area are scanned for the prefix, and any matching item id found in plain text
   * (typed or pasted) is swapped into an autocompleted item chip. The prefix keeps
   * the scan cheap: only prefix occurrences are candidate positions, instead of matching every id at
   * every character of the text. Omit to disable hydration.
   */
  getItemIdPrefix?: (item: T) => string;
  /** Renders one row of the dropdown list. Falls back to `itemDisplayFunction` text when omitted. */
  renderItemOption?: (item: T) => ReactNode;
  /** Renders the body of the "Show details" dialog. Falls back to a generic key/value dump when omitted. */
  renderItemDetails?: (item: T) => ReactNode;
  /** Title of the "Show details" dialog. */
  detailsDialogTitle?: ReactNode;
  /** Keyboard key that opens the dropdown at the caret (e.g. ':', '?', '+', '@'). Defaults to ':'. */
  triggerKey?: string;
  /** Tailwind classes for the text area surface. */
  className?: string;
  /** Tailwind classes for each dropdown select item. */
  selectItemClassName?: string;
  /** Tailwind classes for the autocompleted item chip. */
  chipClassName?: string;
  /** Placeholder text shown when the text area is empty. */
  placeholder?: string;
  /** Placeholder of the dropdown's search inbox. */
  searchPlaceholder?: string;
  /** Text shown when the filter matches nothing. */
  emptyText?: string;
  /** Disables typing and chip interactions. */
  disabled?: boolean;
  /** Overrides the chip popover menu entries. Defaults to Edit / Show details / Remove. */
  chipMenuItems?: AutoCompleteChipMenuItemConfig<T>[];
  /** Blur callback, e.g. react-hook-form's `field.onBlur`. */
  onBlur?: () => void;
  id?: string;
}
