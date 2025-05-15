export const FIVE_HOURS_MILLISECONDS = 18000000; // 5 hours
export const FOUR_HOURS_MILLISECONDS = 14400000; // 4 hours
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number): number => {
  const minn = Math.ceil(min);
  const maxx = Math.floor(max);
  return Math.floor(Math.random() * (maxx - minn + 1)) + minn;
};

export function isNumeric(val: any): boolean {
  if (typeof val === 'number') {
    return true;
  }
  return !Number.isNaN(+val) && !Number.isNaN(Number.parseFloat(val + ''));
}

export function getLocaleNumber(num: any): string {
  return (+num).toLocaleString();
}

export const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' });

export const splitNumberByDot = (num: number): [number, string] => {
  const numString = (Math.round((num ?? 0) * 100) / 100).toString();
  const arr = numString.split('.');
  const integer = +arr[0];
  const decimal = arr[1] ? arr[1] : '00';

  return [integer, decimal];
};

export function isNumberDecimal(value: string | number): boolean {
  const valueToTest = `${value}`;
  return valueToTest.indexOf('.') == -1;
}

export const roundNumber = (num: number, decimalPlaces: number = 2) => {
  // round based on decimal places
  const numToUse = Math.pow(10, decimalPlaces);
  return Math.round((num + Number.EPSILON) * numToUse) / numToUse;
};

export const getRangeBetween = (start: number, end: number, step: number = 1) => {
  let startCount: number = start;
  let endCount: number = end;
  let output: number[] = [];
  if (typeof end === 'undefined') {
    endCount = start;
    startCount = 0;
  }
  for (let i = startCount; i < endCount; i += step) {
    output.push(i);
  }
  return output;
};

export const getUSDFormatter = (
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2,
): Intl.NumberFormat => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

export const getPercentFormatter = (
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2,
): Intl.NumberFormat => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  });
};

export function fillArray(count: number): number[] {
  if (count <= 0) {
    return []; // Handle invalid input
  }

  return Array.from({ length: count }, (_, i) => i + 1);
}
