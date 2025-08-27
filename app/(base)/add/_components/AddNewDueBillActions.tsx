import { Plus } from 'lucide-react';

import AddNewDueBillActionsAddSubButton from './AddNewDueBillActionsAddSubButton';

export default function AddNewDueBillActions() {
  return (
    <div className="flex w-full flex-row items-center justify-start">
      <AddNewDueBillActionsAddSubButton>
        <AddNewEntityActionsAddDueBillButtonContent />
      </AddNewDueBillActionsAddSubButton>
    </div>
  );
}

function AddNewEntityActionsAddDueBillButtonContent() {
  return (
    <>
      <Plus />
      Create Bill Due
    </>
  );
}
