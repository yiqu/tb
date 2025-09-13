import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/components/ui-mui/mui/theme';
import Preloads from '@/components/preload/Preloads';
import AppLayout from '@/components/layout/AppLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ScrollToTop } from '@/components/scroll-up/ScrollToTop';
import VibeProviderWrapper from '@/providers/VibeProviderWrapper';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';
import { getFontStylesheetHref, getVibeStylesheetHref } from '@/lib/vibes-css-map';
import { getSettingsApplicationFont, getSettingsApplicationVibe } from '@/server/settings/vibe-select';

export default async function BodyParent({ children }: { children: React.ReactNode }) {
  // Preload and apply the saved vibe and font stylesheets on the server to avoid flash
  const [vibe, fontOverride] = await Promise.all([getSettingsApplicationVibe(), getSettingsApplicationFont()]);
  const vibeHref = getVibeStylesheetHref(vibe);
  const fontHref = getFontStylesheetHref(fontOverride);

  return (
    <>
      <head>
        { /* Preload and apply vibe CSS early to prevent theme flash on first paint */ }
        <link rel="preload" href={ vibeHref } as="style" />
        <link id="vibe-theme-stylesheet" rel="stylesheet" href={ vibeHref } />

        { /* Preload and apply font CSS early to prevent font flash on first paint */ }
        { fontOverride ?
          <>
            <link rel="preload" href={ fontHref } as="style" />
            <link id="vibe-font-stylesheet" rel="stylesheet" href={ fontHref } />
          </>
        : null }
      </head>

      <body className="font-sans antialiased" id="base-root-layout">
        <AppTopLoader />
        <InitColorSchemeScript defaultMode="light" attribute="data-mui-color-scheme" />
        <Preloads />
        <VibeProviderWrapper>
          <AppRouterCacheProvider options={ { enableCssLayer: true } }>
            <MuiThemeProvider theme={ theme } defaultMode="light">
              <NuqsAdapter>
                <TanstackQueryClientProvider>
                  <ReactQueryDevtools initialIsOpen={ false } buttonPosition="bottom-right" />
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
        <ScrollToTop onlyShowWhenScrolledUp={ false } />
      </body>
    </>
  );
}
