import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutParent from '@/components/layout/LayoutParent';
import { AuroraText } from '@/components/magicui/aurora-text';
import { APP_TITLE_GRADIENT_COLORS } from '@/constants/constants';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import LayoutChildrenParent from '@/components/layout/LayoutChildrenParent';

export default async function AccountLayout({ content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <div id="account-layout-parent">
      <LayoutParent>
        <LayoutWithGutter size="med">
          <section className="w-full">
            <PageTitle
              title={ <AuroraText colors={ APP_TITLE_GRADIENT_COLORS.account }>Account</AuroraText> }
              subText="Manage your account settings"
            />
          </section>
        </LayoutWithGutter>
      </LayoutParent>
      <Separator />
      <LayoutChildrenParent>{ content }</LayoutChildrenParent>
    </div>
  );
}
