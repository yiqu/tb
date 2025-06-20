/* eslint-disable better-tailwindcss/multiline */
/* eslint-disable no-unused-vars */
'use client';

import * as React from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90`,
        muted: 'bg-muted text-muted-foreground',
        destructive: `bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40`,
        outline: `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50`,
        secondary: `bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80`,
        ghost: `hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50`,
      },
      size: {
        default: `size-8 rounded-lg [&_svg]:size-4`,
        sm: `size-6 [&_svg]:size-3`,
        md: `size-10 rounded-lg [&_svg]:size-5`,
        lg: `size-12 rounded-xl [&_svg]:size-6`,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type CopyButtonProps = Omit<HTMLMotionProps<'button'>, 'children' | 'onCopy'> &
  VariantProps<typeof buttonVariants> & {
    content?: string;
    delay?: number;
    onCopy?: (content: string) => void;
    isCopied?: boolean;
    onCopyChange?: (isCopied: boolean) => void;
  };

function CopyButton({
  content,
  className,
  size,
  variant,
  delay = 3000,
  onClick,
  onCopy,
  isCopied,
  onCopyChange,
  ...props
}: CopyButtonProps) {
  const [localIsCopied, setLocalIsCopied] = React.useState(isCopied ?? false);
  const Icon = localIsCopied ? CheckIcon : CopyIcon;

  React.useEffect(() => {
    setLocalIsCopied(isCopied ?? false);
  }, [isCopied]);

  const handleIsCopied = React.useCallback(
    (isCopied: boolean) => {
      setLocalIsCopied(isCopied);
      onCopyChange?.(isCopied);
    },
    [onCopyChange],
  );

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopied) return;
      if (content) {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            handleIsCopied(true);
            setTimeout(() => handleIsCopied(false), delay);
            onCopy?.(content);
          })
          .catch((error) => {
            console.error('Error copying command', error);
          });
      }
      onClick?.(e);
    },
    [isCopied, content, delay, onClick, onCopy, handleIsCopied],
  );

  return (
    <motion.button
      data-slot="copy-button"
      whileHover={ { scale: 1.05 } }
      whileTap={ { scale: 0.95 } }
      className={ cn(buttonVariants({ variant, size }), className) }
      onClick={ handleCopy }
      { ...props }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={ localIsCopied ? 'check' : 'copy' }
          data-slot="copy-button-icon"
          initial={ { scale: 0 } }
          animate={ { scale: 1 } }
          exit={ { scale: 0 } }
          transition={ { duration: 0.15 } }
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export { CopyButton, buttonVariants, type CopyButtonProps };
