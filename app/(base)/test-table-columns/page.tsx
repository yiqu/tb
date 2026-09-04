import ColumnStack from '@/shared/components/ColumnStack';

import TestTableColumnsFixture from './_components/TestTableColumnsFixture';

export default function TestTableColumnsPage({}: PageProps<'/test-table-columns'>) {
  return (
    <ColumnStack className="relative items-center">
      <TestTableColumnsFixture />
    </ColumnStack>
  );
}
