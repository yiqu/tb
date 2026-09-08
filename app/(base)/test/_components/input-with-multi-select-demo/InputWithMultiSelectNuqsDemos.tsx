import { SendHorizontal } from 'lucide-react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import InputWithMultiSelectNuqsDemo from './InputWithMultiSelectNuqsDemo';
import { ID_SEARCH_OPTIONS } from './input-with-multi-select-demo.constants';
import InputWithMultiSelectQueryParamsDisplay from './InputWithMultiSelectQueryParamsDisplay';

/**
 * The nuqs test cases: same component, four different sets of nuqs options, all writing to the
 * query param of whichever id kind is selected.
 */
export default function InputWithMultiSelectNuqsDemos() {
  return (
    <ColumnStack className="w-full gap-y-3">
      <Typography variant="h5">InputWithMultiSelectNuqs — URL query params</Typography>
      <Typography variant="caption1">
        Pick an id kind, type a value, then hit Enter (or click the icon). The query param written is the selected option&apos;s
        <Typography variant="code1" as="span"> queryParam</Typography>.
      </Typography>

      <InputWithMultiSelectQueryParamsDisplay options={ ID_SEARCH_OPTIONS } />

      <InputWithMultiSelectNuqsDemo
        title="1. Defaults"
        description="No nuqs options passed: replace history, shallow (client only), other id params cleared on submit."
        options={ ID_SEARCH_OPTIONS }
      />

      <InputWithMultiSelectNuqsDemo
        title="2. history: 'push' + scroll: false"
        description="Every submit adds a history entry — the browser back button walks through past searches."
        options={ ID_SEARCH_OPTIONS }
        defaultSelectedOptionId="requestId"
        nuqsOptions={ { history: 'push', scroll: false } }
        placeholder="Request id, then Enter (back button works)..."
      />

      <InputWithMultiSelectNuqsDemo
        title="3. shallow: false"
        description="Submitting notifies the server too, so React Server Components above re-render with the new search params."
        options={ ID_SEARCH_OPTIONS }
        defaultSelectedOptionId="triId"
        nuqsOptions={ { shallow: false, history: 'replace' } }
        placeholder="Tri id, then Enter (server round trip)..."
        triggerIcon={ <SendHorizontal className="size-4" /> }
      />

      <InputWithMultiSelectNuqsDemo
        title="4. throttleMs: 1000 + params kept"
        description="URL updates are throttled to once per second, and clearOtherQueryParams is off so several id params can live in the URL at the same time."
        options={ ID_SEARCH_OPTIONS }
        nuqsOptions={ { throttleMs: 1000, history: 'replace', scroll: false } }
        clearOtherQueryParams={ false }
        placeholder="Submit several id kinds in a row..."
        selectClassName="bg-amber-500/10 dark:bg-amber-500/10"
        triggerClassName="text-amber-600 dark:text-amber-400"
      />

      <InputWithMultiSelectNuqsDemo
        title="5. Live: updates on selection change and while typing"
        description="No Enter needed. Switching the id kind moves the search onto the new param, and every keystroke writes to the URL — throttled to one write per 500ms by nuqs."
        options={ ID_SEARCH_OPTIONS }
        nuqsOptions={ { throttleMs: 500, history: 'replace', scroll: false } }
        updateQueryOnSelectionChange
        updateQueryOnInputChange
        placeholder="Start typing — the URL follows along..."
      />
    </ColumnStack>
  );
}
