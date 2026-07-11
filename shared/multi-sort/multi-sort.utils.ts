import { SortConfig, SortOptions } from '@/store/sorter/table-sort';

/**
 * Converts a sort config array to a URLSearchParams string.
 * All `sort` keys come first (in order), then all `direction` keys (in the same order).
 * Example: sort=arrival_date&sort=user_id&direction=asc&direction=desc
 */
export function buildSortSearchParamsString(sort: SortConfig[]): string {
  const params = new URLSearchParams();

  for (const config of sort) {
    params.append('sort', config.field);
  }
  for (const config of sort) {
    params.append('direction', config.direction);
  }

  return params.toString();
}

/**
 * Returns the options that are not part of the checked sort configs, preserving
 * the order they appear in `allOptions`.
 */
export function getUncheckedOptions(checked: SortConfig[], allOptions: SortOptions[]): SortOptions[] {
  const checkedFields = new Set<SortOptions>(checked.map((config) => config.field));
  return allOptions.filter((option) => !checkedFields.has(option));
}

/**
 * Immutably moves an item within a list from one index to another.
 */
export function reorderList<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
