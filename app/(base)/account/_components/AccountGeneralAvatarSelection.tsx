/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Image from 'next/image';
import { useOptimistic, useTransition } from 'react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import { AvatarOption } from '@/models/settings/Avatar.models';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { setSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';
import SplitText from '@/components/reactbits/TextAnimations/SplitText/SplitText';

const avatarOptions: AvatarOption[] = [
  {
    id: '1',
    name: 'Dishy',
    imageUrl: '/pfp/dishy.png',
  },
  {
    id: '2',
    name: 'Dee',
    imageUrl: '/pfp/deer.png',
  },
];

interface AccountGeneralAvatarSelectionProps {
  avatarId: string;
}

export default function AccountGeneralAvatarSelection({ avatarId }: AccountGeneralAvatarSelectionProps) {
  const [isPending, startTransition] = useTransition();

  const [avatarIdOptimistic, setAvatarIdOptimistic] = useOptimistic(avatarId, (currentState: string, optimisticValue: string) => {
    return optimisticValue;
  });

  const onAvatarChange = (value: string) => {
    startTransition(async () => {
      setAvatarIdOptimistic(value);
      try {
        await setSettingsUpdateAvatarImage(value);
      } catch (error) {
        setAvatarIdOptimistic(avatarId);
      }
    });
  };

  return (
    <section className="w-full">
      <RadioGroup onValueChange={ onAvatarChange } value={ `${avatarIdOptimistic}` }>
        <div className="grid grid-cols-8 gap-2">
          { avatarOptions.map((option) => {
            const isSelected = avatarIdOptimistic === option.id;

            return (
              <div key={ option.id } className="col-span-4">
                <div className={ `flex w-full flex-col items-center justify-start gap-y-4` }>
                  <Typography className={ `logo-text-color text-center font-fun` } variant="h3">
                    <SplitText
                      text={ option.name }
                      className=""
                      delay={ 160 }
                      animationFrom={ { opacity: 0, transform: 'translate3d(0,50px,0)' } }
                      animationTo={ { opacity: 1, transform: 'translate3d(0,0,0)' } }
                      easing={ 'easeOutCubic' as any }
                      threshold={ 0.2 }
                      rootMargin="-50px"
                    />
                  </Typography>
                  <Image key={ option.id } src={ option.imageUrl } alt={ option.name } width={ 200 } height={ 200 } className="rounded-2xl" />

                  <RadioGroupItem
                    value={ option.id }
                    className={ cn(`size-8 cursor-pointer border-ring transition-all duration-300 hover:scale-120`, {
                      'hover:scale-100': isSelected,
                    }) }
                    circleIconClassName={ cn('size-5', {
                      'fill-amber-300': isPending,
                    }) }
                  />
                </div>
              </div>
            );
          }) }
        </div>
      </RadioGroup>
    </section>
  );
}
