import { getAdminPasswordCorrect } from '@/server/admin/admin.server';

import AdminPanel from './_components/AdminPanel';
import MatrixBackground from './_components/MatrixBackground';
import AdminPasswordInput from './_components/AdminPasswordInput';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({}: SearchPageProps) {
  const isAdminPasswordCorrect = await getAdminPasswordCorrect();

  if (isAdminPasswordCorrect) {
    return <AdminPanel />;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <AdminPasswordInput />
      <MatrixBackground />
    </div>
  );
}
