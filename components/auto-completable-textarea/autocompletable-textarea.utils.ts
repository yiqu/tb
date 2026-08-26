import isEqual from 'lodash/isEqual';

import { AutoCompleteValue, AutoCompleteSegment, AutoCompleteAnchorPosition } from './autocompletable-textarea.models';

/** DOM attribute that marks a chip wrapper element inside the editable surface. */
export const AUTOCOMPLETE_CHIP_ID_ATTRIBUTE = 'data-autocomplete-chip-id';

/** DOM attribute of the temporary marker element used to find the insert position of a new chip. */
export const AUTOCOMPLETE_INSERT_MARKER_ATTRIBUTE = 'data-autocomplete-insert-marker';

let chipIdCounter = 0;

/**
 * Generates a unique id for a chip instance. Uniqueness is only needed within one editor,
 * a simple counter + random suffix is plenty.
 */
export const generateChipId = (): string => {
  chipIdCounter = chipIdCounter + 1;
  return `ac-chip-${chipIdCounter}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Flattens the value into a plain string, using `itemToText` for every autocompleted item.
 * Pass the display function to get what the user sees, or a transform function (e.g. `item => item.id`)
 * to build the string that is actually submitted to the server.
 */
export const autoCompleteValueToText = <T>(value: AutoCompleteValue<T>, itemToText: (item: T) => string): string => {
  return value
    .map((segment: AutoCompleteSegment<T>) => {
      return segment.kind === 'text' ? segment.text : itemToText(segment.item);
    })
    .join('');
};

/**
 * True when the value contains no visible text and no autocompleted items (newlines the browser
 * leaves behind in an emptied contentEditable are ignored). Used to toggle the placeholder.
 */
export const isAutoCompleteValueEmpty = <T>(value: AutoCompleteValue<T>): boolean => {
  return value.every((segment: AutoCompleteSegment<T>) => segment.kind === 'text' && segment.text.replaceAll('\n', '') === '');
};

/**
 * Collects chipId -> item for every item segment. The editor keeps this map in a ref so it can
 * resolve chips back to their items when re-parsing the contentEditable DOM.
 */
export const collectChipItems = <T>(value: AutoCompleteValue<T>): Map<string, T> => {
  const map = new Map<string, T>();
  for (const segment of value) {
    if (segment.kind === 'item') {
      map.set(segment.chipId, segment.item);
    }
  }
  return map;
};

/**
 * Structural equality check used to avoid re-mounting the editable surface (and losing the caret)
 * when a parent hands the same content back under a new reference. react-hook-form deep-clones
 * values on change, so items must be compared by content (lodash isEqual), not by reference.
 */
export const areAutoCompleteValuesEqual = <T>(a: AutoCompleteValue<T>, b: AutoCompleteValue<T>): boolean => {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((segment: AutoCompleteSegment<T>, index: number) => {
    const other = b[index];
    if (segment.kind === 'text') {
      return other.kind === 'text' && other.text === segment.text;
    }
    return other.kind === 'item' && other.chipId === segment.chipId && (other.item === segment.item || isEqual(other.item, segment.item));
  });
};

interface PendingChipInsert<T> {
  chipId: string;
  item: T;
}

/** A caret position inside the contentEditable DOM: a text node and an offset into it. */
export interface EditorDomCaret {
  node: Node;
  offset: number;
}

/** The same caret expressed in VALUE space: which segment it sits in, and how far into it. */
export interface SegmentCaretPosition {
  segmentIndex: number;
  offset: number;
}

interface ReadEditorDomOptions<T> {
  pendingInsert?: PendingChipInsert<T>;
  /** When given (and found during the walk), the caret is reported back in segment space. */
  caret?: EditorDomCaret | null;
}

interface ReadEditorDomResult<T> {
  segments: AutoCompleteValue<T>;
  caret: SegmentCaretPosition | null;
}

/**
 * The current collapsed caret inside `editor`, expressed against a text node.
 *
 * A caret is not always anchored to a text node: right after a programmatic insert (paste) the
 * range sits in the PARENT, addressed by child index. Those are resolved to the end of the text
 * node before the caret, or the start of the one after it. Returns null when there is no usable
 * caret at all (no selection, a non-collapsed one, a caret outside the editor, or one with no
 * adjacent text node — e.g. between two chips). Callers treat null as "caret unknown" and skip
 * the work that depends on it.
 */
export const getEditorDomCaret = (editor: HTMLElement): EditorDomCaret | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const container = range.startContainer;
  if (!editor.contains(container)) {
    return null;
  }
  if (container.nodeType === Node.TEXT_NODE) {
    return { node: container, offset: range.startOffset };
  }
  const before = container.childNodes[range.startOffset - 1];
  if (before && before.nodeType === Node.TEXT_NODE) {
    return { node: before, offset: (before.textContent ?? '').length };
  }
  const after = container.childNodes[range.startOffset];
  if (after && after.nodeType === Node.TEXT_NODE) {
    return { node: after, offset: 0 };
  }
  return null;
};

/**
 * Reads the contentEditable DOM back into segments, optionally translating a DOM caret into
 * segment space along the way. This is the bridge between free typing (which the browser owns)
 * and the React value:
 * - text nodes become text segments
 * - elements tagged with the chip attribute become item segments (resolved through `chipItems`;
 *   a chip deleted by the map simply disappears from the value)
 * - a marker element (inserted at the caret right before committing a selection) becomes the
 *   `pendingInsert` item segment
 * - <br> and block elements become newlines
 *
 * Most callers only want the segments and use `parseEditorDom` below; the caret translation exists
 * for the typing-time id scan, which must know where the user is before it converts anything.
 */
export const readEditorDom = <T>(
  root: HTMLElement | DocumentFragment,
  chipItems: ReadonlyMap<string, T>,
  options: ReadEditorDomOptions<T> = {},
): ReadEditorDomResult<T> => {
  const segments: AutoCompleteValue<T> = [];
  const pendingInsert = options.pendingInsert;
  const caret = options.caret ?? null;
  // Held in an object rather than a bare `let`: it is only ever written from inside the walk
  // callbacks, which TypeScript's control-flow analysis cannot see, so a plain variable would be
  // narrowed to `null` at the checks below.
  const caretHolder: { position: SegmentCaretPosition | null } = { position: null };

  const pushText = (text: string) => {
    if (text === '') {
      return;
    }
    const last = segments[segments.length - 1];
    if (last && last.kind === 'text') {
      last.text = last.text + text;
      return;
    }
    segments.push({ kind: 'text', text: text });
  };

  /**
   * Records where the caret lands, called right BEFORE the text node holding it is pushed: the
   * caret's offset within that node is offset into whatever text segment the node is about to
   * extend (adjacent text nodes are merged into a single segment).
   */
  const recordCaret = (offsetInNode: number) => {
    const last = segments[segments.length - 1];
    if (last && last.kind === 'text') {
      caretHolder.position = { segmentIndex: segments.length - 1, offset: last.text.length + offsetInNode };
      return;
    }
    caretHolder.position = { segmentIndex: segments.length, offset: offsetInNode };
  };

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (caret && caret.node === node) {
        recordCaret(caret.offset);
      }
      pushText(node.textContent ?? '');
      return;
    }
    if (!(node instanceof HTMLElement)) {
      return;
    }
    if (node.hasAttribute(AUTOCOMPLETE_INSERT_MARKER_ATTRIBUTE)) {
      if (pendingInsert) {
        segments.push({ kind: 'item', chipId: pendingInsert.chipId, item: pendingInsert.item });
      }
      return;
    }
    const chipId = node.getAttribute(AUTOCOMPLETE_CHIP_ID_ATTRIBUTE);
    if (chipId) {
      const item = chipItems.get(chipId);
      if (item !== undefined) {
        segments.push({ kind: 'item', chipId: chipId, item: item });
      }
      return;
    }
    if (node.tagName === 'BR') {
      pushText('\n');
      return;
    }
    // Browsers wrap new lines in block elements (div/p) inside contentEditable.
    const isBlock = node.tagName === 'DIV' || node.tagName === 'P';
    if (isBlock && segments.length > 0) {
      pushText('\n');
    }
    node.childNodes.forEach((child: Node) => walk(child));
  };

  root.childNodes.forEach((child: Node) => walk(child));

  // An empty text node holding the caret pushes nothing, which can leave the recorded index one
  // past the end. Pin it to the end of the last segment instead of returning something invalid.
  if (caretHolder.position !== null && caretHolder.position.segmentIndex >= segments.length) {
    const lastIndex = segments.length - 1;
    const last = segments[lastIndex];
    caretHolder.position =
      last && last.kind === 'text' ? { segmentIndex: lastIndex, offset: last.text.length } : { segmentIndex: Math.max(lastIndex, 0), offset: 0 };
  }

  return { segments: segments, caret: caretHolder.position };
};

/** Segments only — the shape almost every caller wants. See `readEditorDom`. */
export const parseEditorDom = <T>(
  root: HTMLElement | DocumentFragment,
  chipItems: ReadonlyMap<string, T>,
  pendingInsert?: PendingChipInsert<T>,
): AutoCompleteValue<T> => {
  return readEditorDom(root, chipItems, { pendingInsert: pendingInsert }).segments;
};

/**
 * The inverse of `hydrateAutoCompleteValue`: replaces every autocompleted item segment with its
 * plain text, merging it into the surrounding runs. Used when `showOriginal` is switched ON, so
 * existing chips collapse back into the raw text they represent.
 *
 * Lossless for the submitted string: pass the same `itemToText` used to serialize the value
 * (normally `itemTransformFunction`) and `autoCompleteValueToText` yields an identical result
 * before and after. Returns the original reference when there is nothing to flatten.
 */
export const flattenAutoCompleteValue = <T>(value: AutoCompleteValue<T>, itemToText: (item: T) => string): AutoCompleteValue<T> => {
  if (!value.some((segment: AutoCompleteSegment<T>) => segment.kind === 'item')) {
    return value;
  }

  const flattened: AutoCompleteValue<T> = [];

  const pushText = (text: string) => {
    if (text === '') {
      return;
    }
    const last = flattened[flattened.length - 1];
    if (last && last.kind === 'text') {
      last.text = last.text + text;
      return;
    }
    flattened.push({ kind: 'text', text: text });
  };

  for (const segment of value) {
    pushText(segment.kind === 'text' ? segment.text : itemToText(segment.item));
  }

  return flattened;
};

/**
 * Scans the value's plain-text segments for item ids and swaps every match into an autocompleted
 * item segment (chip). Used to hydrate an incoming value (e.g. an initial blob of text that
 * contains ids saved earlier by `autoCompleteValueToText` + the transform function).
 *
 * Matching is pattern-based, the same way the read-only display works: `itemRegex` finds candidate
 * text and `resolveItem` maps it to an item. A match that resolves to nothing is LEFT AS TEXT —
 * this component never shows a chip for an item it does not have.
 *
 * The caller's regex is never used directly: a fresh `g`-flagged copy is built per scan, so a
 * caller-held regex never has its `lastIndex` mutated and a non-global one still yields every
 * match. Zero-length matches are stepped over so a pathological pattern cannot spin forever.
 *
 * Returns the original value reference when nothing matched, which callers rely on to skip work.
 */
export const hydrateAutoCompleteValue = <T>(
  value: AutoCompleteValue<T>,
  itemRegex: RegExp,
  resolveItem: (matchedText: string) => T | undefined,
  protectedCaret?: SegmentCaretPosition | null,
): AutoCompleteValue<T> => {
  const hydrated: AutoCompleteValue<T> = [];
  let didHydrate = false;

  const pushText = (text: string) => {
    if (text === '') {
      return;
    }
    const last = hydrated[hydrated.length - 1];
    if (last && last.kind === 'text') {
      last.text = last.text + text;
      return;
    }
    hydrated.push({ kind: 'text', text: text });
  };

  value.forEach((segment: AutoCompleteSegment<T>, segmentIndex: number) => {
    if (segment.kind === 'item') {
      hydrated.push(segment);
      return;
    }
    const text = segment.text;
    const caretInSegment = protectedCaret && protectedCaret.segmentIndex === segmentIndex ? protectedCaret.offset : null;
    const scanner = new RegExp(itemRegex.source, itemRegex.flags.includes('g') ? itemRegex.flags : `${itemRegex.flags}g`);
    let sliceStart = 0;
    let match = scanner.exec(text);

    while (match !== null) {
      if (match[0] === '') {
        scanner.lastIndex = scanner.lastIndex + 1;
        match = scanner.exec(text);
        continue;
      }
      // The match the caret is sitting in (or against) is still being typed: converting it would
      // yank the text out from under the cursor, and the id may not be finished yet. Left as text —
      // the next keystroke that moves the caret off it, or blurring, converts it.
      if (caretInSegment !== null && caretInSegment >= match.index && caretInSegment <= match.index + match[0].length) {
        match = scanner.exec(text);
        continue;
      }
      const item = resolveItem(match[0]);
      if (item === undefined) {
        // Looks like an id but is not one of ours: leave it exactly as the user typed it.
        match = scanner.exec(text);
        continue;
      }
      pushText(text.slice(sliceStart, match.index));
      hydrated.push({ kind: 'item', chipId: generateChipId(), item: item });
      didHydrate = true;
      sliceStart = match.index + match[0].length;
      match = scanner.exec(text);
    }

    pushText(text.slice(sliceStart));
  });

  return didHydrate ? hydrated : value;
};

/**
 * Length of a segment in "serialized text" space — what `autoCompleteValueToText` would emit for it.
 * Hydration is length-preserving in this space (a chip is only ever created from text equal to its
 * own serialization), which is what lets a caret offset survive the conversion.
 */
const getSegmentTextLength = <T>(segment: AutoCompleteSegment<T>, itemToText: (item: T) => string): number => {
  return segment.kind === 'text' ? segment.text.length : itemToText(segment.item).length;
};

/** Flattens a segment-space caret into an absolute character offset over the whole value. */
export const getAbsoluteTextOffset = <T>(
  value: AutoCompleteValue<T>,
  caret: SegmentCaretPosition,
  itemToText: (item: T) => string,
): number => {
  let offset = 0;
  for (let index = 0; index < caret.segmentIndex && index < value.length; index = index + 1) {
    offset = offset + getSegmentTextLength(value[index], itemToText);
  }
  return offset + caret.offset;
};

/**
 * Puts the caret at an absolute character offset (the space `getAbsoluteTextOffset` measures in)
 * by walking the freshly re-mounted DOM the same way `readEditorDom` walks it. Chips are opaque:
 * an offset landing inside one puts the caret just after it. Returns false when the offset runs
 * past the end of the content, so the caller can fall back to placing the caret at the end.
 */
export const placeCaretAtAbsoluteTextOffset = <T>(
  root: HTMLElement,
  chipItems: ReadonlyMap<string, T>,
  itemToText: (item: T) => string,
  targetOffset: number,
): boolean => {
  let consumed = 0;
  let placed = false;

  const walk = (node: Node): boolean => {
    if (node.nodeType === Node.TEXT_NODE) {
      const length = (node.textContent ?? '').length;
      if (consumed + length >= targetOffset) {
        placeCaretAtTextOffset(node, targetOffset - consumed);
        placed = true;
        return true;
      }
      consumed = consumed + length;
      return false;
    }
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const chipId = node.getAttribute(AUTOCOMPLETE_CHIP_ID_ATTRIBUTE);
    if (chipId) {
      const item = chipItems.get(chipId);
      if (item === undefined) {
        return false;
      }
      const length = itemToText(item).length;
      if (consumed + length >= targetOffset) {
        placeCaretAfterNode(node);
        placed = true;
        return true;
      }
      consumed = consumed + length;
      return false;
    }
    if (node.tagName === 'BR') {
      consumed = consumed + 1;
      return false;
    }
    const isBlock = node.tagName === 'DIV' || node.tagName === 'P';
    if (isBlock && consumed > 0) {
      consumed = consumed + 1;
    }
    for (const child of Array.from(node.childNodes)) {
      if (walk(child)) {
        return true;
      }
    }
    return false;
  };

  for (const child of Array.from(root.childNodes)) {
    if (walk(child)) {
      break;
    }
  }

  return placed;
};

/**
 * Position of the current text caret relative to `wrapper`, used to anchor the dropdown
 * right at the typing cursor. Falls back to the top-left of `editor`'s padding box when the
 * caret rect is unavailable (e.g. empty editor).
 */
export const getCaretPositionInWrapper = (wrapper: HTMLElement, editor: HTMLElement): AutoCompleteAnchorPosition => {
  const wrapperRect = wrapper.getBoundingClientRect();
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).startContainer)) {
    const rect = selection.getRangeAt(0).cloneRange().getBoundingClientRect();
    if (rect.width !== 0 || rect.height !== 0) {
      return { left: rect.left - wrapperRect.left, top: rect.top - wrapperRect.top, height: rect.height || 20 };
    }
  }

  const editorRect = editor.getBoundingClientRect();
  return { left: editorRect.left - wrapperRect.left + 12, top: editorRect.top - wrapperRect.top + 8, height: 20 };
};

/**
 * Position of an element (e.g. a chip being edited) relative to `wrapper`, used to anchor the
 * dropdown at that element instead of the caret.
 */
export const getElementPositionInWrapper = (wrapper: HTMLElement, element: HTMLElement): AutoCompleteAnchorPosition => {
  const wrapperRect = wrapper.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return { left: rect.left - wrapperRect.left, top: rect.top - wrapperRect.top, height: rect.height };
};

/**
 * Places the caret right after `node` and focuses the editor. Used after inserting/replacing a chip.
 */
export const placeCaretAfterNode = (node: Node) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Places the caret `offset` characters into the given text node.
 */
export const placeCaretAtTextOffset = (textNode: Node, offset: number) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.setStart(textNode, offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Places the caret at the very end of the editor content.
 */
export const placeCaretAtEnd = (editor: HTMLElement) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};
