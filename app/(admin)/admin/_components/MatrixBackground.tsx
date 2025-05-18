import { connection } from 'next/server';

import LetterGlitch from '@/components/reactbits/Backgrounds/LetterGlitch/LetterGlitch';

export default async function MatrixBackground() {
  await connection();
  return (
    <LetterGlitch
      glitchSpeed={ 50 }
      centerVignette={ true }
      outerVignette={ false }
      smooth={ true }
      glitchColors={ [
        '#00FF41', // Bright green (primary Matrix color)
        '#0D0208', // Almost black
        '#003B00', // Dark green
        '#008F11', // Medium green
        '#00FF41', // Bright green again
        '#122601', // Very dark green
        '#03A062', // Teal-green
        '#00FF00', // Pure green
        '#5CFF5C', // Light green
        '#0D260D', // Very dark green with hint of brightness
      ] }
    />
  );
}
