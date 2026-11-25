'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';

import PixelPalsWorld from './PixelPalsWorld';
import PixelPalsToolbar from './PixelPalsToolbar';
import { usePixelPalsEngine } from '../hooks/usePixelPalsEngine';
import PixelPalsHeightResizeHandle from './PixelPalsHeightResizeHandle';
import { usePixelPalsHeightResize } from '../hooks/usePixelPalsHeightResize';
import { PIXEL_PALS_LABELS } from '../constants/pixel-pals-labels.constants';
import { usePixelPetsStoreHydration } from '../hooks/usePixelPetsStoreHydration';
import { PIXEL_PALS_FONT_FACE_CSS, PIXEL_PALS_DEFAULT_HEIGHT_PX } from '../constants/pixel-pals.constants';

import '../styles/pixel-pals.css';

interface PixelPalsProps {
  /**
   * The height to render on the server and the first frame. Pass the value of the
   * `PIXEL_PALS_HEIGHT_COOKIE_NAME` cookie (through `parsePixelPalsHeight`) so a resized Pixel Pals keeps its height on reload.
   */
  initialHeight?: number;
  className?: string;
}

/**
 * Pixel Pals: little 8-bit pets that walk, run, hop, climb the walls, chat with each other and
 * chase a ball, in front of a background of your choice. Drop it anywhere, it fills the width of its parent.
 *
 * - hover it for the toolbar: Spawn pet, Throw ball, Feed, Delete pet, Change theme
 * - click a pet to make it react, click it fast for more
 * - drag its top edge to change its height (saved to a cookie)
 * - the pets and the theme are saved to local storage
 */
export default function PixelPals({ initialHeight = PIXEL_PALS_DEFAULT_HEIGHT_PX, className }: PixelPalsProps) {
  const { height, isResizing, handleProps } = usePixelPalsHeightResize(initialHeight);
  const isHydrated: boolean = usePixelPetsStoreHydration();
  const pixelPalsRef = useRef<HTMLElement>(null);
  const engine = usePixelPalsEngine(pixelPalsRef);

  return (
    <section
      ref={ pixelPalsRef }
      aria-label={ PIXEL_PALS_LABELS.pixelPalsAriaLabel }
      data-slot="pixel-pals"
      className={ cn('group/pixel-pals relative w-full shrink-0 overflow-hidden rounded-md border border-sidebar-border bg-muted/40', className) }
      style={ { height } }
    >
      { /* React puts this in <head> once, however many Pixel Pals are on the page */ }
      <style href="pixel-pals-font" precedence="default">
        { PIXEL_PALS_FONT_FACE_CSS }
      </style>
      { /* the saved pets and background are only known after mount, the empty frame keeps the space meanwhile */ }
      { isHydrated ?
        <>
          <PixelPalsWorld engine={ engine } />
          <PixelPalsToolbar engine={ engine } />
        </>
      : null }
      <PixelPalsHeightResizeHandle height={ height } isResizing={ isResizing } handleProps={ handleProps } />
    </section>
  );
}
