import Searchbar from './_components/Searchbar';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({}: SearchPageProps) {
  return (
    <div className="flex w-full flex-col">
      <Searchbar />
    </div>
  );
}
