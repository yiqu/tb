'use client';

import { ReactNode, useEffect } from 'react';

import { AppFont, AppVibe } from '@/models/settings/general-settings.models';
import { getFontStylesheetHref, getVibeStylesheetHref } from '@/lib/vibes-css-map';

const LINK_ID = 'vibe-theme-stylesheet';
const FONT_LINK_ID = 'vibe-font-stylesheet';

export default function VibeProvider({
  vibe = 'amethyst-haze',
  fontOverride,
  children,
}: {
  vibe: AppVibe;
  fontOverride: AppFont | undefined;
  children: ReactNode;
}) {
  const cssHref = getVibeStylesheetHref(vibe);
  const fontOverrideCssHref = getFontStylesheetHref(fontOverride);

  // Ensure a dedicated <link> tag exists, and always point it to the active vibe CSS
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = LINK_ID;
      // Ensure the vibe link is the last stylesheet in <head> so it wins cascade
      document.head.appendChild(link);
    }

    // Update href when season changes
    if (link.href !== new URL(cssHref, window.location.origin).href) {
      link.href = cssHref;
    }

    if (fontOverrideCssHref) {
      let link2 = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
      if (!link2) {
        link2 = document.createElement('link');
        link2.id = FONT_LINK_ID;
        link2.rel = 'stylesheet';
        document.head.appendChild(link2);
      }

      // Update href when font override changes
      if (link2.href !== new URL(fontOverrideCssHref, window.location.origin).href) {
        link2.href = fontOverrideCssHref;
      }
    } else {
      // Remove font override stylesheet if no font override is specified
      const existingFontLink = document.getElementById(FONT_LINK_ID);
      if (existingFontLink) {
        existingFontLink.remove();
      }
    }
  }, [cssHref, fontOverrideCssHref, vibe]);

  return <div id="vibe-provider">{ children }</div>;
}
