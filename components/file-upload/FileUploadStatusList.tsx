import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';

import FileUploadStatusRow from './FileUploadStatusRow';

import type { FileUploadItem } from './file-upload.models';

interface FileUploadStatusListProps {
  uploads: FileUploadItem[];
  className?: string;
}

/** One progress row per file. Display only, pass it whichever uploads should be shown. */
export default function FileUploadStatusList({ uploads, className }: FileUploadStatusListProps) {
  return (
    <ColumnStack className={ cn('w-full gap-y-3', className) }>
      { uploads.map((upload: FileUploadItem) => (
        <FileUploadStatusRow key={ upload.id } upload={ upload } />
      )) }
    </ColumnStack>
  );
}
