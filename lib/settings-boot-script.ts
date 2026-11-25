import { AppFont, AppVibe, APP_FONT_OPTIONS, APP_VIBE_OPTIONS } from '@/models/settings/general-settings.models';
import {
  SIDE_NAV_STATE_COOKIE_NAME,
  TABLE_BORDER_DATA_ATTRIBUTES,
  SETTINGS_USER_FONT_COOKIE_NAME,
  SETTINGS_USER_VIBE_COOKIE_NAME,
  SETTINGS_TABLE_VERTICAL_BORDERS_COOKIE_NAME,
  SETTINGS_TABLE_HORIZONTAL_BORDERS_COOKIE_NAME,
} from '@/constants/constants';
import {
  SIDE_NAV_MAX_WIDTH_PX,
  SIDE_NAV_MIN_WIDTH_PX,
  SIDE_NAV_DEFAULT_WIDTH_PX,
  SIDE_NAV_WIDTH_COOKIE_NAME,
  SHELL_SIDE_NAV_WIDTH_CSS_VARIABLE,
} from '@/constants/side-nav-resize.constants';

import { getHtmlFontClassName, getFontStylesheetHref, getVibeStylesheetHref } from './vibes-css-map';

/*
 * The (base) root layout no longer reads cookies, so `<html>`, `<head>` and `<body>` can be part of
 * the static shell that Cache Components prerenders. The settings that used to come from cookies on
 * the server (vibe stylesheet, font override, font classes on <html>, table border attributes on <body>)
 * are applied by these inline scripts instead. They run while the browser parses the HTML, so the
 * page is painted with the right theme on the first frame.
 *
 * Cookie values are only ever used as keys into the maps below, never written into the page.
 */

export const DEFAULT_VIBE: AppVibe = 'amethyst-haze';
export const VIBE_STYLESHEET_LINK_ID = 'vibe-theme-stylesheet';
export const FONT_STYLESHEET_LINK_ID = 'vibe-font-stylesheet';
export const SHELL_SIDE_NAV_DATA_ATTRIBUTE = 'data-shell-sidenav';

interface FontBootEntry {
  className: string;
  href: string;
}

interface HeadBootConfig {
  vibeCookie: string;
  fontCookie: string;
  sideNavCookie: string;
  defaultVibe: AppVibe;
  vibeLinkId: string;
  fontLinkId: string;
  sideNavAttribute: string;
  sideNavWidthCookie: string;
  sideNavWidthVariable: string;
  sideNavMinWidth: number;
  sideNavMaxWidth: number;
  sideNavDefaultWidth: number;
  vibes: Record<string, FontBootEntry>;
  fonts: Record<string, FontBootEntry>;
}

function buildHeadBootConfig(): HeadBootConfig {
  const vibes: Record<string, FontBootEntry> = {};
  APP_VIBE_OPTIONS.forEach((vibe: AppVibe) => {
    vibes[vibe] = { className: getHtmlFontClassName(vibe, undefined), href: getVibeStylesheetHref(vibe) };
  });

  const fonts: Record<string, FontBootEntry> = {};
  APP_FONT_OPTIONS.forEach((font: AppFont) => {
    const href: string = getFontStylesheetHref(font);
    if (href) {
      fonts[font] = { className: getHtmlFontClassName(DEFAULT_VIBE, font), href };
    }
  });

  return {
    vibeCookie: SETTINGS_USER_VIBE_COOKIE_NAME,
    fontCookie: SETTINGS_USER_FONT_COOKIE_NAME,
    sideNavCookie: SIDE_NAV_STATE_COOKIE_NAME,
    defaultVibe: DEFAULT_VIBE,
    vibeLinkId: VIBE_STYLESHEET_LINK_ID,
    fontLinkId: FONT_STYLESHEET_LINK_ID,
    sideNavAttribute: SHELL_SIDE_NAV_DATA_ATTRIBUTE,
    sideNavWidthCookie: SIDE_NAV_WIDTH_COOKIE_NAME,
    sideNavWidthVariable: SHELL_SIDE_NAV_WIDTH_CSS_VARIABLE,
    sideNavMinWidth: SIDE_NAV_MIN_WIDTH_PX,
    sideNavMaxWidth: SIDE_NAV_MAX_WIDTH_PX,
    sideNavDefaultWidth: SIDE_NAV_DEFAULT_WIDTH_PX,
    vibes,
    fonts,
  };
}

const READ_COOKIES_JS = `var c={};document.cookie.split('; ').forEach(function(p){var i=p.indexOf('=');if(i>0){try{c[p.slice(0,i)]=decodeURIComponent(p.slice(i+1))}catch(e){}}});`;

/**
 * Runs in <head>.
 * - writes the saved vibe stylesheet, and the font override stylesheet if any, as parser-inserted <link>s.
 *   Parser-inserted stylesheets block the first paint, so there is no flash of the default theme.
 *   React does not render these links (it would match them by href on hydration and add a duplicate);
 *   `VibeProvider` finds them by id and updates them when the setting changes.
 * - adds the font CSS variable classes to <html>
 * - marks <html> with the saved sidebar state so the shell skeleton matches the real sidebar
 * - sets the saved sidebar width as a CSS variable on <html>, for the same reason. It reads the cookie like
 *   `parseSideNavWidth`: no cookie leaves the CSS default (16rem), a broken one gives `SIDE_NAV_DEFAULT_WIDTH_PX`
 */
export function getHeadBootScript(): string {
  const config: HeadBootConfig = buildHeadBootConfig();
  return `(function(){try{var M=${JSON.stringify(config)};${READ_COOKIES_JS}var d=document.documentElement;var v=Object.prototype.hasOwnProperty.call(M.vibes,c[M.vibeCookie])?c[M.vibeCookie]:M.defaultVibe;var f=Object.prototype.hasOwnProperty.call(M.fonts,c[M.fontCookie])?M.fonts[c[M.fontCookie]]:null;if(!document.getElementById(M.vibeLinkId)){document.write('<link id="'+M.vibeLinkId+'" rel="stylesheet" href="'+M.vibes[v].href+'">');}if(f&&!document.getElementById(M.fontLinkId)){document.write('<link id="'+M.fontLinkId+'" rel="stylesheet" href="'+f.href+'">');}(f?f.className:M.vibes[v].className).split(' ').forEach(function(k){if(k)d.classList.add(k);});d.setAttribute(M.sideNavAttribute,(c[M.sideNavCookie]===undefined||String(c[M.sideNavCookie]).toLowerCase()==='true')?'expanded':'collapsed');var w=c[M.sideNavWidthCookie];if(w!==undefined){var n=Number(w);d.style.setProperty(M.sideNavWidthVariable,(/^\\d+$/.test(w)&&isFinite(n)?Math.max(M.sideNavMinWidth,Math.min(M.sideNavMaxWidth,n)):M.sideNavDefaultWidth)+'px');}}catch(e){}})();`;
}

/**
 * Runs as the first child of <body>: mirrors the table border cookies onto <body>,
 * the same attributes `AppSettingProvider` keeps in sync when the settings change.
 */
export function getBodyBootScript(): string {
  const config = {
    attributes: [
      { name: TABLE_BORDER_DATA_ATTRIBUTES.horizontal, cookie: SETTINGS_TABLE_HORIZONTAL_BORDERS_COOKIE_NAME },
      { name: TABLE_BORDER_DATA_ATTRIBUTES.vertical, cookie: SETTINGS_TABLE_VERTICAL_BORDERS_COOKIE_NAME },
    ],
  };
  return `(function(){try{var M=${JSON.stringify(config)};${READ_COOKIES_JS}M.attributes.forEach(function(a){document.body.setAttribute(a.name,c[a.cookie]==='false'?'false':'true');});}catch(e){}})();`;
}
