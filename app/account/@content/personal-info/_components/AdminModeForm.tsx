/* eslint-disable readable-tailwind/multiline */
'use client';

import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { User, Loader, LoaderCircle } from 'lucide-react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { useTransition, useOptimistic, useActionState, InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import useDuration from '@/hooks/useDuration';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import { toggleAdminMode, updateUserAction, toggleAdminModeAction } from '@/server/user/user.server';
import {
  SettingsPersonalInfoAdminModeActionState,
  SettingsPersonalInfoDisplayNameActionState,
} from '@/models/settings/SettingsPersonalInfo';

interface AdminModeFormProps {
  user: UserProfile | null;
}

export default function AdminModeForm({ user }: AdminModeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticIsAdminCheckedState, toggleOptimisticIsAdminCheckedState] = useOptimistic<boolean, boolean>(
    user?.isAdmin || false,
    (currentState: boolean, optimisticValue: boolean) => {
      return optimisticValue;
    },
  );
  const isNewUser: boolean = !user;
  const [, formAction] = useActionState<SettingsPersonalInfoAdminModeActionState, any>(toggleAdminModeAction, {
    isSuccess: false,
    statusCode: undefined,
    zodErrorIssues: undefined,
    updatedAt: user?.updatedAt ?? null,
    result: user?.isAdmin ?? false,
  });

  const handleOnAdminToggle = (checked: boolean) => {
    startTransition(() => {
      toggleOptimisticIsAdminCheckedState(checked);
      formAction({
        isAdmin: checked,
        userId: user?.id,
      });
    });
  };

  if (isNewUser) {
    return (
      <div>
        <Typography variant="body1">Only users can toggle this option.</Typography>
      </div>
    );
  }

  return (
    <form action={ formAction }>
      <div className="flex flex-row items-center justify-start gap-x-1">
        <AdminModeFormSwitch
          checked={ optimisticIsAdminCheckedState }
          onCheckedChange={ handleOnAdminToggle }
          name="isAdmin"
        />
        { isPending ?
          <LoaderCircle className="h-4 w-4 animate-spin" />
        : null }
        <input type="hidden" name="userId" value={ user?.id } />
      </div>
    </form>
  );
}

function AdminModeFormSwitch(props: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="admin-mode" { ...props } className="cursor-pointer" />
      <Label htmlFor="admin-mode">Admin Mode</Label>
    </div>
  );
}

function DisplayNameFormUpdatedAt({ updatedAt }: { updatedAt: string | Date | null | undefined }) {
  const { duration } = useDuration(new Date(updatedAt ?? 0).getTime());
  if (updatedAt) {
    return (
      <Typography variant="body1" title={ updatedAt.toString() }>
        Last updated: { duration } ago.
      </Typography>
    );
  }

  return <div></div>;
}
