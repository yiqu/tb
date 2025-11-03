import { ReactNode } from 'react';

export default function ContentPaginationBarStickyWrapper({ children }: { children: ReactNode }) {
  return <div className={ `sticky top-[100px] z-20 flex w-full flex-row items-center justify-between bg-background py-2` }>{ children }</div>;
}
