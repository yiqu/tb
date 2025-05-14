'use client';


import useIsClient from '@/hooks/useIsClient';
import { manageLocalStorage } from '@/lib/utils';

export default function AccountLocalstorageSizeInfo() {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  const storageInfo = manageLocalStorage();
  console.log(`localStorage usage: ${storageInfo.totalSize} (${storageInfo.percentUsed})`);
  console.log(`Number of items: ${storageInfo.itemCount}`);

  return <></>;
}
