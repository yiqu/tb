/**
 * @file BodyParent.tsx
 *
 * Root-level server component that wraps the entire application body. This component is
 * responsible for:
 *
 * 1. **Server-side settings resolution** - Fetches user preferences (vibe theme, font,
 *    compact mode, admin mode, table borders) in parallel on the server before rendering.
 *
 * 2. **Rendered inside the root layout's Suspense boundary** - It reads cookies, so it streams
 *    in after the static shell. Theme flash prevention lives in the root layout's boot scripts.
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

import FileUploadDocumentTitle from '@/components/file-upload/FileUploadDocumentTitle';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/components/ui-mui/mui/theme';
import Preloads from '@/components/preload/Preloads';
import AppLayout from '@/components/layout/AppLayout';
import { TooltipProvider } from '@/components/ui/custom/tooltip';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ScrollToTop } from '@/components/scroll-up/ScrollToTop';
import VibeProviderWrapper from '@/providers/VibeProviderWrapper';
import { AppSettingProvider } from '@/providers/AppSettingProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';
import HistoryTrackerWrapper from '@/components/history-tracker/HistoryTrackerWrapper';
import {
  getSettingsApplicationAdminMode,
  getSettingsApplicationCompactMode,
  getSettingsTableVerticalBorders,
  getSettingsTableHorizontalBorders,
} from '@/server/settings/app-settings';

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
  6. ThemeProvider (next-themes) – moved to the root layout, outside the Suspense boundary
  7. AppSettingProvider        – app-level settings (compact, admin, table borders)
  8. TooltipProvider           – shared tooltip delay config
        
 *
 * @param children - Page content rendered by the Next.js App Router.
 */
export default async function BodyParent({ children }: { children: React.ReactNode }) {
  // Fetch the user settings the providers need concurrently to minimize server-side latency.
  // The vibe, font and table border attributes are applied before first paint by the boot scripts in the root layout.
  const [isCompactMode, isAdminMode, showTableHorizontalBorders, showTableVerticalBorders] = await Promise.all([
    getSettingsApplicationCompactMode(),
    getSettingsApplicationAdminMode(),
    getSettingsTableHorizontalBorders(),
    getSettingsTableVerticalBorders(),
  ]);

  return (
    <>
      <AppTopLoader />
      { /* Resource preload hints (fonts, critical assets) */ }
      <Preloads />
      { /* Tracks route history for back-navigation awareness */ }
      <HistoryTrackerWrapper />
      { /* Shows the progress of running file uploads in the browser tab title */ }
      <FileUploadDocumentTitle />
      <VibeProviderWrapper>
        <AppRouterCacheProvider options={ { enableCssLayer: true } }>
          <MuiThemeProvider theme={ theme } defaultMode="system" modeStorageKey="mui-mode">
            <NuqsAdapter>
              <TanstackQueryClientProvider>
                <ReactQueryDevtools initialIsOpen={ false } buttonPosition="bottom-right" />
                { /* next-themes ThemeProvider lives in the root layout so dark mode also applies to the static shell */ }
                <AppSettingProvider initialValues={ { isCompactMode, isAdminMode, showTableHorizontalBorders, showTableVerticalBorders } }>
                  <TooltipProvider delayDuration={ 0 }>
                    <AppLayout>{ children }</AppLayout>
                    { /* Global toast notification container */ }
                    <CustomToaster />
                  </TooltipProvider>
                </AppSettingProvider>
              </TanstackQueryClientProvider>
            </NuqsAdapter>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </VibeProviderWrapper>

      <ScrollToTop onlyShowWhenScrolledUp={ false } />
    </>
  );
}
