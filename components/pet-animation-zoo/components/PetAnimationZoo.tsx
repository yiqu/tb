'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';

import PetZooWorld from './PetZooWorld';
import PetZooToolbar from './PetZooToolbar';
import { usePetZooEngine } from '../hooks/usePetZooEngine';
import PetZooHeightResizeHandle from './PetZooHeightResizeHandle';
import { usePetZooHeightResize } from '../hooks/usePetZooHeightResize';
import { PET_ZOO_LABELS } from '../constants/pet-zoo-labels.constants';
import { usePetZooStoreHydration } from '../hooks/usePetZooStoreHydration';
import { PET_ZOO_DEFAULT_HEIGHT_PX } from '../constants/pet-zoo.constants';

import '../styles/pet-zoo.css';

interface PetAnimationZooProps {
  /**
   * The height to render on the server and the first frame. Pass the value of the
   * `PET_ZOO_HEIGHT_COOKIE_NAME` cookie (through `parsePetZooHeight`) so a resized zoo keeps its height on reload.
   */
  initialHeight?: number;
  className?: string;
}

/**
 * The pet animation zoo: little 8-bit pets that walk, run, hop, climb the walls, chat with each other and
 * chase a ball, in front of a background of your choice. Drop it anywhere, it fills the width of its parent.
 *
 * - hover it for the toolbar: Spawn pet, Throw ball, Delete pet, Change theme
 * - click a pet to make it react, click it fast for more
 * - drag its top edge to change its height (saved to a cookie)
 * - the pets and the theme are saved to local storage
 */
export default function PetAnimationZoo({ initialHeight = PET_ZOO_DEFAULT_HEIGHT_PX, className }: PetAnimationZooProps) {
  const { height, isResizing, handleProps } = usePetZooHeightResize(initialHeight);
  const isHydrated: boolean = usePetZooStoreHydration();
  const zooRef = useRef<HTMLElement>(null);
  const engine = usePetZooEngine(zooRef);

  return (
    <section
      ref={ zooRef }
      aria-label={ PET_ZOO_LABELS.zooAriaLabel }
      data-slot="pet-animation-zoo"
      className={ cn('group/pet-zoo relative w-full shrink-0 overflow-hidden rounded-md border border-sidebar-border bg-muted/40', className) }
      style={ { height } }
    >
      { /* the saved pets and theme are only known after mount, the empty frame keeps the space meanwhile */ }
      { isHydrated ?
        <>
          <PetZooWorld engine={ engine } />
          <PetZooToolbar engine={ engine } />
        </>
      : null }
      <PetZooHeightResizeHandle height={ height } isResizing={ isResizing } handleProps={ handleProps } />
    </section>
  );
}
