import Image from 'next/image';

import WelcomeTitle from './WelcomeTitle';
import ProceedDashboard from './ProceedDashboard';

export default function WelcomeBackground() {
  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-between overflow-hidden">
      <div>
        <Image src="/hero/uni-front.png" alt="Welcome Background" fill className="object-cover" priority />
        <WelcomeTitle />
      </div>
      <ProceedDashboard />
    </div>
  );
}
