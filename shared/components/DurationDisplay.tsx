import useDuration from '@/hooks/useDuration';
import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DurationDisplay({ updatedAt }: { updatedAt: string | Date | null | undefined }) {
  const isClient = useIsClient();
  const { duration } = useDuration(new Date(updatedAt ?? 0).getTime());

  if (!isClient) {
    return <Skeleton className="h-6 w-40" />;
  }

  if (updatedAt) {
    return (
      <Typography variant="body1" title={ updatedAt.toString() }>
        Last updated: { duration } ago
      </Typography>
    );
  }

  return null;
}
