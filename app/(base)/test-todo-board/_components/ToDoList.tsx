import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

export default function ToDoList() {
  return (
    <ColumnStack>
      { TO_DO_ITEMS.map((item) => (
        <RowStack key={ item.id }>
          <Typography className="font-fun text-2xl">{ item.description }</Typography>
        </RowStack>
      )) }
    </ColumnStack>
  );
}

const TO_DO_ITEMS = [
  {
    id: 1,
    title: 'Complete the todo board',
    description: 'To Do the todo list',
  },
  {
    id: 2,
    title: 'Complete the todo board',
    description: 'To Do the todo list',
  },
];
