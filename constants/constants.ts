const isProduction = process.env.NODE_ENV === 'production';

export const appName = isProduction ? process.env.NEXT_PUBLIC_APP_NAME : process.env.NEXT_PUBLIC_APP_NAME;
export const ONE_YEAR_IN_SECONDS = 31536000;

// Cookie constants
export const SIDE_NAV_STATE_COOKIE_NAME = 'sidebar_state';

export const SIDEBAR_COLLAPSABLE_STATE_KEY = 'sidebar-collapsable-state';
export const SIDEBAR_COLLAPSABLE_FAVORITES = 'sidebar-collapsable-favorites';
export const SIDEBAR_COLLAPSABLE_HISTORY = 'sidebar-collapsable-history';
export const SIDEBAR_COLLAPSABLE_ADD_NEW = 'sidebar-collapsable-add-new';

export const SETTINGS_USER_AVATAR_COOKIE_NAME = 'settings-user-avatar';

export const ADMIN_PASSWORD_CORRECT_COOKIE_NAME = 'admin-password-correct';

export const CONSENT_GIVEN_COOKIE_NAME = 'consent-given';

export const API_TIMEOUT = 30_000;

export const FONT_FAMILY_FUN = 'Cherry Bomb One';
export const FONT_FAMILY_PRIMARY = 'Geist';

export const APP_TITLE_GRADIENT_COLORS = {
  search: ['#005493', '#f5aa1c', '#c63527', '#8fe1c2'],
  account: ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
  pageInfo: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
};
