export const URL_ID_NAME_SEPARATOR = '__';
export const VERCEL_PROJECT_STATUS = 'https://vercel.com/api/v1';

export function getParamsAsObject(params: URLSearchParams): { [key: string]: string } {
  const currentParams: { [key: string]: string } = {};
  for (const [key, value] of params.entries()) {
    currentParams[key] = value;
  }
  return currentParams;
}

export function getIdNameFromIdAndNamePathCombo(url: string) {
  if (url && url.includes(URL_ID_NAME_SEPARATOR)) {
    const urlParts = url.split(URL_ID_NAME_SEPARATOR);
    const id: string = urlParts[0];
    const name: string = urlParts[1];
    return {
      id,
      name: name,
    };
  } else if (url && url.includes(' - ')) {
    const urlParts = url.split('-');
    const id: string = urlParts[1]?.trim() ?? '';
    const name: string = urlParts[0]?.trim() ?? '';
    return {
      id,
      name: name,
    };
  }
  return {
    id: url,
    name: url,
  };
}

export function getMockFullUrlFromRedirectUrl(redirectUrl: string) {
  return `https://kq${redirectUrl}`;
}
