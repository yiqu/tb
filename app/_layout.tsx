/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

//import { geistFont, geistMonoFont } from '@/lib/fonts-config';

import type { Metadata } from 'next';

// import './globals.css';
// import './scrollbar.css';
// import './tailwind-config.css';

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{ children }</>;
}
