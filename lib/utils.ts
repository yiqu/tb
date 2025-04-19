import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

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
    const parsedObject = JSON.parse(jsonString);
    return parsedObject; // Return the parsed object if successful
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}
