import NextTopLoader from 'nextjs-toploader';

export default function AppTopLoader() {
  return <NextTopLoader showSpinner={ false } color="var(--app-top-loader-color)" shadow={ false } height={ 3 } />;
}
