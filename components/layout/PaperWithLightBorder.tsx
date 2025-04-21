import Paper from '@mui/material/Paper';

import omit from 'lodash/omit';

import type { PaperProps } from '@mui/material/Paper';

export function PaperWithLightBorder({
  children,
  paperProps,
}: {
  children: React.ReactNode;
  paperProps?: PaperProps & any;
}) {
  const borderColor = paperProps?.sx?.borderColor ? paperProps.sx.borderColor : 'var(--color-border)';
  return (
    <Paper
      sx={ {
        px: 1,
        width: '100%',
        borderColor: borderColor,
        ...paperProps?.sx,
        borderRadius: '10px',
        height: '100%',
        backgroundColor: 'var(--color-background)',
      } }
      variant="outlined"
      elevation={ 0 }
      { ...omit(paperProps, ['sx']) }
    >
      { children }
    </Paper>
  );
}
