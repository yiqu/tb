import { ReactNode } from 'react';

/**
 * Types shared by the editable (`auto-completable-textarea`) and read-only
 * (`auto-completable-textarea-read-only`) autocomplete components.
 *
 * These exist so identical SIGNATURES cannot drift apart. They deliberately do NOT merge the two
 * components' prop interfaces or menu contexts — each component keeps its own, so neither grows
 * props it does not use.
 */

/** Returns the text to show for an item, e.g. `gist => gist.alias`. */
export type ItemDisplayFunction<T> = (item: T) => string;

/** Renders the body of an item's details dialog. */
export type RenderItemDetails<T> = (item: T) => ReactNode;

/**
 * One entry of a chip's popover menu.
 *
 * Generic over the CONTEXT rather than over the item type: each component supplies its own context
 * shape (the editable one exposes edit/remove, the read-only one exposes view-details), so the two
 * menus stay completely independent while sharing this one config shape.
 */
export interface ChipMenuItemConfig<TContext> {
  /** Unique key for React rendering. */
  key: string;
  /** Label shown in the menu, can be any node. */
  label: ReactNode;
  /** Optional leading icon node. */
  icon?: ReactNode;
  /** Renders the entry in the destructive (red) style. */
  destructive?: boolean;
  /** Greys out the entry — e.g. an action that needs an item that could not be resolved. */
  isDisabled?: (context: TContext) => boolean;
  /** Runs when the entry is picked. */
  onSelect: (context: TContext) => void;
}
