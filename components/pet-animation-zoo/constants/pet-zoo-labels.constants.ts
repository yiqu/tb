/** Every piece of text the zoo shows, kept in one place. */

export const PET_ZOO_LABELS = {
  zooAriaLabel: 'Pet animation zoo',
  resizeHandleAriaLabel: 'Resize the pet animation zoo',
  resizeHandleTitle: 'Drag to resize, double-click to reset',

  spawnPet: 'Spawn pet',
  throwBall: 'Throw ball',
  feed: 'Feed',
  deletePet: 'Delete pet',
  changeTheme: 'Change theme',
  maxPetsReached: 'The zoo is full',

  ok: 'OK',
  cancel: 'Cancel',

  spawnPetDialogTitle: 'Spawn a pet',
  spawnPetDialogDescription: 'Pick a pet and a color, then give it a name.',
  petTypeLabel: 'Pet',
  petTypePlaceholder: 'Choose a pet',
  petColorLabel: 'Color',
  petColorPlaceholder: 'Choose a color',
  petNameLabel: 'Name',
  petNamePlaceholder: 'Name your pet',
  locked: 'Locked',
  /** `{date}` is replaced by the day it unlocks. */
  unlocksOn: 'Unlocks {date}',
  petLockedError: 'This pet is locked',

  deletePetDialogTitle: 'Delete a pet',
  deletePetDialogDescription: 'Choose which pet leaves the zoo.',
  deletePetLabel: 'Pet',
  deletePetPlaceholder: 'Choose a pet',
  noPetsToDelete: 'There are no pets in the zoo.',

  changeThemeDialogTitle: 'Change theme',
  changeThemeDialogDescription: 'Choose a background for the zoo.',
  themeLabel: 'Theme',
  themePlaceholder: 'Select a theme',
  themeLockedError: 'This theme is locked',
} as const;
