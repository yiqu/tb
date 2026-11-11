import { create } from 'zustand';

/** Keeps the package name typed in the dialog while it is closed, the same way the staged files are kept. */
interface FileUploadDemoState {
  draftPackageName: string;
  setDraftPackageName: (packageName: string) => void;
}

export const useFileUploadDemoStore = create<FileUploadDemoState>()((set) => ({
  draftPackageName: '',
  setDraftPackageName: (packageName: string) => set({ draftPackageName: packageName }),
}));
