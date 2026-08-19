'use client';

import { XIcon } from 'lucide-react';
import { MouseEvent } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AutoCompleteClearButtonProps {
  /** Tailwind classes to reposition or restyle the button. */
  className?: string;
  /** Accessible label / tooltip text. */
  label?: string;
  onClear: () => void;
}

/**
 * Clear ("X") button pinned to the top right corner of the text area. Wipes all content —
 * typed text and autocompleted items alike.
 *
 * It is rendered as a sibling of the editable surface (never inside it), so it is not part of the
 * contentEditable content and cannot be typed over or deleted by the browser.
 */
export default function AutoCompleteClearButton({ className, label = 'Clear text', onClear }: AutoCompleteClearButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={ label }
      title={ label }
      className={ cn('absolute top-1 right-1 z-10 text-muted-foreground', className) }
      // Prevent the default mousedown focus shift: the editor keeps focus, which both avoids a
      // pointless blur pass over content that is about to be wiped and leaves the user ready to type.
      onMouseDown={ (event: MouseEvent<HTMLButtonElement>) => event.preventDefault() }
      onClick={ onClear }
    >
      <XIcon />
    </Button>
  );
}
