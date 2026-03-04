type Props = {
  paramsPromise: Promise<{ billId: string }>;
};

export default async function BillDetailsParent({ paramsPromise }: Props) {
  const params = await paramsPromise;
  const { billId } = params;

  return <div>Bill Details Parent: { billId }</div>;
}
