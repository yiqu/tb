'use client';

/* eslint-disable readable-tailwind/multiline */
import { z } from 'zod';
import startCase from 'lodash/startCase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, MapPin, RotateCcw } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/models/user/user.model';
import HFSelect from '@/components/hook-form/HFSelect';
import { Country } from '@/models/country/country.model';
import Typography from '@/components/typography/Typography';
import { Separator } from '@/components/ui-pre-19/separator';
import { HFInputField } from '@/components/hook-form/HFInput';
import { PersonalInfoAddressSchema } from '@/validators/settings/account/PersonalInfo';

import CountryInput from './CountryListInput';
import CountryListWrapper from './CountryListWrapper';
import { getDefaultPersonalInfoAddress } from './utils';

interface LocationInfoFormProps {
  user: UserProfile | null;
}

export default function LocationInfoForm({ user }: LocationInfoFormProps) {
  const methods = useForm<z.infer<typeof PersonalInfoAddressSchema>>({
    defaultValues: {
      ...getDefaultPersonalInfoAddress(),
    },
    resolver: zodResolver(PersonalInfoAddressSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const onSubmitLocationInfo = (data: z.infer<typeof PersonalInfoAddressSchema>) => {
    console.log('submut');
    console.log(data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmitLocationInfo) } className={ `` }>
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
            <div className="col-span-1">
            </div>
            <div className="col-span-1">
              <StateInput />
            </div>
          </div>
          <Separator orientation="horizontal" className="my-2" />
          <FormSubmitButton />
          <FormErrorMessage />
        </div>
      </form>
    </Form>
  );
}

function FormSubmitButton() {
  const { formState, reset } = useFormContext();

  const handleOnReset = () => {
    reset();
  };

  return (
    <section className="flex flex-row items-center justify-between">
      { formState.isDirty ?
        <Button size="default" variant="outline" type="button" onClick={ handleOnReset }>
          <RotateCcw size={ 16 } className="text-orange-800 dark:text-orange-400" />
          Reset
        </Button>
      : <div></div> }
      <Button size="default" type="submit">
        <Save size={ 16 } />
        Save address
      </Button>
    </section>
  );
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
      name="streetAddress"
      label="Street Address"
      placeholder="123 Main St"
      startAdornment={ <MapPin size={ 16 } /> }
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
      startAdornment={ <MapPin size={ 16 } /> }
    />
  );
}

function StateInput() {
  const { control } = useFormContext();

  return (
    <HFInputField control={ control } name="state" label="State" placeholder="VA" startAdornment={ <MapPin size={ 16 } /> } />
  );
}

function ZipCodeInput() {
  const { control } = useFormContext();

  return (
    <HFInputField
      control={ control }
      name="zipCode"
      label="Zip Code"
      placeholder="22192"
      startAdornment={ <MapPin size={ 16 } /> }
    />
  );
}
