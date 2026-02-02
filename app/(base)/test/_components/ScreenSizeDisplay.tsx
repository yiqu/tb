import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

export default function ScreenSizeDisplay() {
  return (
    <ColumnStack>
      <div>
        <Typography variant="body1">Screen Size Display</Typography>
      </div>
      <Typography className="
        hidden
        xxl:block
      ">XXL: size</Typography>
      <Typography className="
        hidden
        xl:block
      ">XL: size</Typography>
      <Typography className="
        hidden
        lg:block
      ">LG: size</Typography>
      <Typography className="
        hidden
        md:block
      ">MD: size</Typography>
      <Typography className="
        hidden
        sm:block
      ">SM: size</Typography>
      <Typography className="
        hidden
        xs:block
      ">XS: size</Typography>
      <Typography className="
        hidden
        xxs:block
      ">XXS: size</Typography>
    </ColumnStack>
  );
}
