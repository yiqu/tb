import { appName } from '@/constants/constants';
import VerticalCutReveal from '@/fancy/components/text/vertical-cut-reveal';

import WelcomeTitleLastPart from './WelcomeTitleLastPart';

export default function WelcomeTitle() {
  return (
    <div className="mt-[5rem] flex flex-col items-center justify-start">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={ 0.1 }
        staggerFrom="first"
        transition={ {
          type: 'spring',
          stiffness: 200,
          damping: 21,
        } }
        wordLevelClassName="text-amber-700 font-fun tracking-wider text-[6rem] font-bold"
      >
        { appName }
      </VerticalCutReveal>
      <WelcomeTitleLastPart />
    </div>
  );
}
