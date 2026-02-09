import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';

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

const MOCK_ITEMS: { id: number; name: string }[] = Array.from({ length: 10 }, (_, index) => {
  let chance = Math.random();
  let name = 'small';
  if (chance > 0.3) {
    name = 'medium';
  } else if (chance > 0.6) {
    name = 'large';
  } else {
    name = 'small';
  }
  return {
    id: index + 1,
    name,
  };
});
