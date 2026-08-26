'use client';

import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { LinkIcon, MailIcon, BadgeCheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { getDefaultChipMenuItems } from '@/components/auto-completable-textarea/AutoCompleteChipMenu';
import { autoCompleteValueToText } from '@/components/auto-completable-textarea/autocompletable-textarea.utils';
import { AutoCompleteValue, AutoCompleteChipMenuItemConfig } from '@/components/auto-completable-textarea/autocompletable-textarea.models';
import AutoCompletableTextArea from '@/components/auto-completable-textarea/AutoCompletableTextArea';
import AutoCompletableTextAreaUncontrolled from '@/components/auto-completable-textarea/AutoCompletableTextAreaUncontrolled';
import AutoCompletableTextAreaReadOnly from '@/components/auto-completable-textarea-read-only/AutoCompletableTextAreaReadOnly';
import { getDefaultReadOnlyChipMenuItems } from '@/components/auto-completable-textarea-read-only/AutoCompleteReadOnlyChipMenu';
import { AutoCompleteReadOnlyChipMenuItemConfig } from '@/components/auto-completable-textarea-read-only/autocompletable-textarea-read-only.models';

import { ItemOptionDisplay, TeammateOptionDisplay } from './Utils';
import {
  Gist,
  Teammate,
  CriticalIssue,
  CRITICAL_INIT_TEXT,
  criticalIssueDisplay,
  getCriticalIssueRegex,
  TEST_CRITICAL_ISSUES,
  criticalIssueCopyContent,
  resolveCriticalIssueById,
  READ_ONLY_TEXT_CRITICAL,
  criticalIssueFilterFunction,
  criticalIssueTransformForServer,
  TEST_GISTS,
  TEST_TEAMMATES,
  isItemDisabled,
  gistCopyContent,
  resolveGistById,
  itemFilterFunction,
  teammateCopyContent,
  textAreaItemDisplay,
  getTeammateEmailRegex,
  resolveTeammateByEmail,
  READ_ONLY_TEXT_MIXED,
  teammateFilterFunction,
  getAutocompleteItemRegex,
  READ_ONLY_TEXT_TEAMMATES,
  teammateTextAreaItemDisplay,
  teammateTransformForServerFunction,
  textAreaItemTransformForServerFunction,
} from './test.utils';

// Example 4 is CONTROLLED: schema first, type derived from it, wired through <Controller>.
const gistNoteSchema = z.object({
  note: z
    .custom<AutoCompleteValue<Gist>>((candidate) => Array.isArray(candidate))
    .refine((segments) => autoCompleteValueToText(segments, () => 'x').trim().length > 0, { message: 'Please type something first.' }),
});

type GistNoteSchema = z.infer<typeof gistNoteSchema>;

/** Initial value for the uncontrolled example 5, shared with its readout seed. */
const TEAMMATE_INITIAL_VALUE: AutoCompleteValue<Teammate> = [{ kind: 'text', text: 'Ping ' }];

/** Initial value for the production-shaped example 6, shared with its readout seed. */
const CRITICAL_INITIAL_VALUE: AutoCompleteValue<CriticalIssue> = [{ kind: 'text', text: CRITICAL_INIT_TEXT }];

/** One labelled example block. */
function Example({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <ColumnStack className="gap-y-1">
      <Typography variant="label1">{ label }</Typography>
      { hint ?
        <Typography variant="caption1">{ hint }</Typography>
      : null }
      <div className="rounded-md border p-3">{ children }</div>
    </ColumnStack>
  );
}

/**
 * A custom READ-ONLY chip menu built on the shared ChipMenuItemConfig: the defaults plus one extra
 * entry. Nothing here reaches into the component — the context supplies everything it needs.
 */
function getTeammateMenuItems(): AutoCompleteReadOnlyChipMenuItemConfig<Teammate>[] {
  return [
    ...getDefaultReadOnlyChipMenuItems<Teammate>(),
    {
      key: 'copy-mailto',
      label: 'Copy mailto link',
      icon: <MailIcon />,
      isDisabled: (context) => context.item === undefined,
      onSelect: async (context) => {
        await context.copyText(`mailto:${context.matchedText}`);
        toast.remove();
        toast.success('Copied mailto link.', { duration: 1000 });
      },
    },
  ];
}

/** The same idea on the EDITABLE component: defaults plus an entry built from the item's server text. */
function getGistMenuItems(): AutoCompleteChipMenuItemConfig<Gist>[] {
  return [
    ...getDefaultChipMenuItems<Gist>(),
    {
      key: 'copy-link',
      label: 'Copy link',
      icon: <LinkIcon />,
      onSelect: async (context) => {
        await context.copyText(`https://example.com/gists/${context.itemServerText}`);
        toast.remove();
        toast.success('Copied link.', { duration: 1000 });
      },
    },
  ];
}

// Built once at module scope: a fresh array every render would needlessly re-memo the menu.
const teammateMenuItems = getTeammateMenuItems();
const gistMenuItems = getGistMenuItems();

/** A custom details body, proving the shared details dialog accepts any renderer. */
function GistDetails({ item }: { item: Gist }) {
  return (
    <ColumnStack className="gap-y-2">
      <RowStack className="items-center gap-x-2">
        <BadgeCheckIcon className={ item.aliasable ? 'size-4 text-green-600' : 'size-4 text-red-500' } />
        <Typography variant="h6">{ item.alias }</Typography>
      </RowStack>
      <Typography variant="body1">{ item.content }</Typography>
      <Typography variant="code1" className="rounded-md bg-muted p-2">
        { item.id }
      </Typography>
    </ColumnStack>
  );
}

/**
 * Extra examples for the refactored components. Everything here runs on the shared substrate in
 * `components/auto-completable-shared` — one details dialog, one clipboard helper, one menu-config
 * shape — while each component keeps its own chip, its own menu and its own props.
 */
export default function AutoCompleteMoreExamplesDemo() {
  // Example 5 is uncontrolled, so its value is tracked from onChange. Seeded from the same initial
  // value the editor mounts with, since onChange only fires once the value actually changes.
  const [teammateNote, setTeammateNote] = useState<string>(() =>
    autoCompleteValueToText(TEAMMATE_INITIAL_VALUE, teammateTransformForServerFunction),
  );
  const [teammateSubmitted, setTeammateSubmitted] = useState<string | null>(null);
  const [criticalNote, setCriticalNote] = useState<string>(() =>
    autoCompleteValueToText(CRITICAL_INITIAL_VALUE, criticalIssueTransformForServer),
  );
  const [criticalSubmitted, setCriticalSubmitted] = useState<string | null>(null);
  const [gistSubmitted, setGistSubmitted] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<GistNoteSchema>({
    resolver: zodResolver(gistNoteSchema),
    defaultValues: { note: [{ kind: 'text', text: 'Blocked on GIST-1111111 until review. ' }] },
  });

  // What a real submit would send: the form's own value, with chips transformed to their id.
  const onSubmitGist = (data: GistNoteSchema) => {
    setGistSubmitted(autoCompleteValueToText(data.note, textAreaItemTransformForServerFunction));
  };

  return (
    <ColumnStack className="w-full gap-y-4 rounded-md border p-4">
      <Typography variant="h5">More examples — refactored components</Typography>
      <Typography variant="caption1">
        These exercise the shared substrate: the details dialog, the clipboard helper and the
        <Typography variant="code1" as="span"> ChipMenuItemConfig </Typography>
        shape are defined once now, yet each component still has its own chip and menu.
      </Typography>

      <Example
        label="1. Read-only with a different object shape (Teammate, matched by email)"
        hint="Same component, different type: an email regex instead of a GIST- id. nobody@example.com is not on the team, so it stays flagged."
      >
        <AutoCompletableTextAreaReadOnly<Teammate>
          text={ READ_ONLY_TEXT_TEAMMATES }
          getItemRegex={ getTeammateEmailRegex }
          resolveItem={ resolveTeammateByEmail }
          itemDisplayFunction={ teammateTextAreaItemDisplay }
          itemCopyContentFunction={ teammateCopyContent }
          detailsDialogTitle="Teammate details"
          chipClassName="border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20"
        />
      </Example>

      <Example
        label="2. Read-only with a custom menu entry (Copy mailto link)"
        hint="The defaults plus one extra entry, built on the shared ChipMenuItemConfig."
      >
        <AutoCompletableTextAreaReadOnly<Teammate>
          text={ READ_ONLY_TEXT_TEAMMATES }
          getItemRegex={ getTeammateEmailRegex }
          resolveItem={ resolveTeammateByEmail }
          itemDisplayFunction={ teammateTextAreaItemDisplay }
          itemCopyContentFunction={ teammateCopyContent }
          chipMenuItems={ teammateMenuItems }
          detailsDialogTitle="Teammate details"
        />
      </Example>

      <Example
        label="3. Read-only with a custom details body"
        hint="Click a chip, pick View details — the shared dialog renders this custom body instead of the generic key/value dump."
      >
        <AutoCompletableTextAreaReadOnly<Gist>
          text={ READ_ONLY_TEXT_MIXED }
          getItemRegex={ getAutocompleteItemRegex }
          resolveItem={ resolveGistById }
          itemDisplayFunction={ textAreaItemDisplay }
          itemCopyContentFunction={ gistCopyContent }
          renderItemDetails={ (gist: Gist) => <GistDetails item={ gist } /> }
          detailsDialogTitle="Gist details"
        />
      </Example>

      <Example
        label="4. Editable with a custom menu entry and the same custom details body"
        hint='Type ":" to autocomplete. The chip menu gains a Copy link entry, and Show details renders the same body as example 3.'
      >
        <form onSubmit={ handleSubmit(onSubmitGist) } className="flex w-full flex-col gap-y-2">
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
                  getItemRegex={ getAutocompleteItemRegex }
                  renderItemOption={ (gist: Gist) => <ItemOptionDisplay item={ gist } /> }
                  renderItemDetails={ (gist: Gist) => <GistDetails item={ gist } /> }
                  isItemDisabled={ isItemDisabled }
                  chipMenuItems={ gistMenuItems }
                  detailsDialogTitle="Gist details"
                  placeholder='Type ":" to autocomplete a gist...'
                  searchPlaceholder="Search gists..."
                  className="min-h-24"
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
                setGistSubmitted(null);
              } }
            >
              Reset
            </Button>
          </RowStack>
          { gistSubmitted !== null ?
            <ColumnStack className="gap-y-1">
              <Typography variant="label1">Submitted value from react-hook-form (chips as their id):</Typography>
              <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
                { gistSubmitted }
              </Typography>
            </ColumnStack>
          : null }
        </form>
      </Example>

      <Example
        label="5. Editable with the Teammate type, trigger key @"
        hint='The editable component with the bonus object shape. Hit "@" to autocomplete; the live value below transforms chips to their email.'
      >
        <ColumnStack className="gap-y-2">
          <AutoCompletableTextAreaUncontrolled<Teammate>
            items={ TEST_TEAMMATES }
            initValue={ TEAMMATE_INITIAL_VALUE }
            onChange={ (value) => setTeammateNote(autoCompleteValueToText(value, teammateTransformForServerFunction)) }
            filterFunction={ teammateFilterFunction }
            itemDisplayFunction={ teammateTextAreaItemDisplay }
            itemTransformFunction={ teammateTransformForServerFunction }
            renderItemOption={ (teammate: Teammate) => <TeammateOptionDisplay item={ teammate } /> }
            detailsDialogTitle="Teammate details"
            triggerKey="@"
            placeholder='Type "@" to autocomplete a teammate...'
            searchPlaceholder="Search teammates..."
            className="min-h-16"
            chipClassName="border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20"
          />
          <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
            { teammateNote === '' ? '—' : teammateNote }
          </Typography>
          <RowStack className="gap-x-2">
            <Button type="button" size="sm" onClick={ () => setTeammateSubmitted(teammateNote) }>
              Submit
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={ () => setTeammateSubmitted(null) }>
              Clear result
            </Button>
          </RowStack>
          { teammateSubmitted !== null ?
            <ColumnStack className="gap-y-1">
              <Typography variant="label1">Submitted value (uncontrolled — latest onChange value):</Typography>
              <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
                { teammateSubmitted === '' ? '—' : teammateSubmitted }
              </Typography>
            </ColumnStack>
          : null }
        </ColumnStack>
      </Example>

      <Example
        label="6. Editable, production-shaped ids (CRIT-0000-0000-0000)"
        hint='The id format planned for production. Hit ":" to autocomplete — chips show the issue title, while the value below is the CRIT- id that would be submitted. The initial text already contains one, hydrated on load.'
      >
        <ColumnStack className="gap-y-2">
          <AutoCompletableTextAreaUncontrolled<CriticalIssue>
            items={ TEST_CRITICAL_ISSUES }
            initValue={ CRITICAL_INITIAL_VALUE }
            onChange={ (value) => setCriticalNote(autoCompleteValueToText(value, criticalIssueTransformForServer)) }
            filterFunction={ criticalIssueFilterFunction }
            itemDisplayFunction={ criticalIssueDisplay }
            itemTransformFunction={ criticalIssueTransformForServer }
            getItemRegex={ getCriticalIssueRegex }
            detailsDialogTitle="Critical issue"
            placeholder='Type ":" to autocomplete a critical issue...'
            searchPlaceholder="Search issues by title, owner or id..."
            className="min-h-20"
            chipClassName="border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20"
          />
          <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
            { criticalNote === '' ? '—' : criticalNote }
          </Typography>
          <RowStack className="gap-x-2">
            <Button type="button" size="sm" onClick={ () => setCriticalSubmitted(criticalNote) }>
              Submit
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={ () => setCriticalSubmitted(null) }>
              Clear result
            </Button>
          </RowStack>
          { criticalSubmitted !== null ?
            <ColumnStack className="gap-y-1">
              <Typography variant="label1">Submitted value (uncontrolled — latest onChange value):</Typography>
              <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
                { criticalSubmitted === '' ? '—' : criticalSubmitted }
              </Typography>
            </ColumnStack>
          : null }
        </ColumnStack>
      </Example>

      <Example
        label="7. Read-only, the same CRIT- ids"
        hint="The same regex drives the view-only display. CRIT-0000-0000-0000 matches the format but is not in the list, so it stays flagged rather than silently rendering as a normal chip."
      >
        <AutoCompletableTextAreaReadOnly<CriticalIssue>
          text={ READ_ONLY_TEXT_CRITICAL }
          getItemRegex={ getCriticalIssueRegex }
          resolveItem={ resolveCriticalIssueById }
          itemDisplayFunction={ criticalIssueDisplay }
          itemCopyContentFunction={ criticalIssueCopyContent }
          detailsDialogTitle="Critical issue"
          chipClassName="border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20"
        />
      </Example>
    </ColumnStack>
  );
}
