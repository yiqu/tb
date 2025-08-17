import { FireworksBackground } from '@/components/animate-ui/backgrounds/fireworks';

export default function Fireworks({ population = 8 }: { population?: number }) {
  if (population < 0) return null;
  return (
    <FireworksBackground
      className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl"
      population={ population }
      fireworkSpeed={ { min: 8, max: 12 } }
    />
  );
}
