'use client';

import { cn } from '@/lib/utils';
import { Z_INDEX_LAYER } from '@/constants/z-index.constants';
import {
  DropdownMenuContent as DropdownMenuContentBase,
  DropdownMenuSubContent as DropdownMenuSubContentBase,
} from '@/components/ui/dropdown-menu';

/**
 * Dropdown menu content is portalled to `<body>`, so at the stock z-50 it paints below the dialog
 * backdrop and a menu opened from inside a dialog cannot be clicked. These wrappers lift the menu
 * and its submenus onto the floating layer.
 *
 * The token comes first so a caller's own z-* class still wins, and tailwind-merge drops the base z-50.
 *
 * @param className - The class name to add to the content.
 * @param props - The props to pass to the content.
 * @returns The dropdown menu content on the floating layer.
 */
function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuContentBase>) {
  return <DropdownMenuContentBase className={ cn(Z_INDEX_LAYER.floating, className) } { ...props } />;
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuSubContentBase>) {
  return <DropdownMenuSubContentBase className={ cn(Z_INDEX_LAYER.floating, className) } { ...props } />;
}

export { DropdownMenuContent, DropdownMenuSubContent };
export {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
