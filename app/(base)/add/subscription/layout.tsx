export const experimental_ppr = true;

export default function AddNewEntitySubscriptionLayout({ children }: LayoutProps<'/add/subscription'>) {
  return (
    <div id="add-new-entity-subscription-layout-parent" className="flex w-full flex-col items-start justify-start">
      { children }
    </div>
  );
}
