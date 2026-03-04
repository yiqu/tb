import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

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
      <LayoutChildrenParent className="mt-2">{ content }</LayoutChildrenParent>
    </div>
  );
}
