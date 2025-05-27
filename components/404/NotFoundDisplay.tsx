import Typography from '@/components/typography/Typography';
import CenterUnderline from '@/fancy/components/text/underline-center';
import PageNotFoundCard from '@/components/status-cards/PageNotFoundCard';

export default function NotFoundDisplay() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <PageNotFoundCard blendBg={ true } blendTextAreaBorder={ true }>
        <div className="flex h-full w-full flex-col items-center justify-between">
          <Typography variant="body1" className="text-center">
            404: The page you are looking for does not exist.
          </Typography>
          <Typography variant="body1" className="text-center">
            <a href="/">
              <CenterUnderline label="Take me back home." />
            </a>
          </Typography>
        </div>
      </PageNotFoundCard>
    </div>
  );
}
