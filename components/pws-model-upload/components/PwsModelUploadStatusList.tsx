import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';

import PwsModelUploadStatusRow from './PwsModelUploadStatusRow';

import type { PwsModelUploadItem } from '../models/pws-model-upload.models';

interface PwsModelUploadStatusListProps {
  uploads: PwsModelUploadItem[];
  className?: string;
}

/** One progress row per file. Display only, pass it whichever uploads should be shown. */
export default function PwsModelUploadStatusList({ uploads, className }: PwsModelUploadStatusListProps) {
  return (
    <ColumnStack className={ cn('w-full gap-y-3', className) }>
      { uploads.map((upload: PwsModelUploadItem) => {
        return <PwsModelUploadStatusRow key={ upload.id } upload={ upload } />;
      }) }
    </ColumnStack>
  );
}
