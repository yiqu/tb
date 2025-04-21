import Grid from '@mui/material/Grid';

import omit from 'lodash/omit';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { GridProps } from '@mui/material/Grid';

export interface LayoutGutterProps {
  children: ReactNode;
  size?: 'full' | 'widest' | 'wider' | 'wide' | 'large' | 'med' | 'narrow' | 'narrower' | 'small' | 'skinny';
  //       12,      11.5       11        10,      9         7,        6,          5.5         5,      4
  gridProps?: GridProps;
}

function LayoutWithGutter({ children, size = 'full', gridProps }: LayoutGutterProps) {
  return (
    <Grid container className="layout-with-gutter-container-parent">
      <Grid
        className={ cn('layout-with-gutter-parent', gridProps?.className) }
        size={ {
          xs: 12,
          sm:
            size === 'full' ? 12
            : size === 'widest' ? 11.5
            : size === 'wider' ? 11
            : size === 'wide' ? 10
            : size === 'large' ? 9
            : size === 'med' ? 7
            : size === 'narrow' ? 6
            : size === 'narrower' ? 5.5
            : size === 'small' ? 5
            : size === 'skinny' ? 4
            : 3,
        } }
        offset={ {
          xs: 0,
          sm:
            size === 'full' ? 0
            : size === 'widest' ? 0.25
            : size === 'wider' ? 0.5
            : size === 'wide' ? 1
            : size === 'large' ? 1.5
            : size === 'med' ? 2.5
            : size === 'narrow' ? 3
            : size === 'narrower' ? 3.25
            : size === 'small' ? 3.5
            : size === 'skinny' ? 4
            : 6,
        } }
        { ...omit(gridProps, 'className') }
      >
        { children }
      </Grid>
    </Grid>
  );
}

export default LayoutWithGutter;
