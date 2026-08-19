'use client';

import { useState } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { AutoCompleteValue } from '@/components/auto-completable-textarea/autocompletable-textarea.models';
import { autoCompleteValueToText } from '@/components/auto-completable-textarea/autocompletable-textarea.utils';
import AutoCompletableTextAreaUncontrolled from '@/components/auto-completable-textarea/AutoCompletableTextAreaUncontrolled';

import { TeammateOptionDisplay } from './Utils';
import { Teammate, TEST_TEAMMATES, teammateFilterFunction, teammateTextAreaItemDisplay, teammateTransformForServerFunction } from './test.utils';

/**
 * Uncontrolled demo, doubling as the bonus: the exact same component working with a completely
 * different object shape (Teammate instead of Gist) — only the callback props change.
 * Trigger key is '@' here to show it is customizable.
 */
export default function AutoCompleteTextAreaUncontrolledDemo() {
  const [currentServerText, setCurrentServerText] = useState<string>('');

  const handleChange = (value: AutoCompleteValue<Teammate>) => {
    setCurrentServerText(autoCompleteValueToText(value, teammateTransformForServerFunction));
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">AutoCompletableTextAreaUncontrolled — bonus Teammate type</Typography>
      <Typography variant="caption1">
        Same component, different object shape. Hit <Typography variant="code1" as="span">@</Typography> to autocomplete a teammate.
        Chips show the name, the value below transforms them to their email.
      </Typography>
      <AutoCompletableTextAreaUncontrolled<Teammate>
        items={ TEST_TEAMMATES }
        initValue={ [{ kind: 'text', text: 'Hey ' }] }
        onChange={ handleChange }
        filterFunction={ teammateFilterFunction }
        itemDisplayFunction={ teammateTextAreaItemDisplay }
        renderItemOption={ (teammate: Teammate) => <TeammateOptionDisplay item={ teammate } /> }
        detailsDialogTitle="Teammate details"
        triggerKey="@"
        placeholder='Type "@" to autocomplete a teammate...'
        searchPlaceholder="Search teammates..."
        chipClassName="border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20"
      />
      <ColumnStack className="gap-y-1">
        <Typography variant="label1">Live value (chips transformed to their email):</Typography>
        <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
          { currentServerText === '' ? '—' : currentServerText }
        </Typography>
      </ColumnStack>
    </ColumnStack>
  );
}
