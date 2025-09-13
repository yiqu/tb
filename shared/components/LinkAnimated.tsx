import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import CenterUnderline from '@/fancy/components/text/underline-center';

type Props = {
  label: string;
  startAdornment?: ReactNode;
  sectionClassName?: string;
  textClassName?: string;
} & LinkProps<any>;

export default function LinkAnimated({ label, startAdornment, sectionClassName, textClassName, ...props }: Props) {
  return (
    <Link { ...props }>
      <div className={ cn('flex flex-row items-center justify-start gap-x-1', sectionClassName) }>
        { startAdornment }
        <Typography className={ cn('', textClassName) }>
          <CenterUnderline label={ label } />
        </Typography>
      </div>
    </Link>
  );
}
