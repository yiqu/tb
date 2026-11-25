import { Ref } from 'react';

interface PetZooSpeechBubbleProps {
  ref: Ref<HTMLDivElement>;
}

/**
 * The bubble above a pet. It starts hidden and empty: `PetZooEngine` writes its text, shows it and keeps it
 * inside the zoo, so a bubble never causes a React render. Styles are in `styles/pet-zoo.css`.
 */
export default function PetZooSpeechBubble({ ref }: PetZooSpeechBubbleProps) {
  return <div ref={ ref } className="pet-zoo-bubble" aria-hidden="true" />;
}
