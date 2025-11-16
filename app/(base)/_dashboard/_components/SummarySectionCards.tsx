import TotalDueYearCard from './summary-cards/TotalDueYearCard';
import NextMonthDueCard from './summary-cards/NextMonthDueCard';
import TotalDueMonthCard from './summary-cards/TotalDueMonthCard';
import PreviousMonthDueCard from './summary-cards/PreviousMonthDueCard';

export default function SummarySectionCards() {
  return (
    <div
      className={ `
        grid w-full grid-cols-2 gap-4
        *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs
        sec:grid-cols-2
        two:grid-cols-4
        dark:*:data-[slot=card]:bg-card
      ` }
    >
      <TotalDueMonthCard />
      <NextMonthDueCard />
      <PreviousMonthDueCard />
      <TotalDueYearCard />
    </div>
  );
}
