/* eslint-disable quote-props */
/* eslint-disable better-tailwindcss/multiline */
import Image from 'next/image';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { FONT_FAMILY_FUN } from '@/constants/constants';
import DisplayCard from '@/shared/components/DisplayCard';

import { CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Particles } from '../magicui/particles';
import Typography from '../typography/Typography';
import FuzzyText from '../reactbits/TextAnimations/FuzzyText/FuzzyText';

const IMAGE_WIDTH = 400;

interface ErrorCardProps {
  children?: ReactNode;
  blendBg?: boolean;
  showTextAreaBorder?: boolean;
  blendTextAreaBorder?: boolean;
}

export default function ErrorCard({ children, blendBg, showTextAreaBorder, blendTextAreaBorder }: ErrorCardProps) {
  return (
    <DisplayCard
      className={ cn('w-[45rem] sec:w-[60rem] main:w-[80rem]', {
        'border-0 bg-transparent shadow-none': blendBg,
      }) }
    >
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8">
          <div className={ `relative flex flex-col items-center justify-center overflow-hidden rounded-2xl` }>
            <Image
              src={ `/images/forestfire.png` }
              alt="error img"
              width={ IMAGE_WIDTH }
              height={ IMAGE_WIDTH }
              priority
              className="rounded-2xl mask-t-from-90% mask-l-from-93%"
            />
            <Particles
              className="absolute inset-0 z-0 h-full w-full"
              quantity={ 150 }
              ease={ 40 }
              color={ '#fff' }
              refresh={ false }
              staticity={ 70 }
              size={ 0.8 }
            />
          </div>
          <div
            className={ cn('flex w-full flex-col items-start justify-start gap-y-4 main:gap-y-6', {
              'rounded-md border bg-card px-6 py-6': showTextAreaBorder,
              'border-0 bg-transparent': blendTextAreaBorder,
            }) }
          >
            <div className="flex h-7 w-full flex-row items-center justify-center overflow-hidden">
              <FuzzyText hoverIntensity={ 0.3 } enableHover={ true } fontSize={ 36 } fontFamily={ FONT_FAMILY_FUN }>
                Error
              </FuzzyText>
            </div>

            <Separator />

            <Typography variant="body1" className="text-center">
              An unexpected error has occurred.
            </Typography>
            { children }
          </div>
        </div>
      </CardContent>
    </DisplayCard>
  );
}
