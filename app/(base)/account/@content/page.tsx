import { Metadata } from 'next';

import AccountGeneral from '../_components/AccountGeneral';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
};

export default function AccountContentPage() {
  return <AccountGeneral />;
}
