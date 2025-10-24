import { format } from 'date-fns';

export const EST_TIME_ZONE = 'America/New_York';
export const UTC_TIME_ZONE = 'Etc/UTC';
export const FULL_DATE_FORMAT_STRING = 'MM/dd/yy h:mm aa';
export const FULL_DATE_FORMAL_FORMAT_STRING = 'MM/DD/yyyy HH:mm ZZ';
export const FULL_DATE_TOOLTIP_FORMAT_STRING = 'MM/dd/yyyy h:mm aa O';
export const SHORT_DATE_FORMAT_STRING = 'MM/dd/yy';
export const DEFAULT_DATE_FORMAT_STRING = 'MM/dd/yyyy';
export const MOMENT_FULL_DATE_FORMAT_WITH_AM_PM_STRING = 'MM/DD/yyyy hh:mm:ss A';

export function scrollToElementById(id: string, timeout?: number, position?: ScrollLogicalPosition): void {
  let top = document.getElementById(id);
  if (top) {
    setTimeout(() => {
      top?.scrollIntoView({ block: (position as any) ?? 'end' });
      top = null;
    }, timeout ?? 0);
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

export function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.offsetHeight,
    left: 0,
    behavior: 'smooth',
  });
}

export function convertCommaDecimalNumberToNumber(num: string): number {
  if (num) {
    const stripped = num.trim();
    return Number.parseFloat(stripped.replace(/,/g, ''));
  }
  return Number.NaN;
}

export function insertIntoArrayAtIndex<T>(arr: T[], index: number, item: T): T[] {
  const arrCopy: T[] = JSON.parse(JSON.stringify(arr));
  arrCopy.splice(index, 0, item);
  return arrCopy;
}

export function capitalizeFirstLetter(str: string): string | undefined {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return undefined;
}

export function objectsEqual(o1: any, o2: any): boolean {
  return typeof o1 === 'object' && Object.keys(o1).length > 0 ?
      Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;
}

export function arraysEqual(a1: any[], a2: any[]): boolean {
  if (a1 && a2) {
    return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
  }
  return false;
}

export function removeEmptyFromObject(obj: any): any {
  if (!obj) {
    return {};
  }
  const result = JSON.parse(JSON.stringify(obj));
  for (const key of Object.keys(result)) {
    if (result[key] === null || result[key] === undefined) {
      delete result[key];
    }
  }
  return result;
}

export function isObjectEmpty(obj: any): boolean {
  if (obj) {
    const keys = Object.keys(obj);
    return keys.length === 0;
  }
  return false;
}

// Remove objects in an array if the object has the same value by key provided
export function deduplicateObjectArrayByKey<T>(arr: T[], key: string): T[] {
  if (arr && arr.length > 0) {
    const uniqueByValues: any[] = arr.map((res: T) => res[key as keyof T]);
    const filtered = arr.filter((res: T, index: number) => {
      return !uniqueByValues.includes(res[key as keyof T], index + 1);
    });
    return filtered;
  }
  return [];
}

// get month name by param
export function getMonthNameByParam(monthNumber: string): string {
  const currentMonthString = format(new Date(), 'M'); // 1, 2
  if (monthNumber && monthNumber.trim() !== '') {
    return MONTH_NAMES[Number.parseInt(monthNumber, 10) - 1];
  }
  return MONTH_NAMES[+currentMonthString - 1];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const delayFocusElement = (htmlRef: any, timer = 100) => {
  const timerId = setTimeout(() => {
    htmlRef && htmlRef?.current?.focus();
  }, timer);
  return timerId;
};

export const getMonthNumberToShortMonthName: { [key: string]: string } = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const YEAR_OPTIONS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', 'All'].reverse();

export const YEAR_OPTIONS_ONLY_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'].reverse();

export const YEAR_OPTIONS2 = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', 'all'].reverse();

export const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const MONTHS_REVERSE = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
export const MONTHS_TWO_CHAR = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
