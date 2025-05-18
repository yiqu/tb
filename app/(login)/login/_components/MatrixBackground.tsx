import LetterGlitch from '@/components/reactbits/Backgrounds/LetterGlitch/LetterGlitch';

export default function MatrixBackground({ isWrong }: { isWrong?: boolean | null }) {
  return (
    <LetterGlitch
      glitchSpeed={ 50 }
      centerVignette={ true }
      outerVignette={ false }
      smooth={ true }
      glitchColors={
        isWrong === null ? defaultColors
        : isWrong ?
          incorrectColors
        : defaultColors
      }
      key={ `${isWrong}` }
    />
  );
}

const defaultColors = [
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
];

const incorrectColors = [
  '#FF0000', // Bright red (primary Matrix color)
  '#0D0208', // Almost black
  '#3B0000', // Dark red
  '#8F1111', // Medium red
];
