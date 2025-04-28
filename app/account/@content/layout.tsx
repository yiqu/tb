import Grid from '@mui/material/Grid';

import { getAllUsers } from '@/server/user/user.server';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

import AccountContentTabsParent from '../_components/AccountContentTabsParent';

interface AccountContentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ any: string }>;
}

export default async function AccountContentLayout({ children }: AccountContentLayoutProps) {
  const users = await getAllUsers();
  console.log('users', users);
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
