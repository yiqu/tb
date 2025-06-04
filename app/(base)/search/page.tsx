import SearchTableActionBar from './_components/Searchbar';
import SearchTableParent from './_components/SearchTableParent';

interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({}: SearchPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <SearchTableActionBar />
      <SearchTableParent />
    </div>
  );
}
