import Image from 'next/image';

const LOGO_SIZE = 40;

interface Props {
  imageUrlLight?: string;
  imageUrlDark?: string;
  size?: number;
}

export default function NavHeaderLogo({
  imageUrlLight = '/images/leaf.png',
  imageUrlDark = '/images/leafnight.png',
  size = LOGO_SIZE,
}: Props) {
  return (
    <>
      <Image src={ imageUrlLight } width={ size } height={ size } alt="logo" className="shrink-0" data-hide-on-theme="dark" priority />

      <Image src={ imageUrlDark } width={ size } height={ size } alt="logo" className="shrink-0" data-hide-on-theme="light" priority />
    </>
  );
}
