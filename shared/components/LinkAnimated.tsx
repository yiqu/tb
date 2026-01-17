import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import CenterUnderline from '@/fancy/components/text/underline-center';
import Typography, { typographyVariants } from '@/components/typography/Typography';

interface LinkAnimatedProps
  extends LinkProps<any>, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, VariantProps<typeof typographyVariants> {
  label?: string;
  startAdornment?: ReactNode;
  sectionClassName?: string;
  textClassName?: string;
  children?: ReactNode;
  variant?: VariantProps<typeof typographyVariants>['variant'];
}

export default function LinkAnimated({
  label,
  startAdornment,
  sectionClassName,
  textClassName,
  children,
  variant,
  ...props
}: LinkAnimatedProps) {
  const content =
    children ? children : (
      <Typography className={ cn('', textClassName) } variant={ variant }>
        { label }
      </Typography>
    );

  return (
    <Link { ...props }>
      <div className={ cn('flex flex-row items-center justify-start gap-x-1', sectionClassName) }>
        { startAdornment ? startAdornment : null }
        <CenterUnderline label={ content } className={ textClassName } />
      </div>
    </Link>
  );
}
