/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// 0.75rem = 12px
// 0.875rem = 14px
// 1rem = 16px
// 1.25rem = 20px
// 1.5rem = 24px
// 1.75rem = 28px
// 2rem = 32px

// h1: 36px
// h2: 30px
// h3: 24px
// h4: 20px
// h5: 18px
// h6: 16px

// p: 14px

// thin = 100
// extralight = 200
// light = 300
// normal = 400
// medium = 500
// semibold = 600
// bold = 700
// extrabold = 800
// black = 900

const typographyVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    variant: {
      h1: `text-4xl leading-10 font-semibold tracking-normal`,
      h2: 'text-3xl leading-9 font-semibold tracking-normal',
      h3: 'text-2xl leading-8 font-semibold tracking-normal',
      h4: 'text-xl leading-7 font-semibold tracking-normal',
      h5: 'text-lg leading-7 font-semibold tracking-normal',
      h6: 'text-base leading-6 font-semibold tracking-normal',

      p: `text-[0.875rem] leading-5 tracking-normal [&:not(:first-child)]:mt-6`,

      caption0: `text-[0.65rem] leading-[0.9rem] tracking-normal text-gray-500 dark:text-gray-300`,
      caption1: `text-[0.75rem] leading-4 tracking-normal text-gray-500 dark:text-gray-300`,
      caption2: `text-[0.85rem] leading-5 tracking-normal text-gray-500 dark:text-gray-300`,

      body0: `text-[0.75rem] leading-4 tracking-normal`,
      body1: `text-[0.875rem] leading-5 tracking-normal`,
      body2: `text-[1rem] leading-6 tracking-normal`,

      subtitle0: `text-[0.75rem] leading-4 tracking-normal text-gray-500`,
      subtitle1: `text-[0.875rem] leading-5 tracking-normal text-gray-500`,
      subtitle2: `text-[1rem] leading-6 tracking-normal text-gray-500`,

      nodata0: `text-[0.75rem] leading-4 tracking-normal text-gray-300 italic`,
      nodata1: `text-[0.875rem] leading-5 tracking-normal text-gray-300 italic`,
      nodata2: `text-[1rem] leading-6 tracking-normal text-gray-300 italic`,

      label0: `text-[0.75rem] leading-4 tracking-normal text-gray-600 dark:text-gray-300`,
      label1: `text-[0.875rem] leading-5 tracking-normal text-gray-600 dark:text-gray-300`,
      label2: `text-[1rem] leading-6 tracking-normal text-gray-600 dark:text-gray-300`,

      labelvalue0: `text-[0.75rem] leading-4 tracking-normal`,
      labelvalue1: `text-[0.875rem] leading-5 tracking-normal`,
      labelvalue2: `text-[1rem] leading-6 tracking-normal`,
    },
  },
  defaultVariants: { variant: 'body1' },
});

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  children?: ReactNode;
}

export default function Typography({ children, variant = 'body1', as, className, ...props }: TypographyProps) {
  if (intrinsicElements.includes(variant ?? '')) {
    const Tag = as || (variant as intrinsicElementType) || 'p';

    return (
      <Tag className={ cn(typographyVariants({ variant: variant, className: className })) } { ...props }>
        { children }
      </Tag>
    );
  }
  return (
    <p className={ cn(typographyVariants({ variant: variant, className: className })) } { ...props }>
      { children }
    </p>
  );
}

const intrinsicElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'p'];
type intrinsicElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
