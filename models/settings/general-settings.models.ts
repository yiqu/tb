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
] as const;

export type AppVibe = (typeof APP_VIBE_OPTIONS)[number];

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
};

export const APP_VIBE_OPTIONS_LIST: HFSelectOption[] = APP_VIBE_OPTIONS.map((vibe) => ({
  label: APP_VIBE_OPTIONS_MAP[vibe],
  value: vibe,
})).toSorted((a, b) => {
  return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1;
});
