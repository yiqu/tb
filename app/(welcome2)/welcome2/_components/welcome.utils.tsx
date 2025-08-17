import Image from 'next/image';
import { Cpu, Lock, Globe, Cloud, Users, Layers, Target, Rocket, BarChart3, Smartphone } from 'lucide-react';

import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';

export const contentSections = [
  {
    title: 'Smart Automation Engine',
    icon: Cpu,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    imageQuery: 'drinking',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#fef0d9', '#fdcc8a', '#fc8d59'] }
        brushSize={ 50 }
      >
        <Image
          src={ `/dinos/${'drinking'}.png` }
          alt={ 'drinking' }
          width={ 600 }
          height={ 500 }
          className={ `w-full rounded-xl border shadow-2xl` }
        />
      </ScratchToReveal>
    ),
  },
  {
    title: 'Global Integration Network',
    icon: Globe,
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#005493', '#f5aa1c', '#c63527'] }
      >
        <Image src={ `/dinos/${'eating'}.png` } alt={ 'eating' } width={ 600 } height={ 500 } className={ `
          w-full rounded-xl border shadow-2xl
        ` } />
      </ScratchToReveal>
    ),
  },
  {
    title: 'Advanced Security Protocols',
    icon: Lock,
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#ffc6c4', '#e38191', '#ad466c'] }
      >
        <Image src={ `/dinos/${'flying'}.png` } alt={ 'drinking' } width={ 600 } height={ 500 } className={ `
          w-full rounded-xl border shadow-2xl
        ` } />
      </ScratchToReveal>
    ),
  },
  {
    title: 'Mobile-First Experience',
    icon: Smartphone,
    text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum.',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#d7191c', '#fdae61', '#a6d96a'] }
      >
        <Image
          src={ `/dinos/${'looking'}.png` }
          alt={ 'drinking' }
          width={ 600 }
          height={ 500 }
          className={ `w-full rounded-xl border shadow-2xl` }
        />
      </ScratchToReveal>
    ),
  },
  {
    title: 'Cloud Infrastructure',
    icon: Cloud,
    text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#ed6b06', '#9d1348', '#008b5d'] }
      >
        <Image
          src={ `/dinos/${'drinking'}.png` }
          alt={ 'drinking' }
          width={ 600 }
          height={ 500 }
          className={ `w-full rounded-xl border shadow-2xl` }
        />
      </ScratchToReveal>
    ),
  },
  {
    title: 'Layered Architecture',
    icon: Layers,
    text: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
    imageComponent: (
      <ScratchToReveal
        width={ 600 }
        height={ 500 }
        minScratchPercentage={ 50 }
        className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
        gradientColors={ ['#A97CF8', '#F38CB8', '#FDCC92'] }
      >
        <Image
          src={ `/dinos/${'drinking'}.png` }
          alt={ 'drinking' }
          width={ 600 }
          height={ 500 }
          className={ `w-full rounded-xl border shadow-2xl` }
        />
      </ScratchToReveal>
    ),
  },
];

export const APP_TITLE = 'KQPRO';
