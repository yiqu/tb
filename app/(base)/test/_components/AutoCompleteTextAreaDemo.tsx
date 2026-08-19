'use client';

import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import AutoCompletableTextArea from '@/components/auto-completable-textarea/AutoCompletableTextArea';
import { AutoCompleteValue } from '@/components/auto-completable-textarea/autocompletable-textarea.models';
import { autoCompleteValueToText } from '@/components/auto-completable-textarea/autocompletable-textarea.utils';

import { ItemOptionDisplay } from './Utils';
import {
  Gist,
  TEST_GISTS,
  SOME_INIT_TEXT,
  isItemDisabled,
  itemFilterFunction,
  textAreaItemDisplay,
  getAutocompleteItemIdPrefix,
  textAreaItemTransformForServerFunction,
} from './test.utils';

// Zod schema first, type derived from it. The field value is the structured
// AutoCompleteValue (text + autocompleted items) — the plain string for the
// server is derived at submit time with autoCompleteValueToText().
const autoCompleteDemoSchema = z.object({
  note: z
    .custom<AutoCompleteValue<Gist>>((candidate) => Array.isArray(candidate))
    .refine((segments) => autoCompleteValueToText(segments, () => 'x').trim().length > 0, { message: 'Please type something first.' }),
});

type AutoCompleteDemoSchema = z.infer<typeof autoCompleteDemoSchema>;

/**
 * Controlled demo: AutoCompletableTextArea wired into react-hook-form via <Controller>,
 * using the Gist list. Hit ':' inside the text area to open the dropdown.
 */
export default function AutoCompleteTextAreaDemo() {
  const [submittedServerText, setSubmittedServerText] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<AutoCompleteDemoSchema>({
    resolver: zodResolver(autoCompleteDemoSchema),
    // The initial blob of text contains a raw gist id — the component hydrates it into a chip
    // on mount because the id starts with the prefix from getAutocompleteItemIdPrefix().
    defaultValues: { note: [{ kind: 'text', text: SOME_INIT_TEXT }] },
  });

  const onSubmit = (data: AutoCompleteDemoSchema) => {
    // What actually goes to the server: chips are transformed to their id.
    setSubmittedServerText(autoCompleteValueToText(data.note, textAreaItemTransformForServerFunction));
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">AutoCompletableTextArea — controlled (react-hook-form) with Gists</Typography>
      <Typography variant="caption1">
        Type freely, hit <Typography variant="code1" as="span">:</Typography> to open the dropdown, filter, then pick with mouse or
        ArrowUp/ArrowDown + Enter. Click a chip for Edit / Show details / Remove. Escape closes the dropdown. Copying selected content
        turns chips into their gist id; pasted or initial text containing a <Typography variant="code1" as="span">GIST-</Typography>
        prefixed id is swapped back into a chip on load.
      </Typography>
      <form onSubmit={ handleSubmit(onSubmit) } className="flex w-full flex-col gap-y-2">
        <Controller
          control={ control }
          name="note"
          render={ ({ field, fieldState }) => (
            <ColumnStack className="gap-y-1">
              <AutoCompletableTextArea<Gist>
                items={ TEST_GISTS }
                value={ field.value }
                onValueChange={ field.onChange }
                onBlur={ field.onBlur }
                filterFunction={ itemFilterFunction }
                itemDisplayFunction={ textAreaItemDisplay }
                itemTransformFunction={ textAreaItemTransformForServerFunction }
                getItemIdPrefix={ getAutocompleteItemIdPrefix }
                renderItemOption={ (gist: Gist) => <ItemOptionDisplay item={ gist } /> }
                isItemDisabled={ isItemDisabled }
                detailsDialogTitle="Gist details"
                triggerKey=":"
                placeholder='Type ":" to autocomplete a gist...'
                searchPlaceholder="Search gists..."
                className="min-h-74"
                chipClassName="text-red-700"
              />
              { fieldState.error ?
                <Typography variant="caption1" className="text-destructive">
                  { fieldState.error.message }
                </Typography>
              : null }
            </ColumnStack>
          ) }
        />
        <RowStack className="gap-x-2">
          <Button type="submit" size="sm">
            Submit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={ () => {
              reset();
              setSubmittedServerText(null);
            } }
          >
            Reset
          </Button>
        </RowStack>
      </form>
      { submittedServerText !== null ?
        <ColumnStack className="gap-y-1">
          <Typography variant="label1">Submitted server value (chips transformed to their id):</Typography>
          <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
            { submittedServerText }
          </Typography>
        </ColumnStack>
      : null }
    </ColumnStack>
  );
}
