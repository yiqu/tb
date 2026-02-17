import Image from 'next/image';

export default function BackgroundTodoBoard({ children }: Readonly<{ children?: React.ReactNode }>) {
  // mask-[radial-gradient(ellipse_W%_H%_at_center,black_START%,transparent_END%)]
  // W/H = ellipse size (smaller = more fade)
  // START = where fade begins (lower = earlier fade)
  // END = where fully transparent (lower = sharper cutoff)
  return (
    <div className="
      relative mx-auto aspect-3/2 h-[90vh] scale-105 mask-[radial-gradient(ellipse_75%_75%_at_center,black_60%,transparent_95%)]
    ">
      <Image src="/images/todoboard2.png" alt="Background Todo Board" fill className="object-contain" />
      { /* inset: top=20% (below column headers), left/right=14% (inside wooden frame), bottom=10% */ }
      <div className="absolute top-[33%] right-[14%] bottom-[10%] left-[18%] flex">{ children }</div>
    </div>
  );
}
