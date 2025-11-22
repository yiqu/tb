import { Avatar as AvatarPrimitive } from 'radix-ui';

import { getUSDFormatter } from '@/lib/number.utils';
import { SubscriptionOriginal } from '@/models/bills/bills.model';

import { getSubscriptionLogoUrl } from './SubscriptionLogo';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface SubscriptionLogoProps {
  subscription: SubscriptionOriginal;
  avatarProps?: React.ComponentProps<typeof AvatarPrimitive.Root>;
}

const usdFormatter = getUSDFormatter(2, 2);

export default function SubscriptionLogoAvatar({ subscription, avatarProps }: SubscriptionLogoProps): React.ReactNode {
  const { light, dark } = getSubscriptionLogoUrl(subscription.name);
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar data-hide-on-theme="dark" className="size-6" { ...avatarProps }>
            <AvatarImage src={ light } alt={ subscription.name } fetchPriority="high" loading="eager" />
            <AvatarFallback>{ subscription.name.charAt(0) }</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            { subscription.name }: { usdFormatter.format(subscription.cost) }
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar data-hide-on-theme="light" className="size-6" { ...avatarProps }>
            <AvatarImage src={ dark } alt={ subscription.name } fetchPriority="high" loading="eager" />
            <AvatarFallback>{ subscription.name.charAt(0) }</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            { subscription.name }: { usdFormatter.format(subscription.cost) }
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
