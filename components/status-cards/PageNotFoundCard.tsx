import Image from 'next/image';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import DisplayCard from '@/shared/components/DisplayCard';

import { Lens } from '../magicui/lens';
import { Separator } from '../ui/separator';
import Typography from '../typography/Typography';
import TrueFocus from '../reactbits/TextAnimations/TrueFocus/TrueFocus';

const IMAGE_WIDTH = 400;

interface PageNotFoundCardProps {
  children?: ReactNode;
  blendBg?: boolean;
  showTextAreaBorder?: boolean;
  blendTextAreaBorder?: boolean;
}

export default function PageNotFoundCard({
  children,
  blendBg,
  showTextAreaBorder,
  blendTextAreaBorder,
}: PageNotFoundCardProps) {
  return (
    <DisplayCard
      className={ cn('w-[45rem] sec:w-[60rem] main:w-[80rem]', {
        'border-0 bg-transparent shadow-none': blendBg,
      }) }
    >
      <div className="grid grid-cols-2 gap-x-8">
        <div className={ `relative flex flex-col items-center justify-center overflow-hidden rounded-2xl` }>
          <Lens zoomFactor={ 2 } lensSize={ 120 } isStatic={ false } ariaLabel="no results img">
            <Image
              src={ `/images/not-found-404.png` }
              alt="error img"
              width={ IMAGE_WIDTH }
              height={ IMAGE_WIDTH }
              priority
              className="rounded-2xl mask-t-from-90% mask-l-from-90% main:w-[80rem]"
              data-hide-on-theme="dark"
            />
            <Image
              src={ `/images/not-found-404-night.png` }
              alt="error img"
              width={ IMAGE_WIDTH }
              height={ IMAGE_WIDTH }
              priority
              className="rounded-2xl mask-t-from-90% mask-l-from-90% main:w-[80rem]"
              data-hide-on-theme="light"
            />
          </Lens>
        </div>
        <div
          className={ cn('flex w-full flex-col items-start justify-start gap-y-4 main:gap-y-6', {
            'rounded-md border bg-card px-6 py-6': showTextAreaBorder,
            'border-0 bg-transparent': blendTextAreaBorder,
          }) }
        >
          <div className="flex w-full flex-row items-center justify-center pb-2">
            <TrueFocus
              sentence="Page Not Found"
              manualMode={ false }
              borderColor="oklch(0.62 0.08 65.54)"
              blurAmount={ 1.9 }
              animationDuration={ 0.5 }
              pauseBetweenAnimations={ 2 }
              parentClassName={ 'flex flex-row justify-start items-center' }
              textClassName={ 'text-[36px] tracking-wide' }
            />
          </div>

          <Separator />

          { children ?
            children
          : <Typography variant="body1" className="text-center">
            404: The page you are looking for does not exist.
          </Typography>
          }
        </div>
      </div>
    </DisplayCard>
  );
}
