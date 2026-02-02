import Grid from '@mui/material/Grid';

import type { ReactNode } from 'react';
import type { GridProps as Grid2Props } from '@mui/material/Grid';

export interface LayoutGutterProps {
  children: ReactNode;
  size?: 'full' | 'widest' | 'wider' | 'wide' | 'large' | 'med' | 'narrow' | 'narrower' | 'small' | 'skinny';
  //       12,      11.5       11        10,      9         7,        6,          5.5         5,      4
  gridProps?: Grid2Props;
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
function LayoutAutoGutter({ gridProps, children }: LayoutGutterProps) {
  return (
    <Grid
      className="section-layout-with-auto-gutter"
      container
      size={ {
        mobile: 12,
        xxs: 12,
        xs: 11.5,
        sm: 11.5,
        md: 11.5,
        lg: 11.5,
        xl: 11.5,
        xxl: 11.5,
      } }
      offset={ {
        mobile: 0,
        xxs: 0,
        xs: 0.25,
        sm: 0.25,
        md: 0.25,
        lg: 0.25,
        xl: 0.25,
        xxl: 0.25,
      } }
      { ...gridProps }
    >
      { children }
    </Grid>
  );
}

export default LayoutAutoGutter;
