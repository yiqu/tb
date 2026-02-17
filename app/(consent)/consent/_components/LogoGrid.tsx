'use client';

import toast from 'react-hot-toast';

import { GOOG_PALETTE } from '@/lib/color-palettes';
import { getRandomArbitrary } from '@/lib/number.utils';
import { AuroraText } from '@/components/magicui/aurora-text';
import DraggableGrid, { GridItem } from '@/components/reactbits/Components/DraggableGrid/draggable-grid';

export default function LogoGrid() {
  const onItemClick = (item: GridItem, _index: number) => {
    toast.remove();
    const randomNumberBetween1and10 = getRandomArbitrary(1, 10);
    toast(
      <AuroraText colors={ GOOG_PALETTE } className="font-fun text-3xl tracking-widest">
        { randomNumberBetween1and10 === item.id ? 'Yay!' : 'Rawr!!' }
      </AuroraText>,
    );
  };
  return (
    <DraggableGrid
      items={ items }
      columns={ 10 }
      enableDrag={ true }
      enableWheel={ true }
      edgeResistance={ 0.8 }
      introDuration={ 0.5 }
      scale={ 1.4 }
      gap={ 3 }
      wheelSmoothing={ 0.5 }
      initialOffset={ { x: 0, y: 0 } }
      onItemClick={ onItemClick }
    />
  );
}

const items: GridItem[] = [
  {
    id: 1,
    image: '/dinos/cartoon-dino-1.png',
    dataId: 'dino-1',
    alt: 'dino-1',
  },
  {
    id: 2,
    image: '/dinos/cartoon-dino-2.png',
    dataId: 'dino-2',
    alt: 'dino-2',
  },
  {
    id: 3,
    image: '/dinos/cartoon-dino-3.png',
    dataId: 'dino-3',
    alt: 'dino-3',
  },
  {
    id: 4,
    image: '/dinos/cartoon-dino-4.png',
    dataId: 'dino-4',
    alt: 'dino-4',
  },
  {
    id: 5,
    image: '/dinos/cartoon-dino-5.png',
    dataId: 'dino-5',
    alt: 'dino-5',
  },
  {
    id: 6,
    image: '/dinos/cartoon-dino-6.png',
    dataId: 'dino-6',
    alt: 'dino-6',
  },
  {
    id: 7,
    image: '/dinos/cartoon-dino-7.png',
    dataId: 'dino-7',
    alt: 'dino-7',
  },
  {
    id: 8,
    image: '/dinos/cartoon-dino-8.png',
    dataId: 'dino-8',
    alt: 'dino-8',
  },
  {
    id: 9,
    image: '/dinos/cartoon-dino-9.png',
    dataId: 'dino-9',
    alt: 'dino-9',
  },
  {
    id: 10,
    image: '/dinos/cartoon-dino-10.png',
    dataId: 'dino-10',
    alt: 'dino-10',
  },
  {
    id: 11,
    image: '/dinos/cartoon-dino-11.png',
    dataId: 'dino-11',
    alt: 'dino-11',
  },
  {
    id: 12,
    image: '/dinos/cartoon-dino-12.png',
    dataId: 'dino-12',
    alt: 'dino-12',
  },
  {
    id: 13,
    image: '/dinos/cartoon-dino-13.png',
    dataId: 'dino-13',
    alt: 'dino-13',
  },
  {
    id: 14,
    image: '/dinos/cartoon-dino-14.png',
    dataId: 'dino-14',
    alt: 'dino-14',
  },
  {
    id: 15,
    image: '/dinos/cartoon-dino-1.png',
    dataId: 'dino-15',
    alt: 'dino-1',
  },
  {
    id: 16,
    image: '/dinos/cartoon-dino-2.png',
    dataId: 'dino-16',
    alt: 'dino-2',
  },
  {
    id: 17,
    image: '/dinos/cartoon-dino-3.png',
    dataId: 'dino-17',
    alt: 'dino-3',
  },
  {
    id: 18,
    image: '/dinos/cartoon-dino-4.png',
    dataId: 'dino-18',
    alt: 'dino-4',
  },
  {
    id: 19,
    image: '/dinos/cartoon-dino-5.png',
    dataId: 'dino-19',
    alt: 'dino-5',
  },
  {
    id: 20,
    image: '/dinos/cartoon-dino-6.png',
    dataId: 'dino-20',
    alt: 'dino-6',
  },
  {
    id: 21,
    image: '/dinos/cartoon-dino-7.png',
    dataId: 'dino-21',
    alt: 'dino-7',
  },
  {
    id: 22,
    image: '/dinos/cartoon-dino-8.png',
    dataId: 'dino-22',
    alt: 'dino-8',
  },
  {
    id: 23,
    image: '/dinos/cartoon-dino-9.png',
    dataId: 'dino-23',
    alt: 'dino-9',
  },
  {
    id: 24,
    image: '/dinos/cartoon-dino-10.png',
    dataId: 'dino-24',
    alt: 'dino-10',
  },
  {
    id: 25,
    image: '/dinos/cartoon-dino-11.png',
    dataId: 'dino-25',
    alt: 'dino-11',
  },
  {
    id: 26,
    image: '/dinos/cartoon-dino-12.png',
    dataId: 'dino-26',
    alt: 'dino-12',
  },
  {
    id: 27,
    image: '/dinos/cartoon-dino-13.png',
    dataId: 'dino-27',
    alt: 'dino-13',
  },
  {
    id: 28,
    image: '/dinos/cartoon-dino-14.png',
    dataId: 'dino-28',
    alt: 'dino-14',
  },
];
