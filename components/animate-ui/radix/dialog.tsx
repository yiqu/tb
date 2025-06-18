'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { motion, AnimatePresence, type Transition, type HTMLMotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

type DialogContextType = {
  isOpen: boolean;
};

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const useDialog = (): DialogContextType => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a Dialog');
  }
  return context;
};

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function Dialog({ children, ...props }: DialogProps) {
  const [isOpen, setIsOpen] = React.useState(props?.open ?? props?.defaultOpen ?? false);

  React.useEffect(() => {
    if (props?.open !== undefined) setIsOpen(props.open);
  }, [props?.open]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      props.onOpenChange?.(open);
    },
    [props],
  );

  return (
    <DialogContext.Provider value={ { isOpen } }>
      <DialogPrimitive.Root data-slot="dialog" { ...props } onOpenChange={ handleOpenChange }>
        { children }
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

function DialogTrigger(props: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" { ...props } />;
}

type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;

function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" { ...props } />;
}

type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" { ...props } />;
}

type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={ cn(
        `
          fixed inset-0 z-50 bg-black/80
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:animate-in data-[state=open]:fade-in-0
        `,
        className,
      ) }
      { ...props }
    />
  );
}

type FlipDirection = 'top' | 'bottom' | 'left' | 'right';

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  HTMLMotionProps<'div'> & {
    from?: FlipDirection;
    transition?: Transition;
  };

function DialogContent({
  className,
  children,
  from = 'top',
  transition = { type: 'spring', stiffness: 150, damping: 25 },
  ...props
}: DialogContentProps) {
  const { isOpen } = useDialog();

  const initialRotation = from === 'top' || from === 'left' ? '20deg' : '-20deg';
  const isVertical = from === 'top' || from === 'bottom';
  const rotateAxis = isVertical ? 'rotateX' : 'rotateY';

  return (
    <AnimatePresence>
      { isOpen ? <DialogPortal forceMount data-slot="dialog-portal">
        <DialogOverlay asChild forceMount>
          <motion.div
              key="dialog-overlay"
              initial={ { opacity: 0, filter: 'blur(4px)' } }
              animate={ { opacity: 1, filter: 'blur(0px)' } }
              exit={ { opacity: 0, filter: 'blur(4px)' } }
              transition={ { duration: 0.2, ease: 'easeInOut' } }
            />
        </DialogOverlay>
        <DialogPrimitive.Content asChild forceMount { ...props }>
          <motion.div
              key="dialog-content"
              data-slot="dialog-content"
              initial={ {
                opacity: 0,
                filter: 'blur(4px)',
                transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
              } }
              animate={ {
                opacity: 1,
                filter: 'blur(0px)',
                transform: `perspective(500px) ${rotateAxis}(0deg) scale(1)`,
              } }
              exit={ {
                opacity: 0,
                filter: 'blur(4px)',
                transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
              } }
              transition={ transition }
              className={ cn(
                `
                  fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4
                  rounded-xl border bg-background p-6 shadow-lg
                `,
                className,
              ) }
              { ...props }
            >
            { children }
            <DialogPrimitive.Close className={ `
              absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity
              hover:opacity-100
              focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
              disabled:pointer-events-none
              data-[state=open]:bg-accent data-[state=open]:text-muted-foreground
            ` }>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal> : null }
    </AnimatePresence>
  );
}

type DialogHeaderProps = React.ComponentProps<'div'>;

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div data-slot="dialog-header" className={ cn(`
    flex flex-col space-y-1.5 text-center
    sm:text-left
  `, className) } { ...props } />;
}

type DialogFooterProps = React.ComponentProps<'div'>;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <div data-slot="dialog-footer" className={ cn(`
    flex flex-col-reverse gap-2
    sm:flex-row sm:justify-end
  `, className) } { ...props } />;
}

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={ cn('text-lg leading-none font-semibold tracking-tight', className) }
      { ...props }
    />
  );
}

type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description data-slot="dialog-description" className={ cn('text-sm text-muted-foreground', className) } { ...props } />
  );
}

export {
  Dialog,
  useDialog,
  DialogClose,
  DialogTitle,
  DialogPortal,
  DialogHeader,
  DialogFooter,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  type DialogProps,
  DialogDescription,
  type DialogCloseProps,
  type DialogTitleProps,
  type DialogContextType,
  type DialogPortalProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTriggerProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogDescriptionProps,
};
