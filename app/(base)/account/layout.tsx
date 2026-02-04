import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

// export const metadata: Metadata = {
//   title: 'Settings',
//   description: 'Manage your account settings',
// };

// export const metadata: Metadata = {
//   title: {
//     template: `%s | Account`, // child pages will use this template
//     default: `General | Account`, // the title for this defined in
//   },
//   description: '',
// };

export default function AccountLayout({ content }: LayoutProps<'/account'>) {
  return (
    <div id="account-layout-parent">
      <LayoutParent>
        <LayoutAutoGutter>
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.account }>Account</AuroraText> }
              subText="Manage your account settings"
            />
          </section>
        </LayoutAutoGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>{ content }</LayoutChildrenParent>
    </div>
  );
}
