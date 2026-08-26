'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
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
 * showOriginal demo: one checkbox drives BOTH components over the same string.
 *
 * Neither instance is keyed on the flag — both react to it in place. The editable one converts its
 * current content on the spot (chips flatten to raw text when ON, raw ids scan back into chips when
 * OFF), and the read-only one simply re-derives its segments. So this also demonstrates that edits
 * made before toggling survive the conversion.
 */
/**
 * The initial value, shared by the text area and the live readout below it. Declared once so the
 * readout can be seeded from the SAME value the editor mounts with: the uncontrolled component only
 * calls `onChange` when the value actually changes, so without this seed the readout would show an
 * empty value until the first edit, even though the editor clearly has content.
 */
const INITIAL_VALUE: AutoCompleteValue<Gist> = [{ kind: 'text', text: SOME_INIT_TEXT }];

export default function AutoCompleteShowOriginalDemo() {
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [serverText, setServerText] = useState<string>(() =>
    autoCompleteValueToText(INITIAL_VALUE, textAreaItemTransformForServerFunction),
  );
  const [submittedText, setSubmittedText] = useState<string | null>(null);

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
        items={ TEST_GISTS }
        initValue={ INITIAL_VALUE }
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

      <RowStack className="gap-x-2">
        <Button type="button" size="sm" onClick={ () => setSubmittedText(serverText) }>
          Submit
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={ () => setSubmittedText(null) }>
          Clear result
        </Button>
      </RowStack>

      { submittedText !== null ?
        <ColumnStack className="gap-y-1">
          <Typography variant="label1">Submitted value (uncontrolled — the latest onChange value):</Typography>
          <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
            { submittedText === '' ? '—' : submittedText }
          </Typography>
        </ColumnStack>
      : null }

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
