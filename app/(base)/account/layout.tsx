import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import { AuroraText } from '@/components/magicui/aurora-text';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

const titleColors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'];

export default async function AccountLayout({ content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <section className="flex h-full w-full flex-col gap-y-10">
      <LayoutWithGutter size="med">
        <section className="w-full">
          <PageTitle
            title={ <AuroraText colors={ titleColors }>Account</AuroraText> }
            subText="Manage your account settings"
          />
        </section>
      </LayoutWithGutter>
      <Separator />
      { content }
    </section>
  );
}
