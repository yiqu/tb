'use client';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import AutoCompletableTextAreaReadOnly from '@/components/auto-completable-textarea-read-only/AutoCompletableTextAreaReadOnly';

import {
  Gist,
  gistCopyContent,
  resolveGistById,
  textAreaItemDisplay,
  READ_ONLY_TEXT_NONE,
  READ_ONLY_TEXT_MIXED,
  READ_ONLY_TEXT_SIMPLE,
  getAutocompleteItemRegex,
} from './test.utils';

/** One labelled example, so the three below stay visually distinct. */
function Example({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <ColumnStack className="gap-y-1">
      <Typography variant="label1">{ label }</Typography>
      <div className="rounded-md border p-3">{ children }</div>
    </ColumnStack>
  );
}

/**
 * Read-only display demo: the same gist ids that the editable text area autocompletes are detected
 * in a plain string and rendered as clickable chips. Nothing here is editable.
 */
export default function AutoCompleteReadOnlyDemo() {
  return (
    <ColumnStack className="w-full gap-y-3 rounded-md border p-4">
      <Typography variant="h5">AutoCompletableTextAreaReadOnly — view-only display</Typography>
      <Typography variant="caption1">
        Takes a plain string, scans it with{ ' ' }
        <Typography variant="code1" as="span">
          getAutocompleteItemRegex()
        </Typography>{ ' ' }
        and turns every match into a clickable chip (View details / Copy / Copy display). Chips show the gist alias; unknown ids stay
        visible with a warning so a stale reference is not silently swallowed.
      </Typography>

      <Example label="1. Two known ids in a sentence">
        <AutoCompletableTextAreaReadOnly<Gist>
          text={ READ_ONLY_TEXT_SIMPLE }
          getItemRegex={ getAutocompleteItemRegex }
          resolveItem={ resolveGistById }
          itemDisplayFunction={ textAreaItemDisplay }
          itemCopyContentFunction={ gistCopyContent }
          detailsDialogTitle="Gist details"
        />
      </Example>

      <Example label="2. Multiple lines, plus an unknown id (GIST-1234567)">
        <AutoCompletableTextAreaReadOnly<Gist>
          text={ READ_ONLY_TEXT_MIXED }
          getItemRegex={ getAutocompleteItemRegex }
          resolveItem={ resolveGistById }
          itemDisplayFunction={ textAreaItemDisplay }
          itemCopyContentFunction={ gistCopyContent }
          detailsDialogTitle="Gist details"
        />
      </Example>

      <Example label="3. No ids at all, plus custom chip styling on a restyled surface">
        <ColumnStack className="gap-y-3">
          <AutoCompletableTextAreaReadOnly<Gist>
            text={ READ_ONLY_TEXT_NONE }
            getItemRegex={ getAutocompleteItemRegex }
            resolveItem={ resolveGistById }
            itemDisplayFunction={ textAreaItemDisplay }
            itemCopyContentFunction={ gistCopyContent }
          />
          <AutoCompletableTextAreaReadOnly<Gist>
            text={ READ_ONLY_TEXT_SIMPLE }
            getItemRegex={ getAutocompleteItemRegex }
            resolveItem={ resolveGistById }
            itemDisplayFunction={ textAreaItemDisplay }
            itemCopyContentFunction={ gistCopyContent }
            detailsDialogTitle="Gist details"
            className="rounded-md bg-muted p-3 italic"
            textClassName="text-muted-foreground"
            chipClassName="border-emerald-500/50 bg-emerald-500/10 not-italic hover:bg-emerald-500/20"
          />
        </ColumnStack>
      </Example>
    </ColumnStack>
  );
}
