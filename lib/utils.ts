import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

import { appName } from '@/constants/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * String
 */

export function isTrue(value: string | undefined | null) {
  return value?.toLowerCase() === 'true';
}

export function isFalse(value: string | undefined | null) {
  return value?.toLowerCase() === 'false';
}

/**
 * JSON
 */

export function safeParseJson<T>(jsonString: string, defaultValue: T = {} as T): T {
  try {
    const parsedObject = JSON.parse(jsonString) as T;
    return parsedObject;
  } catch (error: unknown) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Avatar
 */

export function getAvatarImgUrlById(id: string) {
  if (id === '1') {
    return '/pfp/dishy.png';
  } else if (id === '2') {
    return '/pfp/deer.png';
  }
  return '/pfp/dishy.png';
}

export function getAvatarNameById(id: string) {
  if (id === '1') {
    return 'Dishy';
  } else if (id === '2') {
    return 'Dee';
  }
  return '';
}

/**
 * Localstorage
 */

/**
 * Get localStorage usage information and optionally clear it
 */
export function manageLocalStorage(clearStorage = false) {
  // Calculate total size
  let totalSize: number = 0;
  let itemCount: number = 0;
  const items: Record<string, { size: string; bytes: number }> = {};

  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key: string | null = localStorage.key(i);
    if (!key) {
      continue;
    }
    const value: string | null = localStorage.getItem(key);
    if (!value) {
      continue;
    }
    const size = (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character

    totalSize += size;
    itemCount++;
    items[key] = {
      size: `${(size / 1024).toFixed(2)} KB`,
      bytes: size,
    };
  }

  // Format the total size
  const formattedSize = totalSize < 1024 ? `${totalSize} bytes` : `${(totalSize / 1024).toFixed(2)} KB`;

  // Clear localStorage if requested
  if (clearStorage) {
    localStorage.clear();
  }

  return {
    totalSize: formattedSize,
    totalBytes: totalSize,
    itemCount,
    items,
    percentUsed: `${((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2)}%`, // 5MB limit in most browsers
    isEmpty: itemCount === 0,
    percentNumber: totalSize / (5 * 1024 * 1024),
  };
}

/**
 * Metadata Generator
 */

export function getLayoutMetadata(layoutTitle: string, layoutDescription?: string): Metadata {
  return {
    title: {
      template: `%s | ${layoutTitle} | ${appName}`,
      default: `${layoutTitle}`,
    },
    description: `${layoutDescription ?? ''} page`,
  };
}
