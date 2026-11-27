import Typography from '@/components/typography/Typography';
import { FieldError } from '@/components/ui/field';

interface PixelPalsFormErrorProps {
  message: string;
}

/** An error for the whole form, not one field, shown above the dialog's buttons. */
export default function PixelPalsFormError({ message }: PixelPalsFormErrorProps) {
  return (
    <FieldError>
      <Typography as="span" variant="body1">
        { message }
      </Typography>
    </FieldError>
  );
}
