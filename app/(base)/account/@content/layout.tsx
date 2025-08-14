import Grid from '@mui/material/Grid';

import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

import AccountLeftNav from '../_components/AccountLeftNav';
import AccountContentTabsParent from '../_components/AccountContentTabsParent';

// export const metadata: Metadata = {
//   title: {
//     template: `%s | Account | ${appName}`, // child pages will use this template
//     default: `General | Account | ${appName}`, // the title for this defined in
//   },
//   description: '',
// };

interface AccountContentLayoutProps {
  children: React.ReactNode;
  params: Promise<{}>;
}

export default function AccountContentLayout({ children }: AccountContentLayoutProps) {
  return (
    <LayoutWithGutter size="med">
      <div className="h-full w-full">
        <Grid container width="100%" spacing={ 4 }>
          <Grid size={ { xs: 1, sm: 3 } }>
            <AccountLeftNav />
          </Grid>
          <Grid size={ { xs: 11, sm: 9 } }>
            <AccountContentTabsParent>{ children }</AccountContentTabsParent>
          </Grid>
        </Grid>
      </div>
    </LayoutWithGutter>
  );
}
