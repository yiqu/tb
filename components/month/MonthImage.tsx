import Image from 'next/image';

import { getMonthImage } from '@/lib/month-icons.utils';

export default function MonthImage({ month, height = 200 }: { month: string; height?: number }) {
  const imgSrc: string = getMonthImage(month);

  return <Image src={ imgSrc } width={ height } height={ height } alt="month" className="shrink-0" priority />;
}
