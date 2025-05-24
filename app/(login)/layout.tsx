import { Suspense } from 'react';

import CustomToaster from '@/components/toaster/CustomToaster';

import type { Metadata } from 'next';

import './login-globals.css';

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function LoginRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh!" id="login-root">
      <Suspense>{ children }</Suspense>
      <CustomToaster />
    </div>
  );
}
