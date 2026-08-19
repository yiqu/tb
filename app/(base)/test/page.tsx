import MultiSortDemo from './_components/MultiSortDemo';
import NestedRequest from './_components/NestedRequest';
import AutoCompleteTextAreaDemo from './_components/AutoCompleteTextAreaDemo';
import AutoCompleteTextAreaUncontrolledDemo from './_components/AutoCompleteTextAreaUncontrolledDemo';

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PlaygroundPage({}: PlaygroundPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <AutoCompleteTextAreaDemo />
      <AutoCompleteTextAreaUncontrolledDemo />
      <MultiSortDemo />
      <NestedRequest />
    </div>
  );
}
