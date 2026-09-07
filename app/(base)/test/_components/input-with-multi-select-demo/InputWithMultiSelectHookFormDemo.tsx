'use client';

import { z } from 'zod';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import HFInputWithMultiSelect from '@/components/input-with-multi-select/RHF/HFInputWithMultiSelect';
import { inputWithMultiSelectValueSchema } from '@/validators/input-with-multi-select/input-with-multi-select.schema';

import { ID_SEARCH_OPTIONS } from './input-with-multi-select-demo.constants';

const idSearchFormSchema = z.object({
  idSearch: inputWithMultiSelectValueSchema,
});

type IdSearchFormValues = z.infer<typeof idSearchFormSchema>;

/**
 * react-hook-form test case: the field value is the whole `{ input, selection }` object and is
 * validated by the shared zod validator (selection required, input required after trim).
 */
export default function InputWithMultiSelectHookFormDemo() {
  const methods = useForm<IdSearchFormValues>({
    defaultValues: {
      idSearch: {
        input: 'req-4821',
        selection: ID_SEARCH_OPTIONS[1],
      },
    },
    resolver: zodResolver(idSearchFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const currentValue = methods.watch('idSearch');

  const handleOnSubmit = (data: IdSearchFormValues) => {
    toast.success(`Searching ${data.idSearch.selection?.display} = ${data.idSearch.input.trim()}`);
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">HFInputWithMultiSelect — react-hook-form</Typography>
      <Typography variant="caption1">
        Default selection is Request ID with a default input value. Clear the input and submit to see the zod validator complain.
      </Typography>
      <Form { ...methods }>
        <form onSubmit={ methods.handleSubmit(handleOnSubmit) } className="w-full">
          <ColumnStack className="w-full gap-y-3">
            <HFInputWithMultiSelect<IdSearchFormValues, 'idSearch'>
              control={ methods.control }
              name="idSearch"
              label="Search by id"
              description="Enter submits the component's own onSubmit; the button below submits the form."
              options={ ID_SEARCH_OPTIONS }
              placeholder="Type an id..."
            />
            <RowStack className="gap-x-2">
              <Button type="submit" size="sm">
                Submit form
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={ () => methods.reset() }>
                Reset
              </Button>
            </RowStack>
          </ColumnStack>
        </form>
      </Form>
      <ColumnStack className="gap-y-1">
        <Typography variant="label1">Live form value</Typography>
        <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
          { JSON.stringify(currentValue, null, 2) }
        </Typography>
      </ColumnStack>
    </ColumnStack>
  );
}
