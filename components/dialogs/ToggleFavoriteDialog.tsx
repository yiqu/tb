/* eslint-disable no-unused-vars */
import { ReactNode } from 'react';

import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';
import {
  FavoriteActionType,
  getFavoriteActionLabel,
  FavoriteEntityEntityTypeType,
  getFavoriteEntityEntityTypeLabel,
} from '@/models/favorites/favorite.model';

import { Dialog } from '../ui/dialog';
import Typography from '../typography/Typography';

interface ToggleFavoriteDialogProps {
  isOpen: boolean;
  handleOnOpenEditDialog: (open: boolean) => void;
  children: ReactNode;
  type: FavoriteEntityEntityTypeType;
  action: FavoriteActionType;
}

export default function ToggleFavoriteDialog({ isOpen, handleOnOpenEditDialog, children, type, action }: ToggleFavoriteDialogProps) {
  return (
    <Dialog open={ isOpen } onOpenChange={ handleOnOpenEditDialog }>
      <StyledDialogContent
        headerTitle={ getFavoriteActionLabel(action, false, true) }
        headerDescription={
          <div className="flex w-full flex-row items-center justify-between gap-x-1">
            <div className="flex flex-row items-center justify-start gap-x-1">
              <Typography>{ getFavoriteActionLabel(action, false, true) }</Typography>
              <Typography>{ getFavoriteEntityEntityTypeLabel(type) }.</Typography>
            </div>
          </div>
        }
      >
        { children }
      </StyledDialogContent>
    </Dialog>
  );
}
