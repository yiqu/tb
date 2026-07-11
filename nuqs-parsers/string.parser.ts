import { createParser } from 'nuqs';

export const parseAsTrimmedString = createParser({
  parse(queryValue) {
    const trimmed = queryValue.trim();
    return trimmed === '' ? null : trimmed;
  },
  serialize(value) {
    return value.trim();
  },
});

