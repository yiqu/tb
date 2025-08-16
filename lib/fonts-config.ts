import localFont from 'next/font/local';
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Caveat, Pacifico, Luckiest_Guy, Indie_Flower } from 'next/font/google';

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
  variable: '--caveat-font',
});

export const luckiestGuyFont = Luckiest_Guy({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
});

export const indieFlowerFont = Indie_Flower({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
});

export const latoFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/lato/files/lato-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/lato/files/lato-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },

    {
      path: '../node_modules/@fontsource/lato/files/lato-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--lato-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const openSansFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/open-sans/files/open-sans-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--open-sans-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const notoSansFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },

    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },

    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },

    {
      path: '../node_modules/@fontsource/noto-sans/files/noto-sans-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--noto-sans-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const libreBaskervilleFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--libre-baskerville-font', // Optional: Define a CSS variable name
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'serif'],
});

export const dinoColorFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/dino-color/DinoRegular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dino-color',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'serif'],
});

export const dinoFossilFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/dino-fossil/DinosaurFossil.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dino-fossil',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'serif'],
});

export const historyFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/history/HistoyStaco.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-history-staco',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'serif'],
});

export const stoneAgeFont: NextFontWithVariable = localFont({
  src: [
    {
      path: '../public/fonts/stone-age/StoneAge.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-stone-age',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'serif'],
});
