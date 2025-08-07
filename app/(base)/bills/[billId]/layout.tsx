export default function BillDetailsLayout({ children }: { children: React.ReactNode; params: Promise<{ billId: string }> }) {
  return (
    <div id="bill-details-layout-parent">
      <div>Nav Bar</div>
      { children }
    </div>
  );
}
