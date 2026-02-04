import Grid from '@mui/material/Grid';

import omit from 'lodash/omit';

import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';
import type { GridProps as Grid2Props } from '@mui/material/Grid';

export interface LayoutGutterProps {
  children: ReactNode;
  size?: 'full' | 'widest' | 'wider' | 'wide' | 'large' | 'med' | 'narrow' | 'narrower' | 'small' | 'skinny';
  //       12,      11.5       11        10,      9         7,        6,          5.5         5,      4
  gridProps?: Grid2Props;
  className?: string;
}

/**
 * Needs <Stack> wrapper that has no spacing set.
 * e.g.
 * <Stack width="100%">
 *  <LayoutWithGutter>
 *    {children}
 * </LayoutWithGutter>
 * </Stack>
 *  md: 1920,
 * @param param0
 * @returns
 */
function LayoutAutoGutter({ gridProps, children, className }: LayoutGutterProps) {
  return (
    <Grid container className={ cn('layout-with-gutter-auto-container-parent', className) }>
      <Grid
        className="section-layout-with-auto-gutter"
        size={ {
          mobile: 12,
          xxs: 12,
          xs: 11.5,
          sm: 11.5,
          md: 11,
          lg: 11,
          xl: 10,
          xxl: 10,
        } }
        offset={ {
          mobile: 0,
          xxs: 0,
          xs: 0.25,
          sm: 0.25,
          md: 0.5,
          lg: 0.5,
          xl: 1,
          xxl: 1,
        } }
        { ...omit(gridProps, ['size', 'className']) }
      >
        { children }
      </Grid>
    </Grid>
  );
}

export default LayoutAutoGutter;
