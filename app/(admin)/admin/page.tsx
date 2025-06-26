import AdminPanel from './_components/AdminPanel';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AdminPage({}: SearchPageProps) {
  return <AdminPanel />;
}
