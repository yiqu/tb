'use client';

import { useRef, useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/components/auto-completable-shared/autocompletable-shared.utils';

/** How long the button stays in its "Copied" state before flipping back. */
const COPIED_FEEDBACK_MS = 1500;

interface AutoCompleteReadOnlyCopyButtonProps {
  /** Returns the text to copy. A callback, so the string is only built when the button is pressed. */
  getCopyText: () => string;
  /** Tailwind classes to reposition or restyle the button. */
  className?: string;
  /** Accessible label / tooltip text. */
  label?: string;
}

/**
 * Copy button pinned to the top right corner of the read-only display. Copies the whole rendered
 * content as one string, with every chip serialized through `itemCopyContentFunction`.
 *
 * Feedback is a transient icon swap rather than a toast: the button is a fixed part of the
 * component (unlike the chip menu entries, which are swappable defaults), so it stays free of any
 * notification library the host app may or may not use.
 */
export default function AutoCompleteReadOnlyCopyButton({
  getCopyText,
  className,
  label = 'Copy text',
}: AutoCompleteReadOnlyCopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  // A copy landing right before unmount must not leave a timer behind to set state afterwards.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await copyTextToClipboard(getCopyText());
    setCopied(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={ copied ? 'Copied' : label }
      title={ copied ? 'Copied' : label }
      className={ cn('absolute top-0 right-0 z-10 text-muted-foreground', className) }
      onClick={ handleCopy }
    >
      { copied ?
        <CheckIcon className="text-green-600" />
      : <CopyIcon /> }
    </Button>
  );
}
