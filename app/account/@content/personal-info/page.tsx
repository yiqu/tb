import AdminMode from './_components/AdminMode';
import DisplayName from './_components/DisplayName';
import LocationInfo from './_components/LocationInfo';

export default function AccountPersonalInfoPage() {
  return (
    <section className="flex flex-col gap-y-2">
      <DisplayName />
      <AdminMode />
      <LocationInfo />
    </section>
  );
}
