/* eslint-disable readable-tailwind/no-unnecessary-whitespace */
/* eslint-disable readable-tailwind/multiline */

import { Metadata } from 'next';
import { Borel, Geist, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One } from 'next/font/google';

import Typography from '@/components/typography/Typography';
import CenterUnderline from '@/fancy/components/text/underline-center';
import PageNotFoundCard from '@/components/status-cards/PageNotFoundCard';

import './globals.css';
import './tailwind-config.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: true,
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
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
  preload: true,
});

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function NotFound() {
  return (
    <div
      className={ `${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} ${cherryBombOne.variable} h-full w-full font-sans antialiased` }
      id="not-found-component"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <PageNotFoundCard blendBg={ true } blendTextAreaBorder={ true }>
          <div className="flex h-full w-full flex-col items-center justify-between">
            <Typography variant="body1" className="text-center">
              404: The page you are looking for does not exist.
            </Typography>
            <Typography variant="body1" className="text-center">
              <a href="/">
                <CenterUnderline label="Take me back home." />
              </a>
            </Typography>
          </div>
        </PageNotFoundCard>
      </div>
    </div>
  );
}
