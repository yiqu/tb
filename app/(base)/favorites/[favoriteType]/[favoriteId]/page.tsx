export default async function FavoriteDetailsPage({
  params,
}: {
  params: Promise<{ favoriteType: string; favoriteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const paramsData = await params;
  const { favoriteType, favoriteId } = paramsData;
  return (
    <h1>
      Fav Details Page: { favoriteType } { favoriteId }
    </h1>
  );
}
