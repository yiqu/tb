import AccountGeneralAvatar from './AccountGeneralAvatar';
import AccountGeneralVibeSelection from './AccountGeneralVibeSelection';

export default function AccountGeneral() {
  return (
    <section className="flex flex-col gap-y-6">
      <AccountGeneralAvatar />
      <AccountGeneralVibeSelection />
    </section>
  );
}
