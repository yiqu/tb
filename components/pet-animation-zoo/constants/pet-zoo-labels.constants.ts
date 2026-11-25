/**
 * The text of the zoo's controls and dialogs, their validation errors included, kept in one place. What the pets say
 * is in `PET_ZOO_MESSAGES` and in each pet's `voice`.
 */

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
  petTypeRequiredError: 'Choose a pet',
  petColorRequiredError: 'Choose a color',
  petNameRequiredError: 'Give your pet a name',
  /** `{max}` is replaced by the longest name allowed. */
  petNameTooLongError: 'A name can be up to {max} characters',

  deletePetDialogTitle: 'Delete a pet',
  deletePetDialogDescription: 'Choose which pet leaves the zoo.',
  deletePetLabel: 'Pet',
  deletePetPlaceholder: 'Choose a pet',
  noPetsToDelete: 'There are no pets in the zoo.',
  deletePetRequiredError: 'Choose a pet',

  changeThemeDialogTitle: 'Change theme',
  changeThemeDialogDescription: 'Choose a background for the zoo.',
  themeLabel: 'Theme',
  themePlaceholder: 'Select a theme',
  themeLockedError: 'This theme is locked',
  themeRequiredError: 'Choose a theme',
} as const;
