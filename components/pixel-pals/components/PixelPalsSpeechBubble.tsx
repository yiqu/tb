import { Ref } from 'react';

interface PixelPalsSpeechBubbleProps {
  ref: Ref<HTMLDivElement>;
}

/**
 * The bubble above a pet. It starts hidden and empty: `PixelPalsEngine` writes its text, shows it and keeps it
 * inside Pixel Pals, so a bubble never causes a React render. Styles are in `styles/pixel-pals.css`.
 */
export default function PixelPalsSpeechBubble({ ref }: PixelPalsSpeechBubbleProps) {
  return <div ref={ ref } className="pixel-pals-bubble" aria-hidden="true" />;
}
