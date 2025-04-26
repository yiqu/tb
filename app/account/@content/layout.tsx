import Grid from '@mui/material/Grid';

import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

import AccountContentTabsParent from '../_components/AccountContentTabsParent';

interface AccountContentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ any: string }>;
}

export default function AccountContentLayout({ children }: AccountContentLayoutProps) {
  return (
    <LayoutWithGutter size="med">
      <div className="h-full w-full">
        <Grid container width="100%">
          <Grid size={ { xs: 1, sm: 3 } }>MEta</Grid>
          <Grid size={ { xs: 11, sm: 9 } }>
            <AccountContentTabsParent>{ children }</AccountContentTabsParent>
          </Grid>
        </Grid>
      </div>
    </LayoutWithGutter>
  );
}
