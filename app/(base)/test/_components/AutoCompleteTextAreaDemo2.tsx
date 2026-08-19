'use client';

import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import { HFCheckbox } from '@/components/hook-form/HFFieldCheckbox';
import Typography from '@/components/typography/Typography';
import { HFInputField } from '@/components/hook-form/HFFieldInput';
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

// Zod schema first, type derived from it. The autocomplete field's value is the structured
// AutoCompleteValue (text + autocompleted items); the plain string for the server is derived
// at submit time with autoCompleteValueToText(). The sibling fields show that the text area
// is just another react-hook-form field alongside ordinary inputs and checkboxes.
const autoCompleteDemo2Schema = z.object({
  note: z
    .custom<AutoCompleteValue<Gist>>((candidate) => Array.isArray(candidate))
    .refine((segments) => autoCompleteValueToText(segments, () => 'x').trim().length > 0, { message: 'Please type something first.' }),
  location: z.string(),
  isDriveable: z.boolean(),
  carName: z.string(),
});

type AutoCompleteDemo2Schema = z.infer<typeof autoCompleteDemo2Schema>;

/** One row of the submitted-values readout below the form. */
interface SubmittedEntry {
  label: string;
  value: string;
}

/**
 * Second controlled demo: the AutoCompletableTextArea sitting in a react-hook-form form next to
 * plain fields (Location, Is driveable, Car name), to show it participates in normal form state.
 * Every value is echoed below on submit.
 */
export default function AutoCompleteTextAreaDemo2() {
  const [submittedEntries, setSubmittedEntries] = useState<SubmittedEntry[] | null>(null);

  const { control, handleSubmit, reset } = useForm<AutoCompleteDemo2Schema>({
    resolver: zodResolver(autoCompleteDemo2Schema),
    defaultValues: {
      note: [{ kind: 'text', text: SOME_INIT_TEXT }],
      location: 'Boston, MA',
      isDriveable: false,
      carName: '',
    },
  });

  const onSubmit = (data: AutoCompleteDemo2Schema) => {
    setSubmittedEntries([
      // Chips are transformed to their id for the server value.
      { label: 'Note', value: autoCompleteValueToText(data.note, textAreaItemTransformForServerFunction) },
      { label: 'Location', value: data.location },
      { label: 'Is driveable', value: String(data.isDriveable) },
      { label: 'Car name', value: data.carName },
    ]);
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">AutoCompletableTextArea — controlled, alongside other form fields</Typography>
      <Typography variant="caption1">
        The same text area as a react-hook-form field next to ordinary inputs. Location starts with a value, Car name starts empty and Is
        driveable defaults to false. Submit to see every value below.
      </Typography>
      <form onSubmit={ handleSubmit(onSubmit) } className="flex w-full flex-col gap-y-3">
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
                className="min-h-32"
              />
              { fieldState.error ?
                <Typography variant="caption1" className="text-destructive">
                  { fieldState.error.message }
                </Typography>
              : null }
            </ColumnStack>
          ) }
        />

        <HFInputField<AutoCompleteDemo2Schema> control={ control } name="location" label="Location" placeholder="Where is it?" />
        <HFInputField<AutoCompleteDemo2Schema> control={ control } name="carName" label="Car name" placeholder="Which car?" />
        <HFCheckbox<AutoCompleteDemo2Schema> control={ control } name="isDriveable" label="Is driveable" />

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
              setSubmittedEntries(null);
            } }
          >
            Reset
          </Button>
        </RowStack>
      </form>
      { submittedEntries ?
        <ColumnStack className="gap-y-1">
          <Typography variant="label1">Submitted values (note chips transformed to their id):</Typography>
          <ColumnStack className="gap-y-2 rounded-md bg-muted p-2">
            { submittedEntries.map((entry: SubmittedEntry) => (
              <RowStack key={ entry.label } className="items-start gap-x-2">
                <Typography variant="label1" className="min-w-28 shrink-0">
                  { entry.label }
                </Typography>
                <Typography variant="code1" className="break-all whitespace-pre-wrap">
                  { entry.value === '' ? '—' : entry.value }
                </Typography>
              </RowStack>
            )) }
          </ColumnStack>
        </ColumnStack>
      : null }
    </ColumnStack>
  );
}
