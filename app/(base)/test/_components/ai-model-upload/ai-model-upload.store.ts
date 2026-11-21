import { create } from 'zustand';

import type { AiModelUploadFormValues } from '@/validators/ai-model-upload/ai-model-upload.schema';

/** Keeps what was typed in the dialog while it is closed, the same way the staged files are kept. */
interface AiModelUploadState {
  draft: AiModelUploadFormValues;
  setDraft: (draft: AiModelUploadFormValues) => void;
}

export const AI_MODEL_UPLOAD_EMPTY_DRAFT: AiModelUploadFormValues = { name: '', modelKey: '' };

export const useAiModelUploadStore = create<AiModelUploadState>()((set) => ({
  draft: AI_MODEL_UPLOAD_EMPTY_DRAFT,
  setDraft: (draft: AiModelUploadFormValues) => set({ draft: draft }),
}));
