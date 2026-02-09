import ColumnStack from '@/shared/components/ColumnStack';

import ContentDisplay from './ContentDisplay';

type Props = {
  items: { id: number; name: string }[];
  idPrefix: string;
};

export default function ContentMainContent({ items, idPrefix }: Props) {
  return (
    <main className="flex-1 border-l p-4">
      <ColumnStack className="gap-y-4">
        { items.map((item, _index, _array) => (
          <ContentDisplay key={ item.id } item={ item } idPrefix={ idPrefix } />
        )) }
      </ColumnStack>
    </main>
  );
}

