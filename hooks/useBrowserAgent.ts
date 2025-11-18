import { useState, useEffect } from 'react';

export default function useBrowserAgent(): BrowserType {
  const [userAgentState, setUserAgentState] = useState<BrowserType>('unknown');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (isSafari(userAgent)) {
      setUserAgentState('safari');
    } else if (isChrome(userAgent)) {
      setUserAgentState('chrome');
    } else if (isFirefox(userAgent)) {
      setUserAgentState('firefox');
    } else {
      setUserAgentState('unknown');
    }
  }, []);

  return userAgentState;
}

export function isSafari(userAgent: string) {
  return userAgent.includes('safari') && !userAgent.includes('chrome');
}

export function isChrome(userAgent: string) {
  return userAgent.includes('chrome');
}

export function isFirefox(userAgent: string) {
  return userAgent.includes('firefox');
}

export type BrowserType = 'safari' | 'chrome' | 'firefox' | 'unknown';
