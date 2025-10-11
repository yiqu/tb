interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PlaygroundPage({}: PlaygroundPageProps) {
  return <div className="flex w-full flex-col items-start justify-start gap-y-3"></div>;
}
