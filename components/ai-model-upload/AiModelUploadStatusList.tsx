import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';

import AiModelUploadStatusRow from './AiModelUploadStatusRow';

import type { AiModelUploadItem } from './ai-model-upload.models';

interface AiModelUploadStatusListProps {
  uploads: AiModelUploadItem[];
  className?: string;
}

/** One progress row per file. Display only, pass it whichever uploads should be shown. */
export default function AiModelUploadStatusList({ uploads, className }: AiModelUploadStatusListProps) {
  return (
    <ColumnStack className={ cn('w-full gap-y-3', className) }>
      { uploads.map((upload: AiModelUploadItem) => (
        <AiModelUploadStatusRow key={ upload.id } upload={ upload } />
      )) }
    </ColumnStack>
  );
}
