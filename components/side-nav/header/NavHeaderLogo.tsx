import Image from 'next/image';

const LOGO_SIZE = 40;

export default function NavHeaderLogo({ size = LOGO_SIZE }: { size?: number }) {
  return (
    <>
      <Image
        src="/images/leaf.png"
        width={ size }
        height={ size }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="dark"
        priority
      />

      <Image
        src="/images/leafnight.png"
        width={ size }
        height={ size }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="light"
        priority
      />
    </>
  );
}
