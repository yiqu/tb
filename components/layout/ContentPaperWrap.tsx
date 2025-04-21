import Paper from '@mui/material/Paper';

import omit from 'lodash/omit';

import type { ReactNode } from 'react';
import type { PaperProps } from '@mui/material/Paper';

function ContentPaperWrap({ children, paperProps }: { children: ReactNode; paperProps?: PaperProps }) {
  return (
    <Paper
      sx={ { width: '100%', py: 2, px: 1, borderRadius: '10px', ...paperProps?.sx } }
      elevation={ 0 }
      variant="outlined"
      { ...omit(paperProps, ['sx']) }
    >
      { children }
    </Paper>
  );
}

export default ContentPaperWrap;
