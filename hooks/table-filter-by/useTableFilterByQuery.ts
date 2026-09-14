'use client';

import { useState } from 'react';
import { Options, debounce, useQueryState } from 'nuqs';

import { parseAsTrimmedString } from '@/nuqs-parsers/string.parser';
import { AppColumnId } from '@/store/subscriptions/table.store';
import { getTableFilterByParamKey } from '@/shared/table-filter-by/table-filter-by.utils';

/**
 * nuqs options every filter by param is read and written with. One place to change how the filter
 * touches the URL — `shallow: false` is what makes the server re-query on a new filter value.
 */
const FILTER_BY_QUERY_OPTIONS: Options = {
  shallow: false,
  history: 'push',
};

/**
 * Commit as the user types instead of waiting for Apply.
 *
 * Flip this to `true` and the feature is back to its old behavior with nothing else to change: the
 * input writes the search param on every keystroke (debounced by the constant below) and
 * `TableFilterByPanel` drops the Apply button on its own, because it renders the button off
 * `commitOnChange` from this hook.
 */
const FILTER_BY_COMMIT_ON_CHANGE: boolean = false;

/** How long typing settles before a commit-on-change write reaches the URL. */
const FILTER_BY_COMMIT_ON_CHANGE_DEBOUNCE_MS = 500;

/**
 * The search param behind one column's "Filter By" input.
 *
 * The input is a draft held in local state; nothing reaches the URL until `applyFilterValue` runs
 * (the Apply button, or Enter in the input). `filterValue` stays the committed value, so the menu
 * badge and the submenu's open state read what the server actually filtered on.
 *
 * @param columnId - The column the filter belongs to. Its id is the search param key, unless the
 *   column names its own in `TABLE_FILTER_BY_COLUMNS`.
 */
export default function useTableFilterByQuery(columnId: AppColumnId) {
  const searchParamKey: string = getTableFilterByParamKey(columnId);

  const [filterValue, setFilterValue] = useQueryState(
    searchParamKey,
    parseAsTrimmedString.withDefault('').withOptions(FILTER_BY_QUERY_OPTIONS),
  );

  const [draftValue, setDraftValue] = useState<string>(filterValue);
  const [committedSnapshot, setCommittedSnapshot] = useState<string>(filterValue);

  // The committed value moved: our own commit, or the param changing on its own (back / forward, a
  // "clear filters" action, another menu writing the same key). Re-sync during render rather than in
  // an effect, so the input never paints a stale value first.
  if (filterValue !== committedSnapshot) {
    setCommittedSnapshot(filterValue);
    setDraftValue(filterValue);
  }

  const commitValue = (value: string, options?: { debounced?: boolean }) => {
    const trimmed: string = value.trim();
    setFilterValue(trimmed || null, {
      limitUrlUpdates: options?.debounced && trimmed !== '' ? debounce(FILTER_BY_COMMIT_ON_CHANGE_DEBOUNCE_MS) : undefined,
    });
  };

  /** Type into the input. Only reaches the URL here when commit-on-change is on. */
  const changeDraftValue = (value: string) => {
    setDraftValue(value);
    if (FILTER_BY_COMMIT_ON_CHANGE) {
      commitValue(value, { debounced: true });
    }
  };

  /** Push the draft to the URL. The Apply button and Enter in the input. */
  const applyFilterValue = () => {
    commitValue(draftValue);
  };

  /** Drop the filter, draft and all. */
  const clearFilterValue = () => {
    setDraftValue('');
    commitValue('');
  };

  /** The draft says something the URL does not, so Apply has work to do. */
  const isDirty: boolean = draftValue.trim() !== filterValue.trim();

  return {
    searchParamKey,
    /** The committed value — what the server filtered on. */
    filterValue,
    /** What is in the input right now. */
    draftValue,
    isDirty,
    hasFilterValue: !!filterValue,
    commitOnChange: FILTER_BY_COMMIT_ON_CHANGE,
    changeDraftValue,
    applyFilterValue,
    clearFilterValue,
  };
}
