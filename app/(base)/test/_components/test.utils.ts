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
 * Get the prefix for the autocomplete item id. This should guarantee all the IDs will have this prefix.
 */
export const getAutocompleteItemIdPrefix = <T>(item: T): string => {
  return 'GIST-';
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

export const SOME_INIT_TEXT: string =
  'This initial text mentions GIST-3333333 which becomes a chip. = GIST-1111111 != GIST-3333333 ~= GIST-2222222 and there..';
