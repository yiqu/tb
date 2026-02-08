import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';

export default function TopContent() {
  return (
    <RowStack className="w-full py-3">
      <Button variant="outline">Refresh</Button>
      <Button variant="outline">Run</Button>
      <Button variant="outline">Stop</Button>
    </RowStack>
  );
}
