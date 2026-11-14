import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import FileUploadDemoDialog from './FileUploadDemoDialog';
import { FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS } from './file-upload-demo.constants';

/** File upload example: a dialog with a FilePond drop zone, uploads that keep running after it closes. */
export default function FileUploadDemo() {
  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h4">File upload</Typography>
      <Typography variant="caption1">
        Select one or more { FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS.length > 0 ? `${FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS.join(', ')} ` : '' }files, then upload them. The mock server is slow on purpose.
        Closing the dialog does not cancel anything, the progress stays visible under the bell in the top navigation.
      </Typography>
      <FileUploadDemoDialog />
    </ColumnStack>
  );
}
