import { File, Calendar, ReceiptText, LucideProps } from 'lucide-react';

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

  return (
    <div>
      <File className="size-4" { ...lucideProps } />
    </div>
  );
}
