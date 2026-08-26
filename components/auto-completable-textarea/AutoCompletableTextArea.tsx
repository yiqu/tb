'use client';

import {
  useRef,
  useMemo,
  useState,
  Fragment,
  useEffect,
  FocusEvent,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
  useLayoutEffect,
} from 'react';

import { cn } from '@/lib/utils';

import AutoCompleteDropdown from './AutoCompleteDropdown';
import AutoCompleteItemChip from './AutoCompleteItemChip';
import AutoCompleteClearButton from './AutoCompleteClearButton';
import AutoCompleteItemDetailsDialog from '@/components/auto-completable-shared/AutoCompleteItemDetailsDialog';
import { getDefaultChipMenuItems } from './AutoCompleteChipMenu';

import {
  AutoCompleteValue,
  AutoCompleteSegment,
  AutoCompleteAnchorPosition,
  AutoCompletableTextAreaProps,
} from './autocompletable-textarea.models';
import {
  generateChipId,
  parseEditorDom,
  placeCaretAtEnd,
  collectChipItems,
  placeCaretAfterNode,
  placeCaretAtTextOffset,
  autoCompleteValueToText,
  hydrateAutoCompleteValue,
  flattenAutoCompleteValue,
  isAutoCompleteValueEmpty,
  getCaretPositionInWrapper,
  areAutoCompleteValuesEqual,
  getElementPositionInWrapper,
  AUTOCOMPLETE_CHIP_ID_ATTRIBUTE,
  AUTOCOMPLETE_INSERT_MARKER_ATTRIBUTE,
} from './autocompletable-textarea.utils';

/** Consecutive typing within this many ms collapses into a single undo entry. */
const HISTORY_COALESCE_MS = 600;

/** Cap on retained undo snapshots, so a long editing session cannot grow without bound. */
const HISTORY_LIMIT = 200;

/**
 * State of the caret-anchored dropdown: closed (null), inserting a brand new chip at the caret,
 * or editing (replacing) an existing chip.
 */
interface DropdownState {
  mode: { type: 'insert' } | { type: 'edit'; chipId: string };
  anchorPosition: AutoCompleteAnchorPosition;
}

/**
 * Where to put the caret after the editable surface is re-mounted by a structural change.
 * 'none' skips focus/caret entirely — used when the change happens while the editor is
 * unfocused (e.g. blur-time id detection) so focus is not stolen back.
 */
interface PendingCaret {
  type: 'after-chip' | 'end' | 'none';
  chipId?: string;
  /** When set, the caret goes this many characters into the text node following the chip. */
  offsetIntoNext?: number;
}

/**
 * Internal render state of the editable surface. `key` bumps only on STRUCTURAL changes
 * (chip inserted / replaced / removed, or an external value reset) which fully re-mounts the
 * surface from `segments`. Plain typing never bumps it — the browser owns the DOM while the
 * component just parses it back into segments on every input, so the caret is never disturbed.
 */
interface EditorRenderState<T> {
  key: number;
  segments: AutoCompleteValue<T>;
}

/**
 * AutoCompletableTextArea — a controlled, react-hook-form-friendly textarea replacement where
 * hitting a trigger key (':' by default) opens a searchable, scrollable dropdown of items at the
 * typing cursor. Selecting an item (mouse click or ArrowUp/ArrowDown + Enter) auto-fills it into
 * the text as a Gmail-style chip that is visually distinct from typed text; clicking a chip opens
 * a composable popover menu (Edit / Show details / Remove by default).
 *
 * Fully generic: works with any object shape via the `filterFunction`, `itemDisplayFunction`,
 * `renderItemOption` and `renderItemDetails` callback props. See
 * `autocompletable-textarea.models.ts` for every prop and `autocompletable-textarea.utils.ts`
 * for helpers that turn the value into plain text (display or server transform).
 */
export default function AutoCompletableTextArea<T>({
  items,
  value,
  onValueChange,
  filterFunction,
  itemDisplayFunction,
  itemTransformFunction,
  getItemRegex,
  renderItemOption,
  isItemDisabled,
  renderItemDetails,
  detailsDialogTitle,
  triggerKey = ':',
  className,
  selectItemClassName,
  chipClassName,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
  showOriginal,
  showClearButton = true,
  clearButtonClassName,
  chipMenuItems,
  onBlur,
  id,
}: AutoCompletableTextAreaProps<T>) {
  const [render, setRender] = useState<EditorRenderState<T>>(() => ({ key: 0, segments: value }));
  const [dropdownState, setDropdownState] = useState<DropdownState | null>(null);
  const [detailsItem, setDetailsItem] = useState<T | null>(null);

  // Mirror of dropdownState readable from stable callbacks (e.g. the blur handler).
  const dropdownStateRef = useRef<DropdownState | null>(dropdownState);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  /** chipId -> item, the source of truth when parsing the contentEditable DOM back into segments. */
  const chipItemsRef = useRef<Map<string, T>>(collectChipItems(value));
  /** Caret range captured when the trigger key was pressed — the chip is inserted here. */
  const insertRangeRef = useRef<Range | null>(null);
  const pendingCaretRef = useRef<PendingCaret | null>(null);
  /** Last value this component emitted, used to tell external resets apart from our own echoes. */
  const lastEmittedRef = useRef<AutoCompleteValue<T>>(value);

  /**
   * Undo/redo history over the VALUE, not the DOM.
   *
   * The browser's native undo stack is unusable here: every structural change remounts the editable
   * surface (see `render.key`), which throws that stack away, and chips are inserted by direct DOM
   * manipulation, which the browser never records. So Ctrl/Cmd+Z is handled here instead, over
   * snapshots of the segment value.
   */
  const historyRef = useRef<AutoCompleteValue<T>[]>([value]);
  const historyIndexRef = useRef<number>(0);
  const lastRecordAtRef = useRef<number>(0);
  const lastRecordWasTypingRef = useRef<boolean>(false);
  /** True while a snapshot is being restored, so the restore does not record itself. */
  const isRestoringRef = useRef<boolean>(false);
  /** Indirection so commitStructural (declared first, deps []) can reach recordHistory. */
  const recordHistoryRef = useRef<(next: AutoCompleteValue<T>, isTyping: boolean) => void>(() => {});
  /** Same indirection for the key handler, which is declared before undo/redo exist. */
  const undoRef = useRef<() => void>(() => {});
  const redoRef = useRef<() => void>(() => {});
  /** ...and for the dropdown handler, which is declared before handleInput. */
  const handleInputRef = useRef<() => void>(() => {});

  // Keep the latest onValueChange reachable from stable callbacks.
  const onValueChangeRef = useRef(onValueChange);

  // Latest item-related props, reachable from stable callbacks and the value-sync effect.
  const hydrationRef = useRef({
    getItemRegex,
    resolveItemFromText: (_matchedText: string): T | undefined => undefined,
    resolveItemText: (_item: T): string => '',
    showOriginal,
  });

  // Refs are synced in the commit phase, never during render: a render that is double-invoked
  // (StrictMode) or interrupted and thrown away must not leave handlers reading values from a
  // render that never committed. Declared BEFORE the value-sync effect below because passive
  // effects run in declaration order, so that effect always observes this render's props.
  useEffect(() => {
    dropdownStateRef.current = dropdownState;
    onValueChangeRef.current = onValueChange;
    hydrationRef.current = { getItemRegex, resolveItemFromText, resolveItemText, showOriginal };
    recordHistoryRef.current = recordHistory;
    undoRef.current = undo;
    redoRef.current = redo;
    handleInputRef.current = handleInput;
  });

  /**
   * Serializes an item for the clipboard / id matching; falls back to the display text.
   * Reads the props directly rather than `hydrationRef`, because this also runs DURING render
   * (each chip's `serverText`), where the ref still holds the previous commit's props.
   */
  const resolveItemText = useCallback(
    (item: T) => {
      return itemTransformFunction ? itemTransformFunction(item) : itemDisplayFunction(item);
    },
    [itemDisplayFunction, itemTransformFunction],
  );

  /**
   * matched text -> item, so a regex match can be resolved back to a real item in O(1).
   * Built from the same `items` the dropdown uses, keyed by each item's serialized text, so the
   * component never needs a separate resolver prop the way the read-only display does.
   *
   * Text that two or more items serialize to is recorded as AMBIGUOUS rather than letting the last
   * one win: there is no way to tell which item was meant, and silently guessing would attach an
   * arbitrary item to the chip. Ambiguous text resolves to nothing, so it stays plain text — the
   * same outcome as text that matches no item at all.
   */
  const { itemsByText, ambiguousItemTexts } = useMemo(() => {
    const byText = new Map<string, T>();
    const ambiguous = new Set<string>();
    for (const item of items) {
      const text = resolveItemText(item);
      if (byText.has(text)) {
        ambiguous.add(text);
        continue;
      }
      byText.set(text, item);
    }
    return { itemsByText: byText, ambiguousItemTexts: ambiguous };
  }, [items, resolveItemText]);

  const resolveItemFromText = useCallback(
    (matchedText: string) => (ambiguousItemTexts.has(matchedText) ? undefined : itemsByText.get(matchedText)),
    [itemsByText, ambiguousItemTexts],
  );

  const resolvedChipMenuItems = useMemo(() => chipMenuItems ?? getDefaultChipMenuItems<T>(), [chipMenuItems]);

  const mountedRef = useRef(false);

  // Incoming value sync. On mount and on every true external change (form reset, setValue, ...)
  // the value is hydrated — plain-text item ids (found via getItemRegex, then resolved against
  // items) are swapped into chips — and the surface is re-mounted from it.
  // Our own emissions round-trip back here with equal content and are ignored, preserving the caret.
  useEffect(() => {
    const isMount = !mountedRef.current;
    mountedRef.current = true;
    if (!isMount && areAutoCompleteValuesEqual(value, lastEmittedRef.current)) {
        lastEmittedRef.current = value;
        return;
      }
    const { getItemRegex: regex, resolveItemFromText: resolve, resolveItemText: toText, showOriginal: raw } = hydrationRef.current;
    // showOriginal means nothing on screen is a chip, so an incoming value carrying item segments
    // (a form reset to chipped defaults, a controlled parent) is flattened back to its raw text
    // rather than passed through. Without the flag, ids in the text are scanned into chips instead.
    const hydrated =
      raw ? flattenAutoCompleteValue(value, toText)
      : regex ? hydrateAutoCompleteValue(value, regex(), resolve)
      : value;
    const changedByHydration = hydrated !== value && !areAutoCompleteValuesEqual(hydrated, value);
    if (isMount && !changedByHydration) {
      lastEmittedRef.current = value;
      return;
    }
    lastEmittedRef.current = hydrated;
    // An external value (form reset, setValue) starts a fresh history — the previous document's
    // undo entries are no longer meaningful.
    historyRef.current = [hydrated];
    historyIndexRef.current = 0;
    lastRecordWasTypingRef.current = false;
    chipItemsRef.current = collectChipItems(hydrated);
    setRender((prev: EditorRenderState<T>) => ({ key: prev.key + 1, segments: hydrated }));
    if (changedByHydration) {
      onValueChangeRef.current(hydrated);
    }
  }, [value]);

  // After a structural re-mount, put the caret back where the user expects it.
  useLayoutEffect(() => {
    const caret = pendingCaretRef.current;
    pendingCaretRef.current = null;
    const editor = editorRef.current;
    if (!caret || !editor || caret.type === 'none') {
      return;
    }
    editor.focus();
    if (caret.type === 'after-chip' && caret.chipId) {
      const chipElement = editor.querySelector(`[${AUTOCOMPLETE_CHIP_ID_ATTRIBUTE}="${caret.chipId}"]`);
      if (chipElement) {
        const next = chipElement.nextSibling;
        if (caret.offsetIntoNext && next && next.nodeType === Node.TEXT_NODE && (next.textContent ?? '').length >= caret.offsetIntoNext) {
          placeCaretAtTextOffset(next, caret.offsetIntoNext);
        } else {
          placeCaretAfterNode(chipElement);
        }
        return;
      }
    }
    placeCaretAtEnd(editor);
  }, [render.key]);

  /**
   * Commits a structural change: refreshes the chip map, schedules a caret restore,
   * re-mounts the surface and emits the new value.
   */
  const commitStructural = useCallback((segments: AutoCompleteValue<T>, caret: PendingCaret) => {
    chipItemsRef.current = collectChipItems(segments);
    pendingCaretRef.current = caret;
    lastEmittedRef.current = segments;
    setRender((prev: EditorRenderState<T>) => ({ key: prev.key + 1, segments: segments }));
    onValueChangeRef.current(segments);
    recordHistoryRef.current(segments, false);
  }, []);

  /**
   * Appends a snapshot to the history.
   *
   * Consecutive typing inside a short window is coalesced into one entry, so a single Ctrl+Z undoes
   * a word or burst rather than one character — closer to what a native textarea does. Structural
   * changes (chip inserted / removed / edited, clear, showOriginal conversion) always get their own
   * entry. Redo entries ahead of the cursor are dropped once a new edit branches off them.
   */
  const recordHistory = useCallback((next: AutoCompleteValue<T>, isTyping: boolean) => {
    if (isRestoringRef.current) {
      return;
    }
    const now = Date.now();
    const entries = historyRef.current;
    // Drop any redo branch: a fresh edit invalidates whatever came after the cursor.
    if (historyIndexRef.current < entries.length - 1) {
      entries.length = historyIndexRef.current + 1;
    }
    const coalesce = isTyping && lastRecordWasTypingRef.current && now - lastRecordAtRef.current < HISTORY_COALESCE_MS;
    if (coalesce && entries.length > 0) {
      entries[entries.length - 1] = next;
    } else {
      entries.push(next);
      if (entries.length > HISTORY_LIMIT) {
        entries.shift();
      }
    }
    historyIndexRef.current = entries.length - 1;
    lastRecordAtRef.current = now;
    lastRecordWasTypingRef.current = isTyping;
  }, []);

  /** Restores a snapshot without recording it, and re-seeds the coalescing window. */
  const restoreHistoryEntry = useCallback(
    (entry: AutoCompleteValue<T>) => {
      isRestoringRef.current = true;
      try {
        commitStructural(entry, { type: 'end' });
      } finally {
        isRestoringRef.current = false;
      }
      lastRecordWasTypingRef.current = false;
    },
    [commitStructural],
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      return;
    }
    historyIndexRef.current = historyIndexRef.current - 1;
    restoreHistoryEntry(historyRef.current[historyIndexRef.current]);
  }, [restoreHistoryEntry]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      return;
    }
    historyIndexRef.current = historyIndexRef.current + 1;
    restoreHistoryEntry(historyRef.current[historyIndexRef.current]);
  }, [restoreHistoryEntry]);

  /** Previous showOriginal, so the effect below only fires on an actual flip, not on mount. */
  const previousShowOriginalRef = useRef(showOriginal);

  // Toggling showOriginal converts the CURRENT content in place, both ways:
  //   ON  -> existing chips flatten back into the raw text they represent
  //   OFF -> raw ids in the text are scanned back into chips
  // The content is read from the DOM rather than `render.segments`, because plain typing is
  // browser-owned and those segments are intentionally stale between structural changes.
  useEffect(() => {
    const previous = previousShowOriginalRef.current;
    previousShowOriginalRef.current = showOriginal;
    if (previous === showOriginal) {
      return;
    }
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const current = parseEditorDom(editor, chipItemsRef.current);
    const converted =
      showOriginal ? flattenAutoCompleteValue(current, resolveItemText)
      : getItemRegex ? hydrateAutoCompleteValue(current, getItemRegex(), resolveItemFromText)
      : current;
    // Both helpers return the original reference when they had nothing to do.
    if (converted === current) {
      return;
    }
    // Only reach for the caret if the user is actually in the editor; a toggle elsewhere on the
    // page must not steal focus.
    const hasFocus = editor.contains(document.activeElement);
    commitStructural(converted, { type: hasFocus ? 'end' : 'none' });
  }, [showOriginal, getItemRegex, resolveItemFromText, resolveItemText, commitStructural]);

  /** Plain typing: parse the DOM into segments and emit, without touching the rendered tree. */
  const handleInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const segments = parseEditorDom(editor, chipItemsRef.current);
    lastEmittedRef.current = segments;
    editor.setAttribute('data-empty', String(isAutoCompleteValueEmpty(segments)));
    onValueChangeRef.current(segments);
    recordHistoryRef.current(segments, true);
  }, []);

  /**
   * Blur: run id detection over the current content — any existing item id typed or pasted as
   * plain text (found via getItemRegex, then resolved against items) is converted into an
   * autocompleted item chip. Committed without touching focus, so nothing is stolen back.
   */
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      const wrapper = wrapperRef.current;
      // Focus moving within the component (a chip button, the dropdown opening) is not a real
      // "leave" — re-mounting mid-interaction would break the menu/dropdown that is opening.
      const stillInside = event.relatedTarget !== null && wrapper !== null && wrapper.contains(event.relatedTarget);
      const { getItemRegex: regex, resolveItemFromText: resolve, showOriginal: raw } = hydrationRef.current;
      // showOriginal also switches off the blur-time scan, so typed ids stay as typed.
      if (editor && !raw && regex && !stillInside && !dropdownStateRef.current) {
        const segments = parseEditorDom(editor, chipItemsRef.current);
        const hydrated = hydrateAutoCompleteValue(segments, regex(), resolve);
        if (hydrated !== segments) {
          commitStructural(hydrated, { type: 'none' });
        }
      }
      onBlur?.();
    },
    [commitStructural, onBlur],
  );

  /**
   * Copy: the selection is serialized to plain text ourselves so that every chip in it becomes
   * its transformed text (e.g. the item id via `itemTransformFunction`) instead of the chip markup.
   */
  const handleCopy = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (!editor || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        return;
      }
      event.preventDefault();
      const selectedSegments = parseEditorDom(range.cloneContents(), chipItemsRef.current);
      event.clipboardData.setData('text/plain', autoCompleteValueToText(selectedSegments, resolveItemText));
    },
    [resolveItemText],
  );

  /** Cut: same serialization as copy, then the selection is deleted and the value re-emitted. */
  const handleCut = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (!editor || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        return;
      }
      event.preventDefault();
      const selectedSegments = parseEditorDom(range.cloneContents(), chipItemsRef.current);
      event.clipboardData.setData('text/plain', autoCompleteValueToText(selectedSegments, resolveItemText));
      range.deleteContents();
      selection.removeAllRanges();
      selection.addRange(range);
      handleInput();
    },
    [resolveItemText, handleInput],
  );

  /**
   * Paste: forced to plain text. This keeps a paste of previously copied content as the
   * transformed text (e.g. ids), and prevents chip HTML from being pasted back as dead markup.
   */
  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (text === '' || !editor || !selection || selection.rangeCount === 0) {
        return;
      }
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        return;
      }
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      handleInput();
    },
    [handleInput],
  );

  /** Opens the dropdown at the current caret when the trigger key is pressed. */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || event.nativeEvent.isComposing) {
        return;
      }
      // Undo/redo is handled here, over the value history. The native stack cannot serve this
      // component (structural changes remount the surface and chips are inserted via direct DOM
      // manipulation), so the browser default is suppressed rather than left to fight ours.
      const isUndoModifier = event.metaKey || event.ctrlKey;
      if (isUndoModifier && (event.key === 'z' || event.key === 'Z')) {
        event.preventDefault();
        if (event.shiftKey) {
          redoRef.current();
        } else {
          undoRef.current();
        }
        return;
      }
      if (isUndoModifier && !event.shiftKey && (event.key === 'y' || event.key === 'Y')) {
        event.preventDefault();
        redoRef.current();
        return;
      }
      if (event.key === triggerKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // The trigger key itself is swallowed — it only opens the dropdown, it is never typed.
        event.preventDefault();
        const wrapper = wrapperRef.current;
        const editor = editorRef.current;
        if (!wrapper || !editor) {
          return;
        }
        const selection = window.getSelection();
        insertRangeRef.current =
          selection && selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).startContainer) ?
            selection.getRangeAt(0).cloneRange()
          : null;
        setDropdownState({ mode: { type: 'insert' }, anchorPosition: getCaretPositionInWrapper(wrapper, editor) });
      }
    },
    [disabled, triggerKey],
  );

  /** Dropdown selection (click or Enter): insert a new chip at the caret, or swap an edited chip's item. */
  const handleDropdownSelect = useCallback(
    (item: T) => {
      const editor = editorRef.current;
      const current = dropdownState;
      if (!editor || !current) {
        return;
      }
      setDropdownState(null);

      // showOriginal means "show me the underlying text": a pick inserts the item's raw text
      // (itemTransformFunction) at the caret rather than a chip, so nothing on screen is a chip
      // while the flag is on. Inserted as a text node and re-parsed, which keeps the caret right
      // after the inserted text instead of re-mounting the surface.
      if (showOriginal) {
        const insertedText = resolveItemText(item);
        const range = insertRangeRef.current;
        const textNode = document.createTextNode(insertedText);
        if (range && editor.contains(range.commonAncestorContainer)) {
          range.deleteContents();
          range.insertNode(textNode);
          placeCaretAfterNode(textNode);
        } else {
          editor.appendChild(textNode);
          placeCaretAtEnd(editor);
        }
        editor.focus();
        // Bracket the emit so this insertion is its own undo entry, never coalesced with the
        // typing before or after it.
        lastRecordWasTypingRef.current = false;
        handleInputRef.current();
        lastRecordWasTypingRef.current = false;
        insertRangeRef.current = null;
        return;
      }

      if (current.mode.type === 'edit') {
        const {chipId} = current.mode;
        const nextChipItems = new Map(chipItemsRef.current);
        nextChipItems.set(chipId, item);
        chipItemsRef.current = nextChipItems;
        const segments = parseEditorDom(editor, nextChipItems);
        commitStructural(segments, { type: 'after-chip', chipId: chipId });
        return;
      }

      // Insert mode: drop a marker element at the saved caret range, parse the DOM with the
      // marker standing in for the new chip, then re-mount from the parsed segments.
      const chipId = generateChipId();
      const marker = document.createElement('span');
      marker.setAttribute(AUTOCOMPLETE_INSERT_MARKER_ATTRIBUTE, 'true');
      const range = insertRangeRef.current;
      if (range && editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(marker);
      } else {
        editor.appendChild(marker);
      }
      const segments = parseEditorDom(editor, chipItemsRef.current, { chipId: chipId, item: item });
      marker.remove();

      // No trailing space is added: the inserted content is exactly what was picked, matching what
      // showOriginal mode does. The caret lands after the chip either way — see the caret-restore
      // layout effect, which falls back to placeCaretAfterNode when no text node follows.
      commitStructural(segments, { type: 'after-chip', chipId: chipId });
      insertRangeRef.current = null;
    },
    [dropdownState, commitStructural, showOriginal, resolveItemText],
  );

  /** Escape / outside click: close the dropdown and hand focus back to the text area. */
  const handleDropdownClose = useCallback(() => {
    setDropdownState(null);
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.focus();
    const range = insertRangeRef.current;
    if (range && editor.contains(range.commonAncestorContainer)) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    insertRangeRef.current = null;
  }, []);

  /** Chip menu "Edit": re-open the dropdown anchored at the chip to pick a replacement item. */
  const handleStartEditChip = useCallback((chipId: string) => {
    const wrapper = wrapperRef.current;
    const editor = editorRef.current;
    if (!wrapper || !editor) {
      return;
    }
    const chipElement = editor.querySelector(`[${AUTOCOMPLETE_CHIP_ID_ATTRIBUTE}="${chipId}"]`);
    if (!(chipElement instanceof HTMLElement)) {
      return;
    }
    setDropdownState({ mode: { type: 'edit', chipId: chipId }, anchorPosition: getElementPositionInWrapper(wrapper, chipElement) });
  }, []);

  /** Chip menu "Show details": open the shared details dialog for the chip's item. */
  const handleShowChipDetails = useCallback((chipId: string) => {
    setDetailsItem(chipItemsRef.current.get(chipId) ?? null);
  }, []);

  /**
   * Clear button: wipe everything (typed text and chips) and emit the empty value. The controlled
   * parent (react-hook-form) and the uncontrolled wrapper's `onChange` both receive it through the
   * normal change callback, so neither needs to special-case clearing.
   */
  const handleClear = useCallback(() => {
    setDropdownState(null);
    setDetailsItem(null);
    insertRangeRef.current = null;
    commitStructural([], { type: 'end' });
  }, [commitStructural]);

  /** Chip menu "Remove": drop the chip from the value. */
  const handleRemoveChip = useCallback(
    (chipId: string) => {
      const editor = editorRef.current;
      if (!editor) {
        return;
      }
      const nextChipItems = new Map(chipItemsRef.current);
      nextChipItems.delete(chipId);
      chipItemsRef.current = nextChipItems;
      const segments = parseEditorDom(editor, nextChipItems);
      commitStructural(segments, { type: 'end' });
    },
    [commitStructural],
  );

  const editorChildren = render.segments.map((segment: AutoCompleteSegment<T>, index: number) => {
    if (segment.kind === 'text') {
      return <Fragment key={ `text-${index}` }>{ segment.text }</Fragment>;
    }
    return (
      <AutoCompleteItemChip<T>
        key={ segment.chipId }
        chipId={ segment.chipId }
        item={ segment.item }
        // showOriginal means "show me the underlying value": the chip is labelled with the text that
        // would be sent to the server (itemTransformFunction) instead of the friendly display text.
        label={ showOriginal ? resolveItemText(segment.item) : itemDisplayFunction(segment.item) }
        serverText={ resolveItemText(segment.item) }
        isItemDisabled={ isItemDisabled?.(segment.item) ?? false }
        className={ chipClassName }
        disabled={ disabled }
        menuItems={ resolvedChipMenuItems }
        onStartEdit={ handleStartEditChip }
        onShowDetails={ handleShowChipDetails }
        onRemove={ handleRemoveChip }
      />
    );
  });

  return (
    <div ref={ wrapperRef } className="relative w-full">
      { /* key={render.key}: the surface is re-mounted only on structural changes, never on plain typing. */ }
      <div
        key={ render.key }
        ref={ editorRef }
        id={ id }
        role="textbox"
        aria-multiline="true"
        aria-disabled={ disabled }
        contentEditable={ !disabled }
        suppressContentEditableWarning
        data-placeholder={ placeholder ?? '' }
        data-empty={ String(isAutoCompleteValueEmpty(render.segments)) }
        className={ cn(
          `
            peer relative min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base break-words
            whitespace-pre-wrap shadow-xs transition-[color,box-shadow] outline-none
            focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
            aria-disabled:cursor-not-allowed aria-disabled:opacity-50
            data-[empty=true]:before:pointer-events-none data-[empty=true]:before:absolute data-[empty=true]:before:top-2
            data-[empty=true]:before:left-3 data-[empty=true]:before:text-muted-foreground/50
            data-[empty=true]:before:content-[attr(data-placeholder)]
            md:text-sm
            dark:bg-input/30
          `,
          // Keep content clear of the clear button in the top right corner.
          { 'pr-10': showClearButton && !disabled },
          className,
        ) }
        onInput={ handleInput }
        onKeyDown={ handleKeyDown }
        onCopy={ handleCopy }
        onCut={ handleCut }
        onPaste={ handlePaste }
        onBlur={ handleBlur }
      >
        { editorChildren }
      </div>

      { /* Rendered as a sibling right after the editor so the `peer-data-[empty=true]` rule can hide
           it while there is nothing to clear. Emptiness is driven by the editor's `data-empty`
           attribute, which `handleInput` keeps live without re-rendering (and therefore without
           disturbing the caret). */ }
      { showClearButton && !disabled ?
        <AutoCompleteClearButton className={ cn('peer-data-[empty=true]:hidden', clearButtonClassName) } onClear={ handleClear } />
      : null }

      { dropdownState ?
        <AutoCompleteDropdown<T>
          anchorPosition={ dropdownState.anchorPosition }
          items={ items }
          filterFunction={ filterFunction }
          renderItemOption={ renderItemOption ?? ((item: T) => itemDisplayFunction(item)) }
          isItemDisabled={ isItemDisabled }
          selectItemClassName={ selectItemClassName }
          searchPlaceholder={ searchPlaceholder }
          emptyText={ emptyText }
          onSelect={ handleDropdownSelect }
          onClose={ handleDropdownClose }
        />
      : null }

      <AutoCompleteItemDetailsDialog<T>
        item={ detailsItem }
        onClose={ () => setDetailsItem(null) }
        renderItemDetails={ renderItemDetails }
        title={ detailsDialogTitle }
        description="Everything about this autocompleted item."
      />
    </div>
  );
}
