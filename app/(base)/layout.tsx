/* eslint-disable perfectionist/sort-imports */
/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/multiline */
import ReactScan from '@/providers/ReactScan';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Lora,
  Geist,
  Borel,
  Inter,
  Caveat,
  Outfit,
  DM_Sans,
  Poppins,
  Oxanium,
  Geist_Mono,
  Lilita_One,
  Montserrat,
  Roboto_Mono,
  Merriweather,
  Source_Sans_3,
  Source_Serif_4,
  Cherry_Bomb_One,
  Source_Code_Pro,
  Plus_Jakarta_Sans,
  Architects_Daughter,Space_Mono
} from 'next/font/google';

import { appName } from '@/constants/constants';
import theme from '@/components/ui-mui/mui/theme';
import AppLayout from '@/components/layout/AppLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';

import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

import VibeProviderWrapper from '@/providers/VibeProviderWrapper';
import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';
import { getVibeStylesheetHref } from '@/lib/vibes-css-map';

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

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const oxanium = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif-4',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: '400',
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

export default async function BaseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload and apply the saved vibe stylesheet on the server to avoid flash
  const vibe = await getSettingsApplicationVibe();
  const vibeHref = getVibeStylesheetHref(vibe);
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={ `${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} ${cherryBombOne.variable} ${architectsDaughter.variable} ${inter.variable} ${lora.variable} ${dmSans.variable} ${poppins.variable} ${plusJakartaSans.variable} ${oxanium.variable} ${sourceCodePro.variable} ${robotoMono.variable} ${merriweather.variable} ${sourceSans3.variable} ${sourceSerif4.variable} ${montserrat.variable} ${outfit.variable} ${spaceMono.variable}` }
    >
      <head>
        { /* Preload and apply vibe CSS early to prevent theme flash on first paint */ }
        <link rel="preload" href={ vibeHref } as="style" />
        <link id="vibe-theme-stylesheet" rel="stylesheet" href={ vibeHref } />
      </head>
      <ReactScan />
      <body className="font-sans antialiased" id="base-root-layout">
        <AppTopLoader />
        <InitColorSchemeScript defaultMode="light" attribute="data-mui-color-scheme" />
        <VibeProviderWrapper>
          <AppRouterCacheProvider options={ { enableCssLayer: true } }>
            <MuiThemeProvider theme={ theme } defaultMode="light">
              <NuqsAdapter>
                <TanstackQueryClientProvider>
                  <ReactQueryDevtools initialIsOpen={ false } />
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={ false }
                    disableTransitionOnChange
                    storageKey="app-theme"
                  >
                    <TooltipProvider delayDuration={ 0 }>
                      <AppLayout>{ children }</AppLayout>
                      <CustomToaster />
                    </TooltipProvider>
                  </ThemeProvider>
                </TanstackQueryClientProvider>
              </NuqsAdapter>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </VibeProviderWrapper>
      </body>
    </html>
  );
}
