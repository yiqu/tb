import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import AiModelUploadDialog from './AiModelUploadDialog';
import { AI_MODEL_UPLOAD_SECTION_TITLE, AI_MODEL_UPLOAD_SECTION_DESCRIPTION } from './ai-model-upload.constants';

/** AI model upload: a dialog with a name, a model key and a FilePond drop zone, uploads keep running after it closes. */
export default function AiModelUpload() {
  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h4">{ AI_MODEL_UPLOAD_SECTION_TITLE }</Typography>
      <Typography variant="caption1">{ AI_MODEL_UPLOAD_SECTION_DESCRIPTION }</Typography>
      <AiModelUploadDialog />
    </ColumnStack>
  );
}
