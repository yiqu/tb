/* eslint-disable no-unused-vars */

import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import Typewriter from '@/fancy/components/text/typewriter';
import { HyperText } from '@/components/magicui/hyper-text';
import { ShineBorder } from '@/components/magicui/shine-border';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import ConsentCardFooter from './ConsentCardFooter';

const PTO = ['#A07CFE', '#FE8FB5', '#FFBE7B'];
const GOOG = ['#4285f4', '#34a853', '#fbbc05', '#ea4335'];

export default function ConsentContentCard() {
  return (
    <DisplayCard className="relative z-10 max-w-[40rem] overflow-hidden bg-background">
      <ShineBorder shineColor={ GOOG } borderWidth={ 2 } />
      <CardHeader>
        <CardTitle>
          <Typewriter
            text={ ['Consent', 'Agreement', 'Acceptance'] }
            speed={ 100 }
            className=""
            waitTime={ 1500 }
            deleteSpeed={ 40 }
            cursorChar={ '_' }
            loop={ true }
          />
        </CardTitle>
        <CardDescription>
          <HyperText
            className={ cn('py-0 font-sans text-[0.875rem] leading-6 font-normal tracking-normal') }
            letterClassName="font-sans text-[0.875rem] "
            duration={ 1200 }
            delay={ 1500 }
          >
            Read, agree and accept the terms and conditions.
          </HyperText>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Typography variant="p">
          We use cookies to ensure you get the best experience on our website. By clicking &quot;Accept&quot;, you agree to the storing of
          cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
        </Typography>
      </CardContent>
      <Suspense fallback={ <Skeleton className="h-9 w-full" /> }>
        <ConsentCardFooter />
      </Suspense>
    </DisplayCard>
  );
}
