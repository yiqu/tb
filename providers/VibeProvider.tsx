'use client';

import { ReactNode, useEffect, useRef } from 'react';

import { AppFont, AppVibe } from '@/models/settings/general-settings.models';
import { getFontStylesheetHref, getVibeStylesheetHref } from '@/lib/vibes-css-map';

import { FONT_STYLESHEET_LINK_ID, VIBE_STYLESHEET_LINK_ID } from '@/lib/settings-boot-script';

const LINK_ID = VIBE_STYLESHEET_LINK_ID;
const FONT_LINK_ID = FONT_STYLESHEET_LINK_ID;

function splitClassNames(className: string): string[] {
  return className.split(' ').filter((name: string) => name.length > 0);
}

export default function VibeProvider({
  vibe = 'amethyst-haze',
  fontOverride,
  htmlFontClassName,
  children,
}: {
  vibe: AppVibe;
  fontOverride: AppFont | undefined;
  htmlFontClassName: string;
  children: ReactNode;
}) {
  // The boot script in the root layout put these classes on <html> before the first paint.
  // When the vibe or font changes later, swap the old classes for the new ones (next-themes also owns classes on <html>).
  const appliedHtmlFontClassNameRef = useRef<string>(htmlFontClassName);

  useEffect(() => {
    const root: HTMLElement = document.documentElement;
    splitClassNames(appliedHtmlFontClassNameRef.current).forEach((name: string) => root.classList.remove(name));
    splitClassNames(htmlFontClassName).forEach((name: string) => root.classList.add(name));
    appliedHtmlFontClassNameRef.current = htmlFontClassName;
  }, [htmlFontClassName]);

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
