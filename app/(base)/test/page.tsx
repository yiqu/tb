import MultiSortDemo from './_components/MultiSortDemo';
import NestedRequest from './_components/NestedRequest';
import AutoCompleteReadOnlyDemo from './_components/AutoCompleteReadOnlyDemo';
import AutoCompleteTextAreaDemo from './_components/AutoCompleteTextAreaDemo';
import AutoCompleteTextAreaDemo2 from './_components/AutoCompleteTextAreaDemo2';
import AutoCompleteTextAreaUncontrolledDemo from './_components/AutoCompleteTextAreaUncontrolledDemo';
import ColumnAdjustDemoTable from './_components/column-adjust-demo/ColumnAdjustDemoTable';

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PlaygroundPage({}: PlaygroundPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <ColumnAdjustDemoTable />
      <AutoCompleteReadOnlyDemo />
      <AutoCompleteTextAreaDemo />
      <AutoCompleteTextAreaDemo2 />
      <AutoCompleteTextAreaUncontrolledDemo />
      <MultiSortDemo />
      <NestedRequest />
    </div>
  );
}
