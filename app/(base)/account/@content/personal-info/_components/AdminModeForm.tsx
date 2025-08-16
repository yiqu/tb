/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { LoaderCircle } from 'lucide-react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { useTransition, useOptimistic, useActionState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';
import { toggleAdminModeAction } from '@/server/user/user.server';
import { SettingsPersonalInfoAdminModeActionState } from '@/models/settings/SettingsPersonalInfo';

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
        <AdminModeFormSwitch checked={ optimisticIsAdminCheckedState } onCheckedChange={ handleOnAdminToggle } name="isAdmin" />
        { isPending ?
          <LoaderCircle className="h-4 w-4 animate-spin" />
        : null }
        <input type="hidden" name="userId" value={ user?.id } />
      </div>
    </form>
  );
}

function AdminModeFormSwitch(props: React.ComponentProps<typeof SwitchPrimitive.Switch>) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="admin-mode" { ...props } className="cursor-pointer" />
      <Label htmlFor="admin-mode">Admin Mode</Label>
    </div>
  );
}
