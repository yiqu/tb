import { Breadcrumb, BreadcrumbList } from '../ui/breadcrumb';

export default function BreadcrumbsList({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>{ children }</BreadcrumbList>
    </Breadcrumb>
  );
}
