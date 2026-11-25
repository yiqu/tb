'use client';

import { useState, useEffect } from 'react';

import { usePetZooStore } from '../store/pet-zoo.store';

/** Loads the saved pets and theme from local storage after mount. True once they are in the store. */
export function usePetZooStoreHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = usePetZooStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (usePetZooStore.persist.hasHydrated()) {
      setIsHydrated(true);
    } else {
      void usePetZooStore.persist.rehydrate();
    }
    return () => {
      unsubscribe();
    };
  }, []);

  return isHydrated;
}
