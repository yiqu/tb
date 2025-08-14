/* eslint-disable perfectionist/sort-imports */
/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/multiline */
import ReactScan from '@/providers/ReactScan';

import {
  Lora,
  Lato,
  Geist,
  Borel,
  Inter,
  Outfit,
  DM_Sans,
  Poppins,
  Oxanium,
  Open_Sans,
  Geist_Mono,
  Lilita_One,
  Montserrat,
  Merriweather,
  Source_Sans_3,
  Source_Serif_4,
  Cherry_Bomb_One,
  Plus_Jakarta_Sans,
  Libre_Baskerville,
  Architects_Daughter,
} from 'next/font/google';

import { appName } from '@/constants/constants';
import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

import BodyParent from './BodyParent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
  weight: ['400'],
});

const lilitaOne = Lilita_One({
  variable: '--font-lilita-one',
  subsets: ['latin'],
  weight: '400',
});

const borel = Borel({
  variable: '--font-borel',
  subsets: ['latin'],
  weight: '400',
});

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400'],
  preload: true,
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const oxanium = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif-4',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`, // child pages will use this template
    default: `Home | ${appName}`, // the title for this defined in
  },
  description: '',
};

export const experimental_ppr = true;

export default function BaseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={ `${geistSans.variable} ${geistMono.variable} ${lilitaOne.variable} ${borel.variable} ${cherryBombOne.variable} ${architectsDaughter.variable} ${inter.variable} ${lora.variable} ${dmSans.variable} ${poppins.variable} ${plusJakartaSans.variable} ${oxanium.variable} ${merriweather.variable} ${sourceSans3.variable} ${sourceSerif4.variable} ${montserrat.variable} ${outfit.variable} ${lato.variable} ${libreBaskerville.variable} ${openSans.variable}` }
    >
      <ReactScan />
      <BodyParent>{ children }</BodyParent>
    </html>
  );
}
