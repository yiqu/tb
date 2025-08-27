import Image from 'next/image';

interface BillLogoProps {
  height?: number;
}

export default function BillLogo({ height = 100 }: BillLogoProps) {
  let logoLightUrl = 'bill';
  let logoDarkUrl = 'bill';

  return (
    <>
      <Image
        src={ `/images/${logoLightUrl}.png` }
        width={ height }
        height={ height }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="dark"
        priority
      />

      <Image
        src={ `/images/${logoDarkUrl}.png` }
        width={ height }
        height={ height }
        alt="logo"
        className="shrink-0"
        data-hide-on-theme="light"
        priority
      />
    </>
  );
}