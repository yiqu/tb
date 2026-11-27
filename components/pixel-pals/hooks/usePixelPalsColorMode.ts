'use client';

import { useSyncExternalStore } from 'react';

import type { PixelPalsColorMode } from '../models/pixel-pals.models';

/** The class that dark mode puts on `<html>` (next-themes with `attribute="class"`, and Tailwind's default). */
const DARK_CLASS_NAME = 'dark';

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(() => {
    onChange();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => {
    observer.disconnect();
  };
}

function getSnapshot(): PixelPalsColorMode {
  return document.documentElement.classList.contains(DARK_CLASS_NAME) ? 'dark' : 'light';
}

function getServerSnapshot(): PixelPalsColorMode {
  return 'light';
}

/** Light or dark, following the app's theme, so Pixel Pals shows the matching art and fill color. */
export function usePixelPalsColorMode(): PixelPalsColorMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
