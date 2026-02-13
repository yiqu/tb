import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

export default function InProgress() {
  return (
    <ColumnStack>
      { IN_PROGRESS_ITEMS.map((item) => (
        <RowStack key={ item.id }>
          <Typography>{ item.description }</Typography>
        </RowStack>
      )) }
    </ColumnStack>
  );
}

const IN_PROGRESS_ITEMS = [
  {
    id: 1,
    title: 'Complete the todo board',
    description: 'In progress the todo board',
  },
  {
    id: 2,
    title: 'Complete the todo board',
    description: 'In progress the todo board',
  },
  {
    id: 3,
    title: 'Complete the todo board',
    description: 'In progress the todo board',
  },
];
