import { getAdminPasswordCorrect } from '@/server/admin/admin.server';

import AdminPanel from './_components/AdminPanel';
import MatrixBackground from './_components/MatrixBackground';
import AdminPasswordInput from './_components/AdminPasswordInput';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({}: SearchPageProps) {
  return <AdminPanel />;
}
