'use client';

/* eslint-disable readable-tailwind/multiline */
import { z } from 'zod';
import startCase from 'lodash/startCase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { useState, useActionState, startTransition } from 'react';
import { Map, Save, MapPin, Building, RotateCcw, NotebookTabs } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import { Separator } from '@/components/ui-pre-19/separator';
import { HFInputField } from '@/components/hook-form/HFInput';
import { updateUserLocationAction } from '@/server/user/user.server';
import { UserProfile, UserLocationEditableWithUserId } from '@/models/user/user.model';
import { PersonalInfoAddressSchema } from '@/validators/settings/account/PersonalInfo';
import { SettingsPersonalInfoLocationActionState } from '@/models/settings/SettingsPersonalInfo';

import { getDefaultPersonalInfoAddress } from './utils';

interface LocationInfoFormProps {
  user: UserProfile | null;
  children: React.ReactNode;
}

export default function LocationInfoForm({ user, children }: LocationInfoFormProps) {
  const methods = useForm<z.infer<typeof PersonalInfoAddressSchema>>({
    defaultValues: {
      ...getDefaultPersonalInfoAddress(user),
    },
    resolver: zodResolver(PersonalInfoAddressSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const [state, formAction] = useActionState<SettingsPersonalInfoLocationActionState, UserLocationEditableWithUserId>(
    updateUserLocationAction,
    {
      isSuccess: false,
      statusCode: undefined,
      zodErrorIssues: undefined,
      updatedAt: user?.updatedAt ?? null,
      result: {
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        zip: user?.zip || '',
        country: user?.country || '',
      },
    },
  );

  const onSubmitLocationInfo = (data: z.infer<typeof PersonalInfoAddressSchema>) => {
    if (user?.id) {
      startTransition(() => {
        formAction({
          ...data,
          userId: user.id,
        });
      });
    } else {
      window.alert('User has not been created');
    }
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmitLocationInfo) } className={ `` }>
        <input type="hidden" name="userId" value={ user?.id } />
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <StreetAddressInput />
            </div>
            <div className="">
              <CityInput />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <ZipCodeInput />
            </div>
            <div className="col-span-1">{ children }</div>
            <div className="col-span-1">
              <StateInput />
            </div>
          </div>
          <Separator orientation="horizontal" className="my-2" />
          <FormSubmitButton key={ `${state.updatedAt}` } />
          <FormErrorMessage />
          <FormActionErrorMessage state={ state } />
        </div>
      </form>
    </Form>
  );
}

function FormSubmitButton() {
  const { formState, reset } = useFormContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleOnReset = () => {
    reset();
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!formState.isValid) {
      return;
    }

    setIsDisabled(true);

    const form = e.currentTarget.closest('form');
    if (form) {
      form.requestSubmit(); // Modern approach, manually trigger form submission
    }
  };

  return (
    <section className="flex flex-row items-center justify-between">
      { formState.isDirty ?
        <Button size="default" variant="outline" type="button" onClick={ handleOnReset }>
          <RotateCcw size={ 16 } className="text-orange-800 dark:text-orange-400" />
          Reset
        </Button>
      : <div></div> }
      <Button size="default" type="submit" disabled={ isDisabled } onClick={ handleOnSubmit }>
        <Save size={ 16 } />
        { isDisabled ? 'Saving...' : 'Save address' }
      </Button>
    </section>
  );
}

function FormActionErrorMessage({ state }: { state: SettingsPersonalInfoLocationActionState }) {
  if ((state.statusCode ?? 0) > 200 && !state.isSuccess) {
    return (
      <div className="rounded-xs border-l-2 border-destructive pl-6">
        <Typography variant="body1" className="font-semibold text-destructive">
          Server error:
        </Typography>
        <div>
          <Typography variant="body1" className="text-destructive">
            { state.message }
          </Typography>
        </div>
      </div>
    );
  }
  return null;
}

function FormErrorMessage() {
  const { formState } = useFormContext();
  const errorKeys: string[] = Object.keys(formState.errors);
  const { isDirty } = formState;

  if (!isDirty || errorKeys.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xs border-l-2 border-destructive pl-6">
      <Typography variant="body1" className="font-semibold text-destructive">
        Please fix the following errors:
      </Typography>
      <div className="flex flex-col gap-y-1">
        { errorKeys.map((err) => {
          return (
            <section key={ err } className="flex flex-row gap-x-1">
              <Typography variant="label1" className="min-w-[7rem]">
                { startCase(err) }:
              </Typography>
              <Typography variant="labelvalue1">{ `${formState.errors[err]?.message}` }</Typography>
            </section>
          );
        }) }
      </div>
    </div>
  );
}

function StreetAddressInput() {
  const { control } = useFormContext();

  return (
    <HFInputField
      control={ control }
      name="address"
      label="Street Address"
      placeholder="123 Main St"
      startAdornment={ <MapPin size={ 16 } className="text-muted-foreground/90" /> }
    />
  );
}

function CityInput() {
  const { control } = useFormContext();

  return (
    <HFInputField
      control={ control }
      name="city"
      label="City"
      placeholder="Fairfax"
      startAdornment={ <Building size={ 16 } className="text-muted-foreground/90" /> }
    />
  );
}

function StateInput() {
  const { control } = useFormContext();

  return (
    <HFInputField
      control={ control }
      name="state"
      label="State"
      placeholder="VA"
      startAdornment={ <Map size={ 16 } className="text-muted-foreground/90" /> }
    />
  );
}

function ZipCodeInput() {
  const { control } = useFormContext();

  return (
    <HFInputField
      control={ control }
      name="zip"
      label="Zip Code"
      placeholder="22192"
      startAdornment={ <NotebookTabs size={ 16 } className="text-muted-foreground/90" /> }
    />
  );
}
