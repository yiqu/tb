import { Suspense } from 'react';

import LoginComponentPage from './_components/LoginPage';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({}: SearchPageProps) {
  return (
    <Suspense>
      <LoginComponentPage />
    </Suspense>
  );
}
