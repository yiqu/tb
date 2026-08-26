export interface Gist {
  id: string;
  content: string;
  alias: string;
  aliasable: boolean;
}

export const TEST_GISTS: Gist[] = [
  {
    id: 'GIST-1111111',
    content: 'This is the first gist',
    alias: 'My Very Cool Alias 1',
    aliasable: true,
  },
  {
    id: 'GIST-2222222',
    content: 'This is the second gist',
    alias: 'My Very Cool Alias 2',
    aliasable: true,
  },
  {
    id: 'GIST-3333333',
    content: 'This is the third gist',
    alias: 'My Very Cool Alias 3',
    aliasable: false,
  },
  {
    id: 'GIST-4444444',
    content: 'This is the fourth gist',
    alias: 'My Very Cool Alias 4',
    aliasable: true,
  },
  {
    id: 'GIST-5555555',
    content: 'This is the fifth gist',
    alias: 'My Very Cool Alias 5',
    aliasable: false,
  },
  {
    id: 'GIST-6666666',
    content: 'This is the sixth gist',
    alias: 'My Very Cool Alias 6',
    aliasable: true,
  },
  {
    id: 'GIST-7777777',
    content: 'This is the seventh gist',
    alias: 'My Very Cool Alias 7',
    aliasable: false,
  },
  {
    id: 'GIST-8888888',
    content: 'This is the eighth gist',
    alias: 'My Very Cool Alias 8',
    aliasable: true,
  },
  {
    id: 'GIST-9999999',
    content: 'This is the ninth gist',
    alias: 'My Very Cool Alias 9',
    aliasable: true,
  },
];

/**
 * Filter function passed to be used when filtering the list of items to display in the dropdown.
 * @param item
 * @param filter
 * @returns
 */
export const itemFilterFunction = (item: Gist, filter: string) => {
  return item.alias.toLowerCase().includes(filter.toLowerCase());
};

/**
 * Item display function passed to be used when displaying the item inside the text area.
 * @param item
 * @returns
 */
export const textAreaItemDisplay = (item: Gist) => {
  return item.alias;
};

/**
 * The item's actual text to be used when user get the value from this text area. For example, if i hit submit and the value from this text area is going to the normal text, and any autocompleted item's text will be whatever this function returns.
 * Because I might not want what is shown in the text area to be the same as what is actually submitted to the server. For example, if I want to submit the ID of the item, then I would pass in textAreaItemTransformForServerFunction(item => item.id), but the
 * display could be something else in the text area.
 * @param item
 * @returns
 */
export const textAreaItemTransformForServerFunction = (item: Gist) => {
  return item.id;
};

/**
 *  for example GIST-3333333 is length of 12 total
 * @param item
 * @returns
 */
export const getAutocompleteItemIdLength = (item: Gist): number => {
  return 12;
};

/**
 * How you can tell if a string is a autocomplete-able, extract.
 *
 * Takes no argument on purpose: this describes the id FORMAT, which has to be known before any item
 * exists to match against. Unanchored so ids are found inside a sentence (`^...$` would only match a
 * string that is nothing but the id), and the digits match the real ids — GIST- plus 7 digits, i.e.
 * the 12 characters getAutocompleteItemIdLength() reports.
 * @returns
 */
export const getAutocompleteItemRegex = (): RegExp => {
  const re = /GIST-\d{7}/g;
  return re;
};

/**
 * Resolve a matched id back to its gist. Returns undefined for an id that is not in the list —
 * the read-only display then flags it instead of pretending it resolved.
 * @param matchedText
 * @returns
 */
export const resolveGistById = (matchedText: string): Gist | undefined => {
  return TEST_GISTS.find((gist: Gist) => gist.id === matchedText);
};

/**
 * What the read-only chip's "Copy" menu option copies.
 * @param item
 * @returns
 */
export const gistCopyContent = (item: Gist): string => {
  return item.content;
};

// Sample strings for the read-only display examples.
export const READ_ONLY_TEXT_SIMPLE: string = 'Rolled up GIST-1111111 into the release notes. See GIST-4444444 for the follow-up.';

export const READ_ONLY_TEXT_MIXED: string =
  'Deploy blocked: GIST-3333333 is not aliasable and GIST-9999999 needs review.\nUnknown reference GIST-1234567 came from an older export.';

export const READ_ONLY_TEXT_NONE: string = 'This paragraph mentions no gist ids at all, so it renders as ordinary text end to end. GIST-12345671 GIST-123456';

/**
 * Optional callback to disable an item in the dropdown list. Return true and that option cannot be
 * selected (it is also skipped by the keyboard arrow navigation). Here a gist that is not aliasable
 * cannot be picked.
 * @param item
 * @returns
 */
export const isItemDisabled = (item: Gist): boolean => {
  return !item.aliasable;
};

// ---------------------------------------------------------------------------
// Bonus: a completely different object shape to demonstrate that
// AutoCompletableTextArea is composable with any type of item — only the three
// callback functions below change, the component stays the same.
// ---------------------------------------------------------------------------

export interface Teammate {
  email: string;
  name: string;
  team: string;
}

export const TEST_TEAMMATES: Teammate[] = [
  { email: 'ada.lovelace@example.com', name: 'Ada Lovelace', team: 'Platform' },
  { email: 'grace.hopper@example.com', name: 'Grace Hopper', team: 'Compilers' },
  { email: 'alan.turing@example.com', name: 'Alan Turing', team: 'Research' },
  { email: 'katherine.johnson@example.com', name: 'Katherine Johnson', team: 'Trajectory' },
  { email: 'linus.torvalds@example.com', name: 'Linus Torvalds', team: 'Kernel' },
  { email: 'margaret.hamilton@example.com', name: 'Margaret Hamilton', team: 'Guidance' },
];

/**
 * Filter function for teammates: matches on name, email or team.
 */
export const teammateFilterFunction = (item: Teammate, filter: string) => {
  const query = filter.toLowerCase();
  return item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query) || item.team.toLowerCase().includes(query);
};

/**
 * Chip display for teammates: show the friendly name inside the text area.
 */
export const teammateTextAreaItemDisplay = (item: Teammate) => {
  return item.name;
};

/**
 * Server transform for teammates: submit the email instead of the displayed name.
 */
export const teammateTransformForServerFunction = (item: Teammate) => {
  return item.email;
};

/**
 * How the read-only display recognises a teammate inside a plain string: an @example.com address.
 * Takes no argument — it describes the FORMAT, needed before any item exists to match against.
 * @returns
 */
export const getTeammateEmailRegex = (): RegExp => {
  return /[a-zA-Z0-9._%+-]+@example\.com/g;
};

/**
 * Resolve a matched email back to its teammate. Undefined for an address that is not on the team.
 * @param matchedText
 * @returns
 */
export const resolveTeammateByEmail = (matchedText: string): Teammate | undefined => {
  return TEST_TEAMMATES.find((teammate: Teammate) => teammate.email.toLowerCase() === matchedText.toLowerCase());
};

/**
 * What the read-only teammate chip's "Copy" menu option copies.
 * @param item
 * @returns
 */
export const teammateCopyContent = (item: Teammate): string => {
  return `${item.name} (${item.team})`;
};

// Sample string for the read-only teammate example — one address is not on the team.
export const READ_ONLY_TEXT_TEAMMATES: string =
  'Reviewers: ada.lovelace@example.com and grace.hopper@example.com signed off. Chase nobody@example.com for the last approval.';

export const SOME_INIT_TEXT: string =
  'This initial text mentions GIST-3333333 which becomes a chip. = GIST-1111111 != GIST-3333333 ~= GIST-2222222 and there.. GIST-2222221';

// ---------------------------------------------------------------------------
// Production-shaped example: ids look like CRIT-0000-0000-0000 — the literal
// "CRIT", then three dash-separated groups of four digits.
// ---------------------------------------------------------------------------

export interface CriticalIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  owner: string;
}

export const TEST_CRITICAL_ISSUES: CriticalIssue[] = [
  { id: 'CRIT-1042-8871-3390', title: 'Checkout times out under load', severity: 'high', owner: 'Platform' },
  { id: 'CRIT-9930-1177-4028', title: 'Duplicate invoices on retry', severity: 'high', owner: 'Billing' },
  { id: 'CRIT-2261-5540-9913', title: 'Session dropped on token refresh', severity: 'medium', owner: 'Identity' },
  { id: 'CRIT-7788-0031-6620', title: 'Stale totals in the nightly report', severity: 'low', owner: 'Data' },
  { id: 'CRIT-3345-9902-1187', title: 'Webhook retries fire twice', severity: 'medium', owner: 'Integrations' },
];

/**
 * How a critical-issue id is recognised inside plain text: CRIT-0000-0000-0000.
 *
 * Deliberately UNGUARDED — no \b word boundaries — because ids are often typed flush against
 * neighbouring characters and those still need to match. The trade-off: a longer run is matched
 * greedily from the left, so 'CRIT-1042-8871-33901' chips the first twelve digits and leaves the
 * trailing '1' as text, and 'XCRIT-1042-8871-3390' matches from the C. Add \b at both ends
 * (/\bCRIT-\d{4}-\d{4}-\d{4}\b/g) to reject those instead.
 *
 * Takes no argument: it describes the id FORMAT, needed before any item exists to match against.
 * @returns
 */
export const getCriticalIssueRegex = (): RegExp => {
  return /CRIT-\d{4}-\d{4}-\d{4}/g;
};

/** Filter for the dropdown: matches on title, owner or id. */
export const criticalIssueFilterFunction = (item: CriticalIssue, filter: string) => {
  const query = filter.toLowerCase();
  return item.title.toLowerCase().includes(query) || item.owner.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
};

/** What a chip shows: the human-readable title, not the id. */
export const criticalIssueDisplay = (item: CriticalIssue) => {
  return item.title;
};

/** What goes to the server, and what a chip serializes to: the CRIT- id. */
export const criticalIssueTransformForServer = (item: CriticalIssue) => {
  return item.id;
};

/** Resolves a matched id back to its issue; undefined for an id that is not ours. */
export const resolveCriticalIssueById = (matchedText: string): CriticalIssue | undefined => {
  return TEST_CRITICAL_ISSUES.find((issue: CriticalIssue) => issue.id === matchedText);
};

/** What the read-only chip's "Copy" option copies. */
export const criticalIssueCopyContent = (item: CriticalIssue) => {
  return `${item.id} — ${item.title} (${item.severity}, ${item.owner})`;
};

// Sample text: two real ids, one that matches the format but is not in the list.
export const READ_ONLY_TEXT_CRITICAL: string =
  'Escalated CRIT-1042-8871-3390 after the outage; it blocks CRIT-9930-1177-4028.\nCRIT-0000-0000-0000 came from an older export and no longer resolves.';

export const CRITICAL_INIT_TEXT: string = 'Rollback plan tracked under CRIT-2261-5540-9913. ';
