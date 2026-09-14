import { InputWithMultiSelectSelectOption } from '@/components/input-with-multi-select/input-with-multi-select.models';

/** The id kinds every demo on this page searches by. */
export const ID_SEARCH_OPTIONS: InputWithMultiSelectSelectOption[] = [
  { id: 'userId', queryParam: 'userId', display: 'User ID' },
  { id: 'requestId', queryParam: 'requestId', display: 'Request ID' },
  { id: 'triId', queryParam: 'triId', display: 'Tri ID' },
];
