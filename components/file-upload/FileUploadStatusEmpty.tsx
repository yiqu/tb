import Typography from '@/components/typography/Typography';

interface FileUploadStatusEmptyProps {
  message?: string;
}

/** Placeholder for an upload status list with nothing in it. */
export default function FileUploadStatusEmpty({ message = 'No uploads yet.' }: FileUploadStatusEmptyProps) {
  return <Typography variant="caption1">{ message }</Typography>;
}
