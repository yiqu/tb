export const isProduction = process.env.NODE_ENV === 'production';

export const appName = isProduction ? process.env.NEXT_PUBLIC_APP_NAME : process.env.NEXT_PUBLIC_APP_NAME;
export const ONE_YEAR_IN_SECONDS = 31536000;

// Cookie constants
export const SIDE_NAV_STATE_COOKIE_NAME = 'sidebar_state';

export const SIDEBAR_COLLAPSABLE_STATE_KEY = 'sidebar-collapsable-state';
export const SIDEBAR_COLLAPSABLE_FAVORITES = 'sidebar-collapsable-favorites';
export const SIDEBAR_COLLAPSABLE_HISTORY = 'sidebar-collapsable-history';
export const SIDEBAR_COLLAPSABLE_ADD_NEW = 'sidebar-collapsable-add-new';

export const SETTINGS_USER_AVATAR_COOKIE_NAME = 'settings-user-avatar';
export const SETTINGS_USER_VIBE_COOKIE_NAME = 'settings-user-vibe';
export const SETTINGS_USER_FONT_COOKIE_NAME = 'settings-user-font-override';

export const ADMIN_PASSWORD_CORRECT_COOKIE_NAME = 'admin-password-correct';

export const CONSENT_GIVEN_COOKIE_NAME = 'consent-given';

export const API_TIMEOUT = 30_000;

export const FONT_FAMILY_FUN = 'Cherry Bomb One';
export const FONT_FAMILY_PRIMARY = 'Geist';

export const TANSTACK_QUERY_QUERY_KEY_FIREBASE_USER = 'firebase-user';
export const TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS = 'bill-due-details';
export const TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS = 'subscription-details';
export const TANSTACK_QUERY_QUERY_KEY_ID_GENERAL = 'id';

// TanStack mutation keys
export const TANSTACK_MUTATION_KEY_SUBSCRIPTION_UPDATE = 'subscription-details-update';
export const TANSTACK_MUTATION_KEY_SUBSCRIPTION_CREATE = 'subscription-create';

export const CACHE_TAG_BILL_DUES_ALL = 'bill-dues-all';
export const CACHE_TAG_USER_ACHIEVEMENTS = 'user-achievements';

export const CACHE_TAG_SORT_DATA_PREFIX = 'sort-data-page-';
export const CACHE_TAG_PAGINATION_DATA_PREFIX = 'pagination-data-page-';

export const CACHE_TAG_FAVORITES_PREFIX = 'favorites-';

export const CACHE_TAG_SUBSCRIPTIONS_ALL = 'subscriptions-all';
export const CACHE_TAG_SUBSCRIPTION_DETAILS = 'subscription-by-id-';
export const CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR = 'subscription-bills-grouped-by-year-';

export const SORT_DATA_PAGE_IDS = {
  search: 'search',
  subscriptions: 'subscriptions',
  outstanding: 'outstanding',
  upcoming: 'upcoming',
  addNewBillDueRecentlyAdded: 'add-new-bill-due-recently-added',
} as const;

// pagination
export const DEFAULT_PAGE_SIZE = 10;

export const APP_TITLE_GRADIENT_COLORS = {
  search: ['#005493', '#f5aa1c', '#c63527', '#8fe1c2'],
  bills: ['#005493', '#f5aa1c', '#c63527', '#8fe1c2'],
  dates: ['#005493', '#f5aa1c', '#c63527', '#8fe1c2'],
  account: ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
  pageInfo: ['#FF6B6B', '#c63527', '#45B7D1', '#000066'],
  art: ['#005493', '#f5aa1c', '#c63527', '#002754'],
  changelog: ['#0079bf', '#f2d600', '#00c2e0', '#51e898'],
  apiStatus: ['#82bbe4', '#a3d9ef', '#211f1f', '#a66156'],
  admin: ['#cc0000', '#ff9900', '#000066'],
  settings: ['#005493', '#f5aa1c', '#c63527', '#002754'],
  login: ['#00a3e2', '#1ba548', '#fdc800', '#f1860e', '#e41b13'],
  dashboard: ['#005493', '#e31837', '#489cd4', '#2774a6'],
  subscriptions: ['#005493', '#f5aa1c', '#c63527', '#002754'],
  outstanding: ['#FF4757', '#FF6B35', '#FFA726', '#0070F3'],
  upcoming: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'],
  add: ['#ed6b06', '#9d1348', '#008b5d', '#364395'],
};

export const CONSECUTIVE_ADD_HELPER_TEXT =
  'Add another bill due after this one. The due date will automatically move to the same day next month.';
