export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <section className="flex h-full w-full flex-col">{ children }</section>;
}
