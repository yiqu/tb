import { Metadata } from 'next';

import AdminMode from './_components/AdminMode';
import DisplayName from './_components/DisplayName';
import LocationInfo from './_components/LocationInfo';
import RefetchButton from './_components/RefetchButton';

//export const experimental_ppr = true;

export const metadata: Metadata = {
  title: 'Personal Info | Settings',
  description: 'Manage your personal information',
};

export default function AccountPersonalInfoPage() {
  return (
    <section className="flex flex-col gap-y-6">
      <section className="flex w-full items-center justify-end">
        <RefetchButton />
      </section>
      <DisplayName />
      <AdminMode />
      <LocationInfo />
    </section>
  );
}
