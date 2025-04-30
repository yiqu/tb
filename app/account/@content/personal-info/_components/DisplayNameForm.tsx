/* eslint-disable readable-tailwind/multiline */
'use client';

import { z } from 'zod';
import { User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState, InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import { updateUserAction } from '@/server/user/user.server';
import { SettingsPersonalInfoDisplayNameActionState } from '@/models/settings/SettingsPersonalInfo';

interface DisplayNameFormProps {
  user: UserProfile | null;
}

export default function DisplayNameForm({ user }: DisplayNameFormProps) {
  const isNewUser: boolean = !user;

  const [state, formAction, isPending] = useActionState<SettingsPersonalInfoDisplayNameActionState, FormData>(
    updateUserAction,
    {
      isSuccess: false,
      statusCode: undefined,
      zodErrorIssues: undefined,
      updatedAt: user?.updatedAt ?? null,
      result: {
        name: user?.name || '',
      },
    },
  );

  console.log(state, isPending, isNewUser);

  return (
    <form action={ formAction }>
      <div className="flex flex-col gap-y-2">
        <DisplayNameFormInput defaultValue={ state.result.name } />
        <DisplayNameFormSubmit isNewUser={ isNewUser } updatedAt={ state.updatedAt } />
        <DisplayNameFormError zodError={ state.zodErrorIssues } />
        <input type="hidden" name="userId" value={ user?.id } />
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

function DisplayNameFormSubmit({
  isNewUser,
  updatedAt,
}: {
  isNewUser: boolean;
  updatedAt: string | Date | null | undefined;
}) {
  const { pending } = useFormStatus();

  return (
    <section className="flex flex-row items-center justify-between">
      <DisplayNameFormUpdatedAt updatedAt={ updatedAt } />
      <Button size="default" type="submit">
        { pending ?
          'Saving...'
        : isNewUser ?
          'Create'
        : 'Save' }
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

function DisplayNameFormUpdatedAt({ updatedAt }: { updatedAt: string | Date | null | undefined }) {
  if (updatedAt) {
    return <Typography variant="body1">{ `Updated: ${updatedAt}` }</Typography>;
  }

  return <div></div>;
}
