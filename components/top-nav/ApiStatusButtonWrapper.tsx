'use client';

import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getUserFirebaseQueryOptions } from '@/server/user/query/users';

import { Button } from '../ui/button';
import { HoverCardTrigger } from '../ui/hover-card';

export default function ApiStatusButtonWrapper({ children }: { children: ReactNode }) {
  //const queryClient = useQueryClient();
  const { isFetching } = useQuery({
    ...getUserFirebaseQueryOptions(),
  });

  const handleOnMouseOver = () => {
    if (!isFetching) {
      // queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_QUERY_KEY_FIREBASE_USER] });
    }
  };

  return (
    <HoverCardTrigger asChild>
      <Button variant="outline" size="icon" asChild onMouseOver={ handleOnMouseOver }>
        { children }
      </Button>
    </HoverCardTrigger>
  );
}
