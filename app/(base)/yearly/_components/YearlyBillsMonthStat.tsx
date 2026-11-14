import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

interface YearlyBillsMonthStatProps {
  label: string;
  value: string;
  subValue?: string;
}

export default function YearlyBillsMonthStat({ label, value, subValue }: YearlyBillsMonthStatProps) {
  return (
    <ColumnStack className="min-w-[150px] rounded-md border bg-card px-3 py-2">
      <Typography variant="label0">{ label }</Typography>
      <Typography variant="h5" className="tabular-nums">
        { value }
      </Typography>
      { subValue ? <Typography variant="caption1">{ subValue }</Typography> : null }
    </ColumnStack>
  );
}
