import { HFSelectOption } from '../general/forms.model';

export const APP_VIBE_OPTIONS = [
  'vintage',
  't3',
  'neo-brutalism',
  'bubble-gum',
  'claude',
  'doom64',
  'vercel',
  'grove',
  'amber-minimal',
  'amethyst-haze',
  'caffeine',
  'candy',
  'claymorphism',
  'nature',
  'notebook',
  'solar-dusk',
  'supabase',
  'pastel-dreams',
  'softpop',
  'retro-arcade',
  'mocha-mousse',
  'elegant',
  'cyberpunk',
] as const;

export const APP_FONT_OPTIONS = [
  'geist',
  'poppins',
  'outfit',
  'dm-sans',
  'architects-daughter',
  'inter',
  'lora',
  'merriweather',
  'montserrat',
  'libre-baskerville',
  'open-sans',
  'source-code-pro',
  'space-mono',
  'fira-code',
  'ibm-plex-mono',
  'jetbrains-mono',
  'roboto-mono',
  'oxanium',
] as const;

export type AppVibe = (typeof APP_VIBE_OPTIONS)[number];
export type AppFont = (typeof APP_FONT_OPTIONS)[number];

export const APP_VIBE_OPTIONS_MAP: Record<AppVibe, string> = {
  'amber-minimal': 'Amber Minimal',
  vintage: 'Vintage',
  t3: 'T3',
  'neo-brutalism': 'Neo Brutalism',
  'bubble-gum': 'Bubble Gum',
  claude: 'Claude',
  doom64: 'Doom 64',
  vercel: 'Vercel',
  grove: 'Kodama Grove',
  'amethyst-haze': 'Amethyst Haze',
  caffeine: 'Caffeine',
  candy: 'Candy',
  claymorphism: 'Claymorphism',
  nature: 'Nature',
  notebook: 'Notebook',
  'solar-dusk': 'Solar Dusk',
  supabase: 'Supabase',
  'pastel-dreams': 'Pastel Dreams',
  softpop: 'Softpop',
  'retro-arcade': 'Retro Arcade',
  'mocha-mousse': 'Mocha Mousse',
  elegant: 'Elegant Luxury',
  cyberpunk: 'Cyberpunk',
};

export const APP_FONT_OPTIONS_MAP: Record<AppFont, string> = {
  geist: 'Geist',
  poppins: 'Poppins',
  outfit: 'Outfit',
  'dm-sans': 'DM Sans',
  'architects-daughter': 'Architects Daughter',
  inter: 'Inter',
  lora: 'Lora',
  merriweather: 'Merriweather',
  montserrat: 'Montserrat',
  'libre-baskerville': 'Libre Baskerville',
  'open-sans': 'Open Sans',
  'source-code-pro': 'Source Code Pro',
  'space-mono': 'Space Mono',
  'fira-code': 'Fira Code',
  'ibm-plex-mono': 'IBM Plex Mono',
  'jetbrains-mono': 'JetBrains Mono',
  'roboto-mono': 'Roboto Mono',
  oxanium: 'Oxanium',
};

export const APP_VIBE_OPTIONS_LIST: HFSelectOption[] = APP_VIBE_OPTIONS.map((vibe) => ({
  label: APP_VIBE_OPTIONS_MAP[vibe],
  value: vibe,
})).toSorted((a, b) => {
  return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1;
});

export const APP_FONT_OPTIONS_LIST: HFSelectOption[] = APP_FONT_OPTIONS.map((font) => ({
  label: APP_FONT_OPTIONS_MAP[font],
  value: font,
})).toSorted((a, b) => {
  return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1;
});
