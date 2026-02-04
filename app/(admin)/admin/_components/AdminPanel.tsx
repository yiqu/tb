import PageLayout from '@/shared/PageLayout';
import { Separator } from '@/components/ui/separator';
import PageTitle from '@/components/headings/PageTitle';
import LayoutAutoGutter from '@/components/layout/LayoutAutoGutter';

export default function AdminPanel() {
  return (
    <PageLayout className="gap-y-10">
      <LayoutAutoGutter>
        <section className="w-full">
          <PageTitle title="Admin" subText="Admin only dashboard" />
        </section>
      </LayoutAutoGutter>
      <Separator />
    </PageLayout>
  );
}
