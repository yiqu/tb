import { AppVibe } from '@/models/settings/general-settings.models';

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
