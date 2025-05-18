interface SearchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  return <div className="flex w-full flex-col"></div>;
}
