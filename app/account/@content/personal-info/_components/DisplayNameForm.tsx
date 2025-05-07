/* eslint-disable readable-tailwind/multiline */
'use client';

import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { User, Save, ShieldCheck } from 'lucide-react';
import { useActionState, InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import useDuration from '@/hooks/useDuration';
import useIsClient from '@/hooks/useIsClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import { updateUserAction } from '@/server/user/user.server';
import { SettingsPersonalInfoDisplayNameActionState } from '@/models/settings/SettingsPersonalInfo';

interface DisplayNameFormProps {
  user: UserProfile | null;
}

export default function DisplayNameForm({ user }: DisplayNameFormProps) {
  const isNewUser: boolean = !user;
  const [state, formAction] = useActionState<SettingsPersonalInfoDisplayNameActionState, FormData>(updateUserAction, {
    isSuccess: false,
    statusCode: undefined,
    zodErrorIssues: undefined,
    updatedAt: user?.updatedAt ?? null,
    result: {
      name: user?.name || '',
    },
  });

  return (
    <form action={ formAction }>
      <div className="flex flex-col gap-y-2">
        <DisplayNameFormInput defaultValue={ user?.name || '' } isAdmin={ user?.isAdmin || false } />
        <Separator orientation="horizontal" className="my-2" />
        <DisplayNameFormSubmit isNewUser={ isNewUser } updatedAt={ user?.updatedAt } />
        <DisplayNameFormError zodError={ state.zodErrorIssues } />
        <input type="hidden" name="userId" value={ user?.id } />
      </div>
    </form>
  );
}

function DisplayNameFormInput({ isAdmin, ...rest }: { isAdmin: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>
        { isAdmin ?
          <ShieldCheck size={ 16 } />
        : <User size={ 16 } /> }
      </div>
      <Input className="pl-10" name="displayName" placeholder="Please use 32 characters at maximum." { ...rest } />
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
      <DisplayNameFormUpdatedAt updatedAt={ updatedAt } key={ `${updatedAt}` } />
      <Button size="default" type="submit">
        <Save size={ 16 } />
        { pending ?
          'Saving...'
        : isNewUser ?
          'Create'
        : 'Save name' }
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
  const isClient = useIsClient();
  const { duration } = useDuration(new Date(updatedAt ?? 0).getTime());

  if (!isClient) {
    return <Skeleton className="h-6 w-[10rem]" />;
  }

  if (updatedAt) {
    return (
      <Typography variant="body1" title={ updatedAt.toString() }>
        Last updated: { duration } ago.
      </Typography>
    );
  }

  return <div></div>;
}
