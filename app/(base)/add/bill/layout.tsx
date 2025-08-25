export const experimental_ppr = true;

export default function AddNewEntityDueBillLayout({ children }: LayoutProps<'/add/bill'>) {
  return (
    <div id="add-new-entity-due-bill-layout-parent" className="flex w-full flex-col items-start justify-start">
      { children }
    </div>
  );
}
