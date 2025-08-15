import {
  Lora,
  Geist,
  Inter,
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
  IBM_Plex_Mono,
  Source_Serif_4,
  JetBrains_Mono,
  Source_Code_Pro,
  Cherry_Bomb_One,
  Plus_Jakarta_Sans,
  Libre_Baskerville,
  Architects_Daughter,
} from 'next/font/google';

import { AppVibe } from '@/models/settings/general-settings.models';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
  weight: ['400'],
});

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400'],
  preload: true,
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const oxanium = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif-4',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code-pro',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

const VIBE_CSS_MAP: Record<AppVibe, string> = {
  vintage: '/vibes/vintage/tw.css',
  vercel: '/vibes/vercel/tw.css',
  t3: '/vibes/t3/tw.css',
  grove: '/vibes/grove/tw.css',
  doom64: '/vibes/doom/tw.css',
  claude: '/vibes/claude/tw.css',
  'bubble-gum': '/vibes/bubble-gum/tw.css',
  'neo-brutalism': '/vibes/brutalism/tw.css',
  'amber-minimal': '/vibes/amber-minimal/tw.css',
  'amethyst-haze': '/vibes/amethyst-haze/tw.css',
  caffeine: '/vibes/caffeine/tw.css',
  candy: '/vibes/candy/tw.css',
  claymorphism: '/vibes/claymorphism/tw.css',
  nature: '/vibes/nature/tw.css',
  notebook: '/vibes/notebook/tw.css',
  'solar-dusk': '/vibes/solar-dusk/tw.css',
  supabase: '/vibes/supabase/tw.css',
  'pastel-dreams': '/vibes/pastel-dreams/tw.css',
  softpop: '/vibes/softpop/tw.css',
  'retro-arcade': '/vibes/retro-arcade/tw.css',
  'mocha-mousse': '/vibes/mocha-mousse/tw.css',
  elegant: '/vibes/elegant/tw.css',
  cyberpunk: '/vibes/cyberpunk/tw.css',
};

export function getVibeStylesheetHref(vibe: AppVibe): string {
  return VIBE_CSS_MAP[vibe] ?? VIBE_CSS_MAP.vintage;
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
  }

  result = `${result} ${cherryBombOne.variable}`;
  return result;
}
