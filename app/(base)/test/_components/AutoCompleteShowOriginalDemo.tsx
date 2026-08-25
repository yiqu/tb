'use client';

import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import RowStack from '@/shared/components/RowStack';
import { Label } from '@/components/ui/label';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { AutoCompleteValue } from '@/components/auto-completable-textarea/autocompletable-textarea.models';
import { autoCompleteValueToText } from '@/components/auto-completable-textarea/autocompletable-textarea.utils';
import AutoCompletableTextAreaUncontrolled from '@/components/auto-completable-textarea/AutoCompletableTextAreaUncontrolled';
import AutoCompletableTextAreaReadOnly from '@/components/auto-completable-textarea-read-only/AutoCompletableTextAreaReadOnly';

import { ItemOptionDisplay } from './Utils';
import {
  Gist,
  TEST_GISTS,
  SOME_INIT_TEXT,
  isItemDisabled,
  gistCopyContent,
  resolveGistById,
  itemFilterFunction,
  textAreaItemDisplay,
  getAutocompleteItemRegex,
  getAutocompleteItemIdPrefix,
  textAreaItemTransformForServerFunction,
} from './test.utils';

/**
 * showOriginal demo for the editable text area. The same initial string is mounted twice, once
 * scanned and once raw, so the difference is visible side by side. Each instance is keyed on the
 * flag because showOriginal is read when the incoming value is scanned — remounting is what makes
 * the toggle re-evaluate the same initial text.
 */
export default function AutoCompleteShowOriginalDemo() {
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [serverText, setServerText] = useState<string>('');

  const handleChange = (value: AutoCompleteValue<Gist>) => {
    setServerText(autoCompleteValueToText(value, textAreaItemTransformForServerFunction));
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">showOriginal — editable and read-only, one toggle</Typography>
      <Typography variant="caption1">
        With <Typography variant="code1" as="span">showOriginal</Typography> the automatic id scan is off: the initial string keeps its
        raw <Typography variant="code1" as="span">GIST-</Typography> ids as plain text, and blurring no longer converts typed ids into
        chips. Picking from the dropdown still inserts a chip — only the automatic conversion stops.
      </Typography>

      <RowStack className="items-center gap-x-2">
        <Checkbox
          id="show-original-toggle"
          checked={ showOriginal }
          onCheckedChange={ (checked: boolean | 'indeterminate') => setShowOriginal(checked === true) }
        />
        <Label htmlFor="show-original-toggle" className="cursor-pointer font-normal">
          showOriginal — when ON, ids are NOT auto-converted to chips
        </Label>
      </RowStack>

      <AutoCompletableTextAreaUncontrolled<Gist>
        key={ String(showOriginal) }
        items={ TEST_GISTS }
        initValue={ [{ kind: 'text', text: SOME_INIT_TEXT }] }
        onChange={ handleChange }
        showOriginal={ showOriginal }
        filterFunction={ itemFilterFunction }
        itemDisplayFunction={ textAreaItemDisplay }
        itemTransformFunction={ textAreaItemTransformForServerFunction }
        getItemIdPrefix={ getAutocompleteItemIdPrefix }
        renderItemOption={ (gist: Gist) => <ItemOptionDisplay item={ gist } /> }
        isItemDisabled={ isItemDisabled }
        detailsDialogTitle="Gist details"
        placeholder='Type ":" to autocomplete a gist...'
        searchPlaceholder="Search gists..."
        className="min-h-24"
      />

      <ColumnStack className="gap-y-1">
        <Typography variant="label1">Live value (chips transformed to their id):</Typography>
        <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
          { serverText === '' ? '—' : serverText }
        </Typography>
      </ColumnStack>

      { /* The same flag on the read-only component, driven by the same toggle: there the scan is
           skipped entirely, so the string renders exactly as passed in. */ }
      <ColumnStack className="gap-y-1">
        <Typography variant="label1">Read-only display, same toggle:</Typography>
        <div className="rounded-md border p-3">
          <AutoCompletableTextAreaReadOnly<Gist>
            text={ SOME_INIT_TEXT }
            getItemRegex={ getAutocompleteItemRegex }
            resolveItem={ resolveGistById }
            itemDisplayFunction={ textAreaItemDisplay }
            itemCopyContentFunction={ gistCopyContent }
            detailsDialogTitle="Gist details"
            showOriginal={ showOriginal }
          />
        </div>
      </ColumnStack>
    </ColumnStack>
  );
}
