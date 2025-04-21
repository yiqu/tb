import localFont from 'next/font/local';
import { Caveat, Pacifico, Luckiest_Guy } from 'next/font/google';
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';

export const geistFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/geist/otf/Geist-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist/otf/Geist-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--geist-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: true,
});

export const geistMonoFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-UltraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-Black.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/geist-mono/otf/GeistMono-UltraBlack.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--geist-mono-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: true,
});

export const rubikBubblesFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/rubik-bubbles/RubikBubbles-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--rubik-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: true,
});

export const cherryFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/cherry/CherryBombOne-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--cherry-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: true,
});

export const pacificoFont = Pacifico({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
});

export const caveatFont = Caveat({
  weight: ['400', '700', '500', '600'],
  style: 'normal',
  subsets: ['latin'],
  preload: true,
});

export const luckiestGuyFont = Luckiest_Guy({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
});
