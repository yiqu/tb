import NextTopLoader from 'nextjs-toploader';

export default function AppTopLoader() {
  return <NextTopLoader showSpinner={ false } color="var(--primary)" shadow={ false } height={ 2 } />;
}
