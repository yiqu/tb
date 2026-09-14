import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import InputWithMultiSelectNuqsDemos from './InputWithMultiSelectNuqsDemos';
import InputWithMultiSelectHookFormDemo from './InputWithMultiSelectHookFormDemo';
import InputWithMultiSelectUncontrolledDemo from './InputWithMultiSelectUncontrolledDemo';

/** Every InputWithMultiSelect test case, grouped in one section of the playground page. */
export default function InputWithMultiSelectDemos() {
  return (
    <ColumnStack className="w-full gap-y-4 rounded-md border p-4">
      <Typography variant="h4">InputWithMultiSelect</Typography>
      <InputWithMultiSelectUncontrolledDemo />
      <InputWithMultiSelectHookFormDemo />
      <InputWithMultiSelectNuqsDemos />
    </ColumnStack>
  );
}
