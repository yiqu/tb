import Typography from '@/components/typography/Typography';
import { FieldLabel } from '@/components/ui/field';

interface PixelPalsFieldLabelProps {
  htmlFor: string;
  label: string;
}

/** The label above a dialog field. */
export default function PixelPalsFieldLabel({ htmlFor, label }: PixelPalsFieldLabelProps) {
  return (
    <FieldLabel htmlFor={ htmlFor }>
      <Typography as="span" variant="span1" className="font-[inherit]">
        { label }
      </Typography>
    </FieldLabel>
  );
}
