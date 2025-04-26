import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';

export default function AccountLayout({ content, children }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <section className="flex h-full w-full flex-col gap-y-4">
      <LayoutWithGutter size="med">
        <section className="w-full">
          <PageTitle title="Account" subText="Manage your account settings" />
        </section>
      </LayoutWithGutter>
      <Separator />
      { content }
      { children }
    </section>
  );
}
