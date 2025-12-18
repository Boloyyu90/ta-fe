/**
 * Storage wrapper utility
 *
 * Abstracts localStorage vs sessionStorage with SSR-safe guards.
 * Prevents "window is not defined" errors during server-side rendering.
 */

type StorageType = 'local' | 'session';

/**
 * Gets the appropriate storage mechanism
 * Returns null during SSR to prevent errors
 */
const getStorage = (type: StorageType): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return type === 'local' ? window.localStorage : window.sessionStorage;
};

/**
 * Set an item in storage
 * Automatically stringifies objects/arrays
 */
export const storageSet = (
  key: string,
  value: string,
  type: StorageType = 'local'
): void => {
  const storage = getStorage(type);
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set ${key} in ${type}Storage:`, error);
  }
};

/**
 * Get an item from storage
 * Returns null if not found or during SSR
 */
export const storageGet = (
  key: string,
  type: StorageType = 'local'
): string | null => {
  const storage = getStorage(type);
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key} from ${type}Storage:`, error);
    return null;
  }
};

/**
 * Remove an item from storage
 */
export const storageRemove = (
  key: string,
  type: StorageType = 'local'
): void => {
  const storage = getStorage(type);
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from ${type}Storage:`, error);
  }
};

/**
 * Clear all items from storage
 */
export const storageClear = (type: StorageType = 'local'): void => {
  const storage = getStorage(type);
  if (!storage) return;

  try {
    storage.clear();
  } catch (error) {
    console.error(`Failed to clear ${type}Storage:`, error);
  }
};
