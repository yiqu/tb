export default function BillDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ billId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <h1>My Page</h1>;
}
