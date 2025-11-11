import Image from 'next/image';

interface SubscriptionLogoProps {
  subscriptionName: string;
  height?: number;
}

export default function SubscriptionLogo({ subscriptionName, height = 100 }: SubscriptionLogoProps) {
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
  }
  return (
    <>
      <Image
        src={ `/subs/${logoLightUrl}.png` }
        width={ height }
        height={ height }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="dark"
        priority
      />

      <Image
        src={ `/subs/${logoDarkUrl}.png` }
        width={ height }
        height={ height }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="light"
        priority
      />
    </>
  );
}
