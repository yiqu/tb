/**
 * The text of Pixel Pals' controls and dialogs, their validation errors included, kept in one place. What the pets say
 * is in `PIXEL_PALS_MESSAGES` and in each pet's `voice`.
 */

export const PIXEL_PALS_LABELS = {
  pixelPalsAriaLabel: 'Pixel Pals',
  resizeHandleAriaLabel: 'Resize Pixel Pals',
  resizeHandleTitle: 'Drag to resize, double-click to reset',

  spawnPet: 'Spawn pet',
  throwBall: 'Throw ball',
  feed: 'Feed',
  deletePet: 'Delete pet',
  changeTheme: 'Change theme',
  maxPetsReached: 'No room for more pets',

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
  petLockedError: 'This pet is locked',
  petTypeRequiredError: 'Choose a pet',
  petColorRequiredError: 'Choose a color',
  petNameRequiredError: 'Give your pet a name',
  /** `{max}` is replaced by the longest name allowed. */
  petNameTooLongError: 'A name can be up to {max} characters',

  deletePetDialogTitle: 'Delete a pet',
  deletePetDialogDescription: 'Choose which pet leaves.',
  deletePetLabel: 'Pet',
  deletePetPlaceholder: 'Choose a pet',
  noPetsToDelete: 'There are no pets yet.',
  deletePetRequiredError: 'Choose a pet',

  changeThemeDialogTitle: 'Change theme',
  changeThemeDialogDescription: 'Choose a background for Pixel Pals.',
  themeLabel: 'Theme',
  themePlaceholder: 'Select a theme',
  themeLockedError: 'This theme is locked',
  themeRequiredError: 'Choose a theme',
  particleLevelOff: 'Off',
  particleLevelValue: '{level}%',
  particleLevelError: 'Choose an amount from 0 to 100',
} as const;
