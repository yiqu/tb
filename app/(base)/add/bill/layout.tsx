export default function AddNewEntityBillLayout({ children }: LayoutProps<'/add/bill'>) {
  return (
    <div id="add-new-entity-bill-layout-parent" className="flex w-full flex-col items-start justify-start">
      { children }
    </div>
  );
}
