/**
 * @file BodyParent.tsx
 *
 * Root-level server component that wraps the entire application body. This component is
 * responsible for:
 *
 * 1. **Server-side settings resolution** - Fetches user preferences (vibe theme, font,
 *    compact mode, admin mode) in parallel on the server before rendering.
 *
 * 2. **Theme flash prevention** - Injects preload hints and stylesheet links into `<head>`
 *    so the active vibe theme and custom font are applied before first paint.
 *
 * 3. **Provider composition** - Nests all required context providers in the correct order:
 *    Vibe > MUI (AppRouterCache + ThemeProvider) > nuqs > TanStack Query > next-themes >
 *    AppSettings > Tooltip.
 *
 * 4. **Global UI chrome** - Renders cross-cutting UI elements (top loader, toaster,
 *    scroll-to-top button, devtools) that live outside any specific page.
 *
 * Provider nesting order matters — each layer may depend on a parent context.
 */

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { cn } from '@/lib/utils';
import theme from '@/components/ui-mui/mui/theme';
import Preloads from '@/components/preload/Preloads';
import AppLayout from '@/components/layout/AppLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ScrollToTop } from '@/components/scroll-up/ScrollToTop';
import VibeProviderWrapper from '@/providers/VibeProviderWrapper';
import { AppSettingProvider } from '@/providers/AppSettingProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';
import { getFontStylesheetHref, getVibeStylesheetHref } from '@/lib/vibes-css-map';
import HistoryTrackerWrapper from '@/components/history-tracker/HistoryTrackerWrapper';
import { getSettingsApplicationFont, getSettingsApplicationVibe } from '@/server/settings/vibe-select';
import { getSettingsApplicationAdminMode, getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

/**
 * Async server component that serves as the `<body>` wrapper for the entire app.
 *
 * Fetches all user-level application settings in parallel on the server, resolves the
 * corresponding stylesheet URLs, and renders the full provider tree around `{children}`.
 * 
 *      
  Provider tree — order is significant:
  1. VibeProviderWrapper     – vibe/theme context
  2. AppRouterCacheProvider   – MUI Emotion cache for App Router
  3. MuiThemeProvider         – MUI theme + color mode
  4. NuqsAdapter             – URL query-string state management
  5. TanstackQueryClient      – server-state / data-fetching cache
  6. ThemeProvider (next-themes) – light/dark mode via class attribute
  7. AppSettingProvider        – app-level settings (compact, admin)
  8. TooltipProvider           – shared tooltip delay config
        
 *
 * @param children - Page content rendered by the Next.js App Router.
 */
export default async function BodyParent({ children }: { children: React.ReactNode }) {
  // Fetch all user settings concurrently to minimize server-side latency
  const [vibe, fontOverride, isCompactMode, isAdminMode] = await Promise.all([
    getSettingsApplicationVibe(),
    getSettingsApplicationFont(),
    getSettingsApplicationCompactMode(),
    getSettingsApplicationAdminMode(),
  ]);

  // Resolve stylesheet URLs for the active vibe theme and optional font override
  const vibeHref = getVibeStylesheetHref(vibe);
  const fontHref = getFontStylesheetHref(fontOverride);

  return (
    <>
      { /* --- <head> injections for theme/font flash prevention --- */ }
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

      <body id="base-root-layout" className={ cn('font-sans antialiased') }>
        <AppTopLoader />
        { /* MUI color scheme script — must execute before React hydration to avoid flash of unstyled content */ }
        <InitColorSchemeScript defaultMode="system" attribute="data-mui-color-scheme" />
        { /* Resource preload hints (fonts, critical assets) */ }
        <Preloads />
        { /* Tracks route history for back-navigation awareness */ }
        <HistoryTrackerWrapper />
        <VibeProviderWrapper>
          <AppRouterCacheProvider options={ { enableCssLayer: true } }>
            <MuiThemeProvider theme={ theme } defaultMode="system" modeStorageKey="mui-mode">
              <NuqsAdapter>
                <TanstackQueryClientProvider>
                  <ReactQueryDevtools initialIsOpen={ false } buttonPosition="bottom-right" />
                  <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange storageKey="app-theme">
                    <AppSettingProvider initialValues={ { isCompactMode, isAdminMode } }>
                      <TooltipProvider delayDuration={ 0 }>
                        <AppLayout>{ children }</AppLayout>
                        { /* Global toast notification container */ }
                        <CustomToaster />
                      </TooltipProvider>
                    </AppSettingProvider>
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
