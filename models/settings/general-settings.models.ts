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
  "amber-minimal": "Amber Minimal",
  "amethyst-haze": "Amethyst Haze",
  "bubble-gum": "Bubble Gum",
  caffeine: "Caffeine",
  candy: "Candy",
  claude: "Claude",
  claymorphism: "Claymorphism",
  cyberpunk: "Cyberpunk",
  doom64: "Doom 64",
  elegant: "Elegant Luxury",
  grove: "Kodama Grove",
  "mocha-mousse": "Mocha Mousse",
  nature: "Nature",
  "neo-brutalism": "Neo Brutalism",
  notebook: "Notebook",
  "pastel-dreams": "Pastel Dreams",
  "retro-arcade": "Retro Arcade",
  softpop: "Softpop",
  "solar-dusk": "Solar Dusk",
  supabase: "Supabase",
  t3: "T3",
  vercel: "Vercel",
  vintage: "Vintage"
};

export const APP_FONT_OPTIONS_MAP: Record<AppFont, string> ={
  "architects-daughter": "Architects Daughter",
  "dm-sans": "DM Sans",
  "fira-code": "Fira Code",
  geist: "Geist",
  "ibm-plex-mono": "IBM Plex Mono",
  inter: "Inter",
  "jetbrains-mono": "JetBrains Mono",
  "libre-baskerville": "Libre Baskerville",
  lora: "Lora",
  merriweather: "Merriweather",
  montserrat: "Montserrat",
  "open-sans": "Open Sans",
  outfit: "Outfit",
  oxanium: "Oxanium",
  poppins: "Poppins",
  "roboto-mono": "Roboto Mono",
  "source-code-pro": "Source Code Pro",
  "space-mono": "Space Mono"
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
