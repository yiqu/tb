import ColumnStack from '@/shared/components/ColumnStack';

import ContentDisplay from './ContentDisplay';

type Props = {
  items: { id: number; name: string }[];
};

export default function ContentMainContent({ items }: Props) {
  return (
    <main className="flex-1 border-l p-4">
      <ColumnStack className="gap-y-4">
        { items.map((item) => (
          <ContentDisplay key={ item.id } item={ item } />
        )) }
      </ColumnStack>
    </main>
  );
}

