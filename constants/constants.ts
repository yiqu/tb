const isProduction = process.env.NODE_ENV === 'production';

export const appName = isProduction ? process.env.NEXT_PUBLIC_APP_NAME : process.env.NEXT_PUBLIC_APP_NAME;
export const ONE_YEAR_IN_SECONDS = 31536000;

// Cookie constants
export const SIDE_NAV_STATE_COOKIE_NAME = 'sidebar_state';

export const SIDEBAR_COLLAPSABLE_STATE_KEY = 'sidebar-collapsable-state';
export const SIDEBAR_COLLAPSABLE_FAVORITES = 'sidebar-collapsable-favorites';
export const SIDEBAR_COLLAPSABLE_HISTORY = 'sidebar-collapsable-history';

export const API_TIMEOUT = 30_000;
