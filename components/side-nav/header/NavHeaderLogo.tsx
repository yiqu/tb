import Image from 'next/image';

const LOGO_SIZE = 40;

export default function NavHeaderLogo() {
  return (
    <>
      <Image
        src="/images/boba.png"
        width={ LOGO_SIZE }
        height={ LOGO_SIZE }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="dark"
      />

      <Image
        src="/images/boba-dark.png"
        width={ LOGO_SIZE }
        height={ LOGO_SIZE }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="light"
      />
    </>
  );
}
