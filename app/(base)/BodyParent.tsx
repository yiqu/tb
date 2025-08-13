import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/components/ui-mui/mui/theme';
import AppLayout from '@/components/layout/AppLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getVibeStylesheetHref } from '@/lib/vibes-css-map';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import VibeProviderWrapper from '@/providers/VibeProviderWrapper';
import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';

export default async function BodyParent({ children }: { children: React.ReactNode }) {
  // Preload and apply the saved vibe stylesheet on the server to avoid flash
  const vibe = await getSettingsApplicationVibe();
  const vibeHref = getVibeStylesheetHref(vibe);

  return (
    <>
      <head>
        { /* Preload and apply vibe CSS early to prevent theme flash on first paint */ }
        <link rel="preload" href={ vibeHref } as="style" />
        <link id="vibe-theme-stylesheet" rel="stylesheet" href={ vibeHref } />
      </head>

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
    </>
  );
}
