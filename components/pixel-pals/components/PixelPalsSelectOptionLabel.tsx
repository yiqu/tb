import { ReactNode } from 'react';

import Typography from '@/components/typography/Typography';

interface PixelPalsSelectOptionLabelProps {
  label: string;
  /** Shown before the label, e.g. the pet's sprite. */
  icon?: ReactNode;
  /** Shown after the label, e.g. a lock on a locked pet. */
  trailing?: ReactNode;
}

/** One dropdown option: an icon, the label and an optional trailing mark. */
export default function PixelPalsSelectOptionLabel({ label, icon, trailing }: PixelPalsSelectOptionLabelProps) {
  return (
    // a span, not RowStack: Radix puts this inside its item text span and copies it into the trigger
    <span className="flex flex-row items-center gap-2">
      { icon }
      <Typography as="span" variant="body1">
        { label }
      </Typography>
      { trailing }
    </span>
  );
}
