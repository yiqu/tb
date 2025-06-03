import Link from 'next/link';

import ApiStatusButtonContent from './ApiStatusButtonContent';
import ApiStatusButtonWrapper from './ApiStatusButtonWrapper';
import { HoverCard, HoverCardContent } from '../ui/hover-card';
import ApiStatusButtonHoverContent from './ApiStatusButtonHoverContent';

export default function ApiStatusButtonParent() {
  return (
    <HoverCard openDelay={ 220 }>
      <ApiStatusButtonWrapper>
        <Link href="/api-status" prefetch={ true }>
          <ApiStatusButtonContent />
        </Link>
      </ApiStatusButtonWrapper>
      <HoverCardContent className="min-w-80" align="end">
        <ApiStatusButtonHoverContent />
      </HoverCardContent>
    </HoverCard>
  );
}
