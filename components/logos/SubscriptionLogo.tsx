import Image from 'next/image';

import { cn } from '@/lib/utils';

interface SubscriptionLogoProps {
  subscriptionName: string;
  className?: string;
  height?: number;
}

export function getSubscriptionLogoUrl(subscriptionName: string): { light: string; dark: string } {
  let logoLightUrl = 'renewal';
  let logoDarkUrl = 'renewal';
  const name = subscriptionName.trim();

  switch (name) {
    case 'GitHub Copilot': {
      logoLightUrl = 'githubcopilot_light';
      logoDarkUrl = 'githubcopilot_dark';
      break;
    }

    case 'GitHub Pro': {
      logoLightUrl = 'github_light';
      logoDarkUrl = 'github_dark';
      break;
    }

    case 'UI dot dev': {
      logoLightUrl = 'uidotdev';
      logoDarkUrl = 'uidotdev';
      break;
    }

    case 'Vercel Pro': {
      logoLightUrl = 'vercel_light';
      logoDarkUrl = 'vercel_dark';
      break;
    }

    case 'MUI Minimal Dashboard': {
      logoLightUrl = 'mui';
      logoDarkUrl = 'mui';
      break;
    }

    case 'MonaLisa Typeface': {
      logoLightUrl = 'mona-lisa';
      logoDarkUrl = 'mona-lisa';
      break;
    }

    case 'Flaticon Pro': {
      logoLightUrl = 'flaticon';
      logoDarkUrl = 'flaticon';
      break;
    }

    case 'Loading io': {
      logoLightUrl = 'loading';
      logoDarkUrl = 'loading';
      break;
    }

    case 'Pro Nextjs By Jack Harrington': {
      logoLightUrl = 'blackboard';
      logoDarkUrl = 'blackboard';
      break;
    }

    case 'Cursor IDE Pro': {
      logoLightUrl = 'cursor_light';
      logoDarkUrl = 'cursor_dark';
      break;
    }

    case 'ByteGrad': {
      logoLightUrl = 'blackboard';
      logoDarkUrl = 'blackboard';
      break;
    }

    case 'ChatGPT Plus': {
      logoLightUrl = 'openai_light';
      logoDarkUrl = 'openai_dark';
      break;
    }

    case 'MUI X Pro License': {
      logoLightUrl = 'mui';
      logoDarkUrl = 'mui';
      break;
    }

    case 'Medium': {
      logoLightUrl = 'medium';
      logoDarkUrl = 'medium';
      break;
    }

    case 'Microsoft 365': {
      logoLightUrl = 'microsoft';
      logoDarkUrl = 'microsoft';
      break;
    }

    case 'T3 Chat': {
      logoLightUrl = 'chat_t3';
      logoDarkUrl = 'chat_t3';
      break;
    }

    case 'Vercel v0': {
      logoLightUrl = 'v0_light';
      logoDarkUrl = 'v0_dark';
      break;
    }

    case 'CompTIA Security Plus': {
      logoLightUrl = 'shield';
      logoDarkUrl = 'shield';
      break;
    }

    case 'MongoDB Atlas Flex': {
      logoLightUrl = 'mongodb';
      logoDarkUrl = 'mongodb';
      break;
    }

    case 'Education to Training Hours': {
      logoLightUrl = 'edu';
      logoDarkUrl = 'edu';
      break;
    }

    case 'Netflix': {
      logoLightUrl = 'nf-logo';
      logoDarkUrl = 'nf-logo';
      break;
    }

    case 'YouTube TV Base': {
      logoLightUrl = 'yttv';
      logoDarkUrl = 'yttv';
      break;
    }

    case 'Disney+': {
      logoLightUrl = 'dplus';
      logoDarkUrl = 'dplus';
      break;
    }

    case 'Paramount+': {
      logoLightUrl = 'pplus';
      logoDarkUrl = 'pplus';
      break;
    }

    case 'Peacock TV': {
      logoLightUrl = 'peacocktv';
      logoDarkUrl = 'peacocktv';
      break;
    }

    case 'HBO Max': {
      logoLightUrl = 'hbotv';
      logoDarkUrl = 'hbotv';
      break;
    }

    case 'Apple TV': {
      logoLightUrl = 'appletv';
      logoDarkUrl = 'appletv';
      break;
    }

    case 'Amazon Prime Videos': {
      logoLightUrl = 'primetvlogo';
      logoDarkUrl = 'primetvlogo';
      break;
    }

    case 'DAZN': {
      logoLightUrl = 'daznlogo';
      logoDarkUrl = 'daznlogo';
      break;
    }

    case 'Costco Gold Star': {
      logoLightUrl = 'costcologo';
      logoDarkUrl = 'costcologo';
      break;
    }

    case 'Xbox Game Pass Essential': {
      logoLightUrl = 'xboxlogo';
      logoDarkUrl = 'xboxlogo';
      break;
    }

    case 'PlayStation Plus Essential': {
      logoLightUrl = 'pslogo';
      logoDarkUrl = 'pslogo';
      break;
    }

    case 'Spotify Individual': {
      logoLightUrl = 'spotlogo';
      logoDarkUrl = 'spotlogo';
      break;
    }

    case 'Planet Fitness Classic': {
      logoLightUrl = 'pflogo';
      logoDarkUrl = 'pflogo';
      break;
    }

    case "Sam's Club": {
      logoLightUrl = 'samlogo';
      logoDarkUrl = 'samlogo';
      break;
    }

    case 'Doordash Dash Pass': {
      logoLightUrl = 'dashlogo';
      logoDarkUrl = 'dashlogo';
      break;
    }

    case 'Claude AI Pro': {
      logoLightUrl = 'claude-light';
      logoDarkUrl = 'claude-dark';
      break;
    }
  }

  return {
    light: `/subs/${logoLightUrl}.png`,
    dark: `/subs/${logoDarkUrl}.png`,
  };
}

export default function SubscriptionLogo({ subscriptionName, className, height = 100 }: SubscriptionLogoProps): React.ReactNode {
  const { light, dark } = getSubscriptionLogoUrl(subscriptionName);
  return (
    <>
      <Image
        src={ light }
        width={ height }
        height={ height }
        alt="logo"
        className={ cn('shrink-0', className) }
        data-hide-on-theme="dark"
        priority
      />

      <Image
        src={ dark }
        width={ height }
        height={ height }
        alt="logo"
        className={ cn('shrink-0', className) }
        data-hide-on-theme="light"
        priority
      />
    </>
  );
}
