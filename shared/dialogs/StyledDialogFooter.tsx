'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollHide } from '@/hooks/useScrollHide';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

import RowStack from '../components/RowStack';
import {
  DEFAULT_STYLED_DIALOG_FOOTER_ID,
  DEFAULT_STYLED_DIALOG_TOP_SHADOW_CSS_CLASS,
  DEFAULT_STYLED_DIALOG_SCROLLABLE_CONTENT_ID,
} from './dialog.utils';

type Props = {
  children?: ReactNode;
  showCloseButton?: boolean;
} & React.ComponentProps<'div'>;

export default function StyledDialogFooter({ children, showCloseButton = false, className, ...props }: Props) {
  const { isAtBottom } = useScrollHide(0, props.id ?? DEFAULT_STYLED_DIALOG_SCROLLABLE_CONTENT_ID);
  return (
    <DialogFooter
      id={ props.id ?? DEFAULT_STYLED_DIALOG_FOOTER_ID }
      className={ cn(
        `sticky bottom-0 z-10 mt-4 -ml-4 flex w-[calc(100%+2rem)] border-t border-border bg-sidebar px-4 py-4`,
        {
          [DEFAULT_STYLED_DIALOG_TOP_SHADOW_CSS_CLASS]: isAtBottom,
        },
        className,
      ) }
      showCloseButton={ showCloseButton }
      { ...props }
    >
      { children ?
        children
      : <RowStack className="items-center justify-between gap-x-2">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            <X />
            Cancel
          </Button>
        </DialogClose>
        <div> </div>
      </RowStack>
      }
    </DialogFooter>
  );
}
