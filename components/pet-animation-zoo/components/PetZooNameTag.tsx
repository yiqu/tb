import { Ref } from 'react';

interface PetZooNameTagProps {
  ref: Ref<HTMLDivElement>;
  name: string;
}

/**
 * The pet's name in a small tag above it, shown while the pointer is on the pet or it has keyboard focus, and hidden
 * while it talks. `PetZooEngine` keeps it inside the zoo. Styles are in `styles/pet-zoo.css`.
 */
export default function PetZooNameTag({ ref, name }: PetZooNameTagProps) {
  return (
    <div ref={ ref } className="pet-zoo-name-tag" aria-hidden="true">
      { name }
    </div>
  );
}
