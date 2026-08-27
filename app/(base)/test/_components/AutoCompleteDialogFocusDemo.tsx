'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AutoCompletableTextAreaUncontrolled from '@/components/auto-completable-textarea/AutoCompletableTextAreaUncontrolled';
import { AutoCompleteValue } from '@/components/auto-completable-textarea/autocompletable-textarea.models';
import { autoCompleteValueToText } from '@/components/auto-completable-textarea/autocompletable-textarea.utils';

import { ItemOptionDisplay } from './Utils';
import {
  Gist,
  TEST_GISTS,
  isItemDisabled,
  itemFilterFunction,
  textAreaItemDisplay,
  getAutocompleteItemRegex,
  textAreaItemTransformForServerFunction,
} from './test.utils';

const INITIAL_VALUE: AutoCompleteValue<Gist> = [{ kind: 'text', text: 'Draft mentioning GIST-3333333 — ' }];

/**
 * autoFocus inside a dialog: open it and the caret is already in the text area, at the end of the
 * content, ready to type.
 *
 * Worth seeing rather than just reading about, because the naive version of this does NOT work: a
 * Radix dialog claims focus for its own content when it opens and lands on the first tabbable thing
 * inside — which here, with an id hydrated out of the initial text, is a CHIP. The prop defers past
 * that. The text area is re-mounted (new key) whenever a chip is inserted, and focus is deliberately
 * NOT re-taken then, so picking from the dropdown leaves the caret where the user was.
 */
export default function AutoCompleteDialogFocusDemo() {
  const [open, setOpen] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(() => autoCompleteValueToText(INITIAL_VALUE, textAreaItemTransformForServerFunction));
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">autoFocus — the text area inside a dialog</Typography>
      <Typography variant="caption1">
        The dialog opens with the caret already in the text area, at the end of the content — just type. The editable surface is a
        contentEditable div, so React&apos;s own <Typography variant="code1" as="span">autoFocus</Typography> does nothing on it; the
        component&apos;s <Typography variant="code1" as="span">autoFocus</Typography> prop is the equivalent, and it defers past the
        dialog&apos;s own focus grab (which would otherwise land on the first chip).
      </Typography>

      <RowStack className="gap-x-2">
        <Dialog open={ open } onOpenChange={ setOpen }>
          <DialogTrigger asChild>
            <Button type="button" size="sm">
              Open the dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compose a note</DialogTitle>
            </DialogHeader>
            <AutoCompletableTextAreaUncontrolled<Gist>
              items={ TEST_GISTS }
              autoFocus
              initValue={ INITIAL_VALUE }
              onChange={ (value: AutoCompleteValue<Gist>) => setDraft(autoCompleteValueToText(value, textAreaItemTransformForServerFunction)) }
              filterFunction={ itemFilterFunction }
              itemDisplayFunction={ textAreaItemDisplay }
              itemTransformFunction={ textAreaItemTransformForServerFunction }
              getItemRegex={ getAutocompleteItemRegex }
              renderItemOption={ (gist: Gist) => <ItemOptionDisplay item={ gist } /> }
              isItemDisabled={ isItemDisabled }
              detailsDialogTitle="Gist details"
              placeholder='Type ":" to autocomplete a gist...'
              searchPlaceholder="Search gists..."
              className="min-h-32"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" size="sm" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                size="sm"
                onClick={ () => {
                  setSaved(draft);
                  setOpen(false);
                } }
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button type="button" size="sm" variant="outline" onClick={ () => setSaved(null) }>
          Clear result
        </Button>
      </RowStack>

      { saved !== null ?
        <ColumnStack className="gap-y-1">
          <Typography variant="label1">Saved value (chips transformed to their id):</Typography>
          <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
            { saved === '' ? '—' : saved }
          </Typography>
        </ColumnStack>
      : null }
    </ColumnStack>
  );
}
