'use client';

import { useState, useEffect } from 'react';

import { usePixelPalsStore } from '../store/pixel-pals.store';

/** Loads the saved pets and theme from local storage after mount. True once they are in the store. */
export function usePixelPalsStoreHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = usePixelPalsStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (usePixelPalsStore.persist.hasHydrated()) {
      setIsHydrated(true);
    } else {
      // Zustand skips the finish listeners when loading fails, so show Pixel Pals (with the defaults) either way
      void Promise.resolve(usePixelPalsStore.persist.rehydrate()).then(() => {
        setIsHydrated(true);
      });
    }
    return () => {
      unsubscribe();
    };
  }, []);

  return isHydrated;
}
