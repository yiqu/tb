/**
 * Utilities shared by the editable (`auto-completable-textarea`) and read-only
 * (`auto-completable-textarea-read-only`) autocomplete components.
 *
 * Only genuinely identical, dependency-free helpers belong here. Anything that differs between the
 * two — DOM parsing, id hydration, regex scanning — stays in that component's own utils file.
 */

/**
 * Writes text to the clipboard. Kept UI-free (no toast) so the components stay droppable into any
 * codebase — user feedback belongs to the chip menu defaults, which are swappable.
 *
 * Uses the async Clipboard API when available. A rejection (denied permission, unfocused document,
 * blocked context) falls through to a hidden textarea + execCommand rather than failing the copy
 * outright; anything that fallback throws is left to propagate so the caller sees a real failure.
 */
export const copyTextToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy path below.
    }
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};
