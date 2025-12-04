import Image from 'next/image';

import { getMonthIcon } from '@/lib/month-icons.utils';

export default function MonthIcon({ month, height = 200 }: { month: string; height?: number }) {
  const imgSrc: string = getMonthIcon(month);

  return <Image src={ imgSrc } width={ height } height={ height } alt="month" className="shrink-0" priority />;
}
