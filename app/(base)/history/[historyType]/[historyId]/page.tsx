export default async function HistoryDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ historyType: string; historyId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const paramsData = await params;
  const { historyType, historyId } = paramsData;
  return (
    <h1>
      History Details Page: { historyType } { historyId }
    </h1>
  );
}
