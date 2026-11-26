import Typography from '@/components/typography/Typography';
import { FieldLabel } from '@/components/ui/field';

interface PixelPalsFieldLabelProps {
  /** The input it labels. A field without one (a slider) names itself with `id` and `aria-labelledby` instead. */
  htmlFor?: string;
  id?: string;
  label: string;
}

/** The label above a dialog field. */
export default function PixelPalsFieldLabel({ htmlFor, id, label }: PixelPalsFieldLabelProps) {
  return (
    <FieldLabel htmlFor={ htmlFor } id={ id }>
      <Typography as="span" variant="span1" className="font-[inherit]">
        { label }
      </Typography>
    </FieldLabel>
  );
}
