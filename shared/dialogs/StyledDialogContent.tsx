import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollHide } from '@/hooks/useScrollHide';
import { DialogTitle, DialogClose, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

import RowStack from '../components/RowStack';
import { DEFAULT_STYLED_DIALOG_SCROLLABLE_CONTENT_ID } from './dialog.utils';

type Props = {
  headerTitle?: ReactNode;
  headerDescription?: ReactNode;
  showCloseButton?: boolean;
  children: ReactNode;
  className?: string;
  contentWrapperClassName?: string;
  titleActions?: ReactNode;
} & React.ComponentProps<typeof DialogPrimitive.Content>;

export default function StyledDialogContent({
  headerTitle,
  headerDescription,
  children,
  showCloseButton = true,
  className,
  contentWrapperClassName,
  titleActions,
  ...props
}: Props) {
  return (
    <DialogContent
      className={ cn(
        `
          max-h-[90vh] gap-y-0 overflow-x-auto overflow-y-auto px-0 pt-0 pb-0
          sm:max-w-[800px]
          md:max-w-[1000px]
          lg:max-w-[1200px]
        `,
        className,
      ) }
      showCloseButton={ showCloseButton }
      id={ props.id ?? DEFAULT_STYLED_DIALOG_SCROLLABLE_CONTENT_ID }
      { ...props }
    >
      <HeaderWrapper>
        <RowStack className="items-center justify-between">
          <DialogTitle>{ headerTitle }</DialogTitle>
          { titleActions }
          { showCloseButton ?
            <DialogClose asChild autoFocus={ false }>
              <Button variant="ghost" size="icon-sm" type="button" autoFocus={ false }>
                <X />
              </Button>
            </DialogClose>
          : null }
        </RowStack>
        <DialogDescription asChild>{ headerDescription }</DialogDescription>
      </HeaderWrapper>
      <div className={ cn('px-4', contentWrapperClassName) }>{ children }</div>
    </DialogContent>
  );
}

function HeaderWrapper({ children, ...props }: Props) {
  const { isAtBottom, isAreaScrollable } = useScrollHide(0, props.id ?? DEFAULT_STYLED_DIALOG_SCROLLABLE_CONTENT_ID);
  return (
    <DialogHeader
      className={ cn('sticky top-0 z-10 mb-4 border-b bg-background px-4 py-4', {
        'shadow-sm': !isAtBottom && isAreaScrollable,
      }) }
    >
      { children }
    </DialogHeader>
  );
}
