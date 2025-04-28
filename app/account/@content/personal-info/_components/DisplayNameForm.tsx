/* eslint-disable readable-tailwind/multiline */
'use client';
import { z } from 'zod';
import { User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState, InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import { updateUserAction } from '@/server/user/user.server';
import { SettingsPersonalInfoDisplayNameActionState } from '@/models/settings/SettingsPersonalInfo';

export default function DisplayNameForm() {
  const [state, formAction, isPending] = useActionState<SettingsPersonalInfoDisplayNameActionState, FormData>(
    updateUserAction,
    {
      isSuccess: false,
      statusCode: undefined,
      zodErrorIssues: undefined,
      result: {
        displayName: '',
      },
    },
  );

  console.log(state, isPending);

  return (
    <form action={ formAction }>
      <div className="flex flex-col gap-y-2">
        <DisplayNameFormInput defaultValue={ state.result.displayName } />
        <DisplayNameFormSubmit />
        <DisplayNameFormError zodError={ state.zodErrorIssues } />
      </div>
    </form>
  );
}

function DisplayNameFormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>
        { <User size={ 16 } /> }
      </div>
      <Input className="pl-10" name="displayName" placeholder="Please use 32 characters at maximum." { ...props } />
    </div>
  );
}

function DisplayNameFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <section className="flex items-center justify-end">
      <Button size="default" type="submit">
        { pending ? 'Saving...' : 'Save' }
      </Button>
    </section>
  );
}

function DisplayNameFormError({ zodError }: { zodError: z.ZodIssue[] | undefined }) {
  if (zodError && zodError.length > 0) {
    return (
      <div className="flex flex-col gap-y-1">
        { zodError.map((issue) => {
          return (
            <Typography variant="body1" key={ issue.message } className="text-destructive">
              { issue.message }
            </Typography>
          );
        }) }
      </div>
    );
  }

  return <div></div>;
}
