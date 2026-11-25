'use client';

import { useState, useEffect } from 'react';

import { usePixelPetsStore } from '../store/pixel-pets.store';

/** Loads the saved pets, background, pet count and locks from local storage after mount. True once they are in the store. */
export function usePixelPetsStoreHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = usePixelPetsStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (usePixelPetsStore.persist.hasHydrated()) {
      setIsHydrated(true);
    } else {
      // Zustand skips the finish listeners when loading fails, so show Pixel Pals (with the defaults) either way
      void Promise.resolve(usePixelPetsStore.persist.rehydrate()).then(() => {
        setIsHydrated(true);
      });
    }
    return () => {
      unsubscribe();
    };
  }, []);

  return isHydrated;
}
