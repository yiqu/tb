import { Ref } from 'react';

import Typography from '@/components/typography/Typography';

interface PixelPalsNameTagProps {
  ref: Ref<HTMLDivElement>;
  name: string;
}

/**
 * The pet's name in a small tag above it, shown while the pointer is on the pet or it has keyboard focus, and hidden
 * while it talks. `PixelPalsEngine` keeps it inside Pixel Pals. Styles are in `styles/pixel-pals.css`.
 */
export default function PixelPalsNameTag({ ref, name }: PixelPalsNameTagProps) {
  return (
    <div ref={ ref } className="pixel-pals-name-tag" aria-hidden="true">
      { /* the tag's pixel font and size come from its class */ }
      <Typography as="span" variant="span0" className="font-[inherit] text-[length:inherit] leading-[inherit]">
        { name }
      </Typography>
    </div>
  );
}
