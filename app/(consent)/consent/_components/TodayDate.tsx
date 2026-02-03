import BlurText from '@/components/reactbits/TextAnimations/BlurText/BlurText';

export default function TodayDate({ dateString }: { dateString: string }) {
  return <BlurText text={ dateString } delay={ 100 } animateBy="letters" direction="top" className="text-sm" stepDuration={ 0.3 } />;
}
