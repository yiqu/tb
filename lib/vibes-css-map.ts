import {
  Lora,
  Geist,
  Inter,
  Kanit,
  Rubik,
  Outfit,
  DM_Sans,
  Poppins,
  Oxanium,
  Open_Sans,
  Fira_Code,
  Geist_Mono,
  Montserrat,
  Space_Mono,
  Roboto_Mono,
  Merriweather,
  Indie_Flower,
  IBM_Plex_Mono,
  Source_Serif_4,
  JetBrains_Mono,
  Source_Code_Pro,
  Cherry_Bomb_One,
  Plus_Jakarta_Sans,
  Libre_Baskerville,
  Architects_Daughter,
} from 'next/font/google';

import { AppFont, AppVibe } from '@/models/settings/general-settings.models';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const indieFlower = Indie_Flower({
  variable: '--font-indie-flower',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
  weight: ['400', '500', '600', '700'],
});

export const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

export const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: ['400'],
  preload: true,
});

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  preload: false,
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const oxanium = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif-4',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

export const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

const VIBE_CSS_MAP: Record<AppVibe, string> = {
  'amber-minimal': '/vibes/amber-minimal/tw.css',
  'amethyst-haze': '/vibes/amethyst-haze/tw.css',
  'bubble-gum': '/vibes/bubble-gum/tw.css',
  caffeine: '/vibes/caffeine/tw.css',
  candy: '/vibes/candy/tw.css',
  claude: '/vibes/claude/tw.css',
  claymorphism: '/vibes/claymorphism/tw.css',
  cyberpunk: '/vibes/cyberpunk/tw.css',
  doom64: '/vibes/doom/tw.css',
  elegant: '/vibes/elegant/tw.css',
  grove: '/vibes/grove/tw.css',
  'mocha-mousse': '/vibes/mocha-mousse/tw.css',
  nature: '/vibes/nature/tw.css',
  'neo-brutalism': '/vibes/brutalism/tw.css',
  notebook: '/vibes/notebook/tw.css',
  'pastel-dreams': '/vibes/pastel-dreams/tw.css',
  'retro-arcade': '/vibes/retro-arcade/tw.css',
  softpop: '/vibes/softpop/tw.css',
  'solar-dusk': '/vibes/solar-dusk/tw.css',
  supabase: '/vibes/supabase/tw.css',
  'sword-fairy': '/vibes/sword-fairy/tw.css',
  t3: '/vibes/t3/tw.css',
  vercel: '/vibes/vercel/tw.css',
  vintage: '/vibes/vintage/tw.css',
};

const FONT_CSS_MAP: Record<AppFont, string> = {
  'architects-daughter': '/font-css/architects-daughter/tw.css',
  'dm-sans': '/font-css/dm-sans/tw.css',
  'fira-code': '/font-css/fira-code/tw.css',
  geist: '/font-css/geist/tw.css',
  'ibm-plex-mono': '/font-css/ibm-plex-mono/tw.css',
  inter: '/font-css/inter/tw.css',
  'jetbrains-mono': '/font-css/jetbrains-mono/tw.css',
  'libre-baskerville': '/font-css/libre-baskerville/tw.css',
  lora: '/font-css/lora/tw.css',
  merriweather: '/font-css/merriweather/tw.css',
  montserrat: '/font-css/montserrat/tw.css',
  'open-sans': '/font-css/open-sans/tw.css',
  outfit: '/font-css/outfit/tw.css',
  oxanium: '/font-css/oxanium/tw.css',
  poppins: '/font-css/poppins/tw.css',
  'roboto-mono': '/font-css/roboto-mono/tw.css',
  'source-code-pro': '/font-css/source-code-pro/tw.css',
  'space-mono': '/font-css/space-mono/tw.css',
};

export const FONT_CSS_CLASSNAME: Record<AppFont, string> = {
  'architects-daughter': architectsDaughter.className,
  'dm-sans': dmSans.className,
  'fira-code': firaCode.className,
  geist: geistSans.className,
  'ibm-plex-mono': ibmPlexMono.className,
  inter: inter.className,
  'jetbrains-mono': jetBrainsMono.className,
  'libre-baskerville': libreBaskerville.className,
  lora: lora.className,
  merriweather: merriweather.className,
  montserrat: montserrat.className,
  'open-sans': openSans.className,
  outfit: outfit.className,
  oxanium: oxanium.className,
  poppins: poppins.className,
  'roboto-mono': robotoMono.className,
  'source-code-pro': sourceCodePro.className,
  'space-mono': spaceMono.className,
};

export function getVibeStylesheetHref(vibe: AppVibe): string {
  return VIBE_CSS_MAP[vibe] ?? VIBE_CSS_MAP.vercel;
}

export function getFontStylesheetHref(font: AppFont | undefined): string {
  return FONT_CSS_MAP[font ?? ''] ?? '';
}

export function getFontVariableByVibe(vibe: AppVibe): string {
  let result = `${geistSans.variable} ${geistMono.variable}`;
  switch (vibe) {
    case 'vintage':
      result = `${libreBaskerville.variable} ${lora.variable} ${ibmPlexMono.variable}`;
      break;
    case 'vercel':
      result = `${geistSans.variable} ${geistMono.variable}`;
      break;
    case 't3':
      result = ``;
      break;
    case 'grove':
      result = `${merriweather.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable}`;
      break;
    case 'doom64':
      result = `${oxanium.variable} ${sourceCodePro.variable}`;
      break;
    case 'claude':
      result = ``;
      break;
    case 'bubble-gum':
      result = `${poppins.variable} ${lora.variable} ${firaCode.variable}`;
      break;
    case 'neo-brutalism':
      result = `${dmSans.variable} ${spaceMono.variable}`;
      break;
    case 'amber-minimal':
      result = `${inter.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable}`;
      break;
    case 'amethyst-haze':
      result = `${geistSans.variable} ${lora.variable} ${firaCode.variable}`;
      break;
    case 'caffeine':
      result = ``;
      break;
    case 'candy':
      result = `${poppins.variable} ${robotoMono.variable}`;
      break;
    case 'claymorphism':
      result = `${plusJakartaSans.variable} ${lora.variable} ${robotoMono.variable}`;
      break;
    case 'nature':
      result = `${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable}`;
      break;
    case 'notebook':
      result = `${architectsDaughter.variable}`;
      break;
    case 'solar-dusk':
      result = `${oxanium.variable} ${merriweather.variable} ${firaCode.variable}`;
      break;
    case 'supabase':
      result = `${outfit.variable}`;
      break;
    case 'pastel-dreams':
      result = `${openSans.variable} ${sourceSerif4.variable} ${ibmPlexMono.variable}`;
      break;
    case 'softpop':
      result = `${dmSans.variable} ${spaceMono.variable}`;
      break;
    case 'retro-arcade':
      result = `${outfit.variable} ${spaceMono.variable}`;
      break;
    case 'mocha-mousse':
      result = `${dmSans.variable} ${geistMono.variable}`;
      break;
    case 'elegant':
      result = `${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable}`;
      break;
    case 'cyberpunk':
      result = `${outfit.variable} ${firaCode.variable}`;
      break;
    case 'sword-fairy':
      result = `${outfit.variable} ${lora.variable} ${firaCode.variable}`;
      break;
  }

  result = `${result} ${cherryBombOne.variable}`;
  return result;
}

export function getFontVariableByFont(font: AppFont | undefined): string | undefined {
  let result: string | undefined = undefined;

  switch (font) {
    case 'geist':
      result = `${geistSans.variable}`;
      break;
    case 'poppins':
      result = `${poppins.variable}`;
      break;
    case 'outfit':
      result = `${outfit.variable}`;
      break;
    case 'dm-sans':
      result = `${dmSans.variable}`;
      break;
    case 'architects-daughter':
      result = `${architectsDaughter.variable}`;
      break;
    case 'inter':
      result = `${inter.variable}`;
      break;
    case 'lora':
      result = `${lora.variable}`;
      break;
    case 'merriweather':
      result = `${merriweather.variable}`;
      break;
    case 'montserrat':
      result = `${montserrat.variable}`;
      break;
    case 'libre-baskerville':
      result = `${libreBaskerville.variable}`;
      break;
    case 'open-sans':
      result = `${openSans.variable}`;
      break;
    case 'source-code-pro':
      result = `${sourceCodePro.variable}`;
      break;
    case 'space-mono':
      result = `${spaceMono.variable}`;
      break;
    case 'fira-code':
      result = `${firaCode.variable}`;
      break;
    case 'ibm-plex-mono':
      result = `${ibmPlexMono.variable}`;
      break;
    case 'jetbrains-mono':
      result = `${jetBrainsMono.variable}`;
      break;
    case 'roboto-mono':
      result = `${robotoMono.variable}`;
      break;
    case 'oxanium':
      result = `${oxanium.variable}`;
      break;
    default:
      result = undefined;
      break;
  }

  return result;
}
