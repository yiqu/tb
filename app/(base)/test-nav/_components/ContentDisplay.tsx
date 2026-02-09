import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

type Props = {
  item: { id: number; name: string };
  idPrefix: string;
};

export default function MainContentDisplay({ item, idPrefix }: Props) {
  return (
    <div id={ `${idPrefix}-${item.id}` }>
      <ColumnStack
        className={ cn('rounded-md border border-dashed', {
          'h-40': item.name === 'small',
          'h-60': item.name === 'medium',
          'h-80': item.name === 'large',
        }) }
      >
        <Typography variant="h5">{ item.id }</Typography>
        <Typography variant="h6">{ item.name }</Typography>
      </ColumnStack>
    </div>
  );
}
