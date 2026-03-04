import NextLink from 'next/link';
import { ReactNode, ComponentProps } from 'react';

const USE_VIEW_TRANSITIONS = true;

interface AppLinkProps extends ComponentProps<typeof NextLink> {
  children: ReactNode;
}

function Link({ children, ...props }: AppLinkProps) {
  // if (USE_VIEW_TRANSITIONS) {
  //   return <NextViewTransitionLink { ...props }>{ children }</NextViewTransitionLink>;
  // }
  return <NextLink { ...props }>{ children }</NextLink>;
}

export default Link;
