import { Cherry_Bomb_One } from 'next/font/google';

import { cn } from '@/lib/utils';
import { getFontVariableByFont, getFontVariableByVibe } from '@/lib/vibes-css-map';
import { getSettingsApplicationFont, getSettingsApplicationVibe } from '@/server/settings/vibe-select';

import './globals.css';
import './scrollbar.css';
import './animations.css';
import './tailwind-config.css';
import BodyParent from './BodyParent';

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

export default async function LayoutBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [vibe, fontOverride] = await Promise.all([getSettingsApplicationVibe(), getSettingsApplicationFont()]);

  const cssVariables = getFontVariableByVibe(vibe);
  const fontOverrideCssVariables: string | undefined = getFontVariableByFont(fontOverride);

  return (
    <html
      lang="en"
      className={ cn(fontOverrideCssVariables ? `
        ${fontOverrideCssVariables}
        ${cherryBombOne.variable}
      ` : cssVariables) }
      suppressHydrationWarning
    >
      <BodyParent>{ children }</BodyParent>
    </html>
  );
}
