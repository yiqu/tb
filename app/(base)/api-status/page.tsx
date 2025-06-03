interface ApiStatusPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApiStatusPage({}: ApiStatusPageProps) {
  return <div className="flex w-full flex-col"></div>;
}
