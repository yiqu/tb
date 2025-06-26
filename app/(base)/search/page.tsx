
interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SearchPage({}: SearchPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
    </div>
  );
}
