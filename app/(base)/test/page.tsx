import NestedRequest from './_components/NestedRequest';
import ScreenSizeDisplay from './_components/ScreenSizeDisplay';

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PlaygroundPage({}: PlaygroundPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <NestedRequest />
    </div>
  );
}
