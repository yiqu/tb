import { ReadOnlySegment } from './autocompletable-textarea-read-only.models';

/**
 * Splits a display string into plain-text runs and regex matches.
 *
 * The regex the caller hands us is never used directly: a fresh copy is built with the `g` flag so
 * (a) a caller-held regex never has its `lastIndex` mutated by us, and (b) a non-global regex still
 * yields every match instead of only the first. Zero-length matches are stepped over so a
 * pathological pattern cannot spin forever.
 *
 * Each match is resolved to an item through `resolveItem`; an unresolvable id still becomes a
 * segment (with `item: undefined`) so the UI can flag it rather than silently showing raw text.
 */
export const splitTextByItemRegex = <T>(
  text: string,
  itemRegex: RegExp,
  resolveItem?: (matchedText: string) => T | undefined,
): ReadOnlySegment<T>[] => {
  const segments: ReadOnlySegment<T>[] = [];
  if (text === '') {
    return segments;
  }

  const scanner = new RegExp(itemRegex.source, itemRegex.flags.includes('g') ? itemRegex.flags : `${itemRegex.flags}g`);
  let sliceStart = 0;
  let match = scanner.exec(text);

  while (match !== null) {
    if (match[0] === '') {
      scanner.lastIndex = scanner.lastIndex + 1;
      match = scanner.exec(text);
      continue;
    }
    if (match.index > sliceStart) {
      segments.push({ kind: 'text', text: text.slice(sliceStart, match.index) });
    }
    segments.push({ kind: 'match', matchedText: match[0], item: resolveItem?.(match[0]) });
    sliceStart = match.index + match[0].length;
    match = scanner.exec(text);
  }

  if (sliceStart < text.length) {
    segments.push({ kind: 'text', text: text.slice(sliceStart) });
  }

  return segments;
};
