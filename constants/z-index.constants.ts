/**
 * Stacking order for layered UI, expressed as Tailwind z-index classes.
 *
 * Radix renders overlays through portals, so a dialog and the popover opened from inside it end up
 * as sibling nodes under `<body>` rather than nested. Their z-index is what decides which one paints
 * on top, and a floating layer that sits below the dialog backdrop is invisible and unclickable.
 *
 * Use these tokens instead of literal z-index classes on any portalled layer.
 */
export const Z_INDEX_LAYER = {
  /** Modal surfaces and their backdrops: dialog, alert dialog, sheet, drawer. Sits above all page content. */
  modal: 'z-150',
  /**
   * Floating layers opened from a trigger: popover, select, dropdown, context menu, menubar,
   * tooltip, hover card, combobox. Must clear `modal` so they stay usable inside a dialog.
   */
  floating: 'z-200',
} as const;
