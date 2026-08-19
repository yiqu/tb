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

/**
 * Reads the contentEditable DOM back into segments. This is the bridge between free typing
 * (which the browser owns) and the React value:
 * - text nodes become text segments
 * - elements tagged with the chip attribute become item segments (resolved through `chipItems`;
 *   a chip deleted by the map simply disappears from the value)
 * - a marker element (inserted at the caret right before committing a selection) becomes the
 *   `pendingInsert` item segment
 * - <br> and block elements become newlines
 */
export const parseEditorDom = <T>(
  root: HTMLElement,
  chipItems: ReadonlyMap<string, T>,
  pendingInsert?: PendingChipInsert<T>,
): AutoCompleteValue<T> => {
  const segments: AutoCompleteValue<T> = [];

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

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
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

  return segments;
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
