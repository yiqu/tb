import ColumnStack from '@/shared/components/ColumnStack';

import ToDoList from './_components/ToDoList';
import TitleText from './_components/TitleText';
import Completed from './_components/Completed';
import InProgress from './_components/InProgress';
import BackgroundTodoBoard from './_components/BackgroundTodoBoard';

export default function TestToDoBoardPage({}: PageProps<'/test-todo-board'>) {
  return (
    <ColumnStack className="relative items-center">
      <TitleText />
      <BackgroundTodoBoard>
        <div className="flex-1 overflow-y-auto px-2">
          <ToDoList />
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          <InProgress />
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          <Completed />
        </div>
      </BackgroundTodoBoard>
      
    </ColumnStack>
  );
}
