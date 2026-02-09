import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';

import { MOCK_ITEMS } from './_components/utils';
import PageContent from './_components/PageContent';
import DialogContent from './_components/DialogContent';

export default function NavigationPlaygroundPage({}: PageProps<'/test-nav'>) {
  return (
    <ColumnStack>
      <DialogContent ids={ MOCK_ITEMS.map((item) => `content-${item.id}`) } />
      <Separator className="my-4" />
      <PageContent />
    </ColumnStack>
  );
}
