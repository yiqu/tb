import { File, Search, Calendar, ReceiptText, LucideProps } from 'lucide-react';

import { FavoriteEntityEntityTypeType } from '@/models/favorites/favorite.model';

interface Props {
  entity: FavoriteEntityEntityTypeType;
}

export default function EntityDisplayMedia({ entity, ...lucideProps }: Props & LucideProps) {
  if (entity === 'BILL_DUE') {
    return <Calendar className="size-4" { ...lucideProps } />;
  }

  if (entity === 'SUBSCRIPTION') {
    return (
      <div>
        <ReceiptText className="size-4" { ...lucideProps } />
      </div>
    );
  }

  if (entity === 'SEARCH_QUERY') {
    return <Search className="size-4" { ...lucideProps } />;
  }

  return (
    <div>
      <File className="size-4" { ...lucideProps } />
    </div>
  );
}
