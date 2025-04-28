import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

export default async function AccountLayout({ content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <section className="flex h-full w-full flex-col gap-y-10">
      <LayoutWithGutter size="med">
        <section className="w-full">
          <PageTitle title="Account" subText="Manage your account settings" />
        </section>
      </LayoutWithGutter>
      <Separator />
      { content }
    </section>
  );
}
