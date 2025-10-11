'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import Typography from '@/components/typography/Typography';

import ActionBar from './ActionBar';
import CitySelect from './CitySelect';
import StateSelect from './StateSelect';

export default function FormSelectDepend() {
  const methods = useForm<FormSubmitData>({
    defaultValues: {
      state: '',
      city: '',
    },
  });

  const [state, setState] = useState<string>('');

  const onSubmitForm = (_data: FormSubmitData) => {
    console.log('onSubmitForm');
  };

  const handleOnStateChange = (state: string) => {
    setState(state);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Typography>Select a value, trigger the next select to update.</Typography>
      <Card>
        <CardContent>
          <Form { ...methods }>
            <form onSubmit={ methods.handleSubmit(onSubmitForm) } className={ `` }>
              <div className="flex flex-row items-center justify-start gap-x-2">
                <StateSelect onChanged={ handleOnStateChange } />
                <CitySelect state={ state } />
              </div>
              <ActionBar />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

type FormSubmitData = {
  state: string;
  city: string;
};
