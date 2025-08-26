import AddNewEntityActionsAddSubButton from './AddNewEntityActionsAddSubButton';
import AddNewEntityActionsAddSubButtonContent from './AddNewEntityActionsAddSubButtonContent';

export default function AddNewEntityActions() {
  return (
    <div className="flex w-full flex-col">
      <AddNewEntityActionsAddSubButton>
        <AddNewEntityActionsAddSubButtonContent />
      </AddNewEntityActionsAddSubButton>
    </div>
  );
}
