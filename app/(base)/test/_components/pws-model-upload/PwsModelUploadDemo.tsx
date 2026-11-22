import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import UploadModelButton from '@/components/pws-model-upload/components/UploadModelButton';

/** Demo of the drop-in PWS model upload feature, against the slow mock API in `app/api/pws-models/multipart-upload/`. */
export default function PwsModelUploadDemo() {
  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h4">PWS model upload</Typography>
      <Typography variant="caption1">
        Enter a name and a model key, select the model file, then upload it. The mock server is slow on purpose. Close the dialog and open it
        again to start another upload while the first is still running; every upload is listed under the bell in the top navigation.
      </Typography>
      <RowStack>
        <UploadModelButton />
      </RowStack>
    </ColumnStack>
  );
}
