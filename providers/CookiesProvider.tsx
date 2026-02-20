// // providers/cookie-provider.tsx
// 'use client';

// import { use, useState, useCallback, createContext } from 'react';

// const COOKIE_PATH_HOME = '/';
// const COOKIE_MAX_AGE_1_YEAR = 31536000;

// type CookieContextType = {
//   cookies: Record<string, string>;
//   setCookie: (_key: string, _value: string, _options?: { maxAge?: number; path?: string }) => void;
// };

// const CookieContext = createContext<CookieContextType | null>(null);

// export function AppCookieProvider({ children, initialValues }: { children: React.ReactNode; initialValues: Record<string, string> }) {
//   const [cookies, setCookies] = useState(initialValues);

//   const setCookie = useCallback((key: string, value: string, options?: { maxAge?: number; path?: string }) => {
//     const { maxAge = COOKIE_MAX_AGE_1_YEAR, path = COOKIE_PATH_HOME } = options ?? {};

//     document.cookie = `${key}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=Lax`;

//     setCookies((prev) => ({ ...prev, [key]: value }));
//   }, []);

//   return <CookieContext value={ { cookies, setCookie } }>{ children }</CookieContext>;
// }

// export function useAppCookies() {
//   const context = use(CookieContext);
//   if (!context) throw new Error('useCookies must be used within CookieProvider');
//   return context;
// }
export {};