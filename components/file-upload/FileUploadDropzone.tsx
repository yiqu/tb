'use client';

import { FilePond } from 'react-filepond';

import { cn } from '@/lib/utils';

import type { FilePondFile } from 'filepond';

import 'filepond/dist/filepond.min.css';
import './file-upload.css';
import { FILE_UPLOAD_REMOVE_ICON_SVG } from './file-upload.constants';
import { isFileExtensionAllowed, normalizeFileExtension } from './file-upload.utils';

interface FileUploadDropzoneProps {
  /** The staged files. Controlled, so the selection can outlive this component (e.g. a dialog closing). */
  files: File[];
  onFilesChange: (files: File[]) => void;
  /** Extensions that may be selected, e.g. `['.txt']`. Leave empty to allow everything. */
  allowedExtensions?: readonly string[];
  /** Called for every file that was dropped or browsed but is not in `allowedExtensions`. */
  onFileRejected?: (fileName: string) => void;
  allowMultiple?: boolean;
  disabled?: boolean;
  /** HTML string, FilePond's `labelIdle`. */
  label?: string;
  /** Sizes the drop zone. Its height is a Tailwind class, pass another `h-*` to change it. */
  className?: string;
}

/**
 * The drop zone and the staging list, both rendered by FilePond: drag & drop or browse (multiple
 * files), then one row per selected file with its name, its size and a remove button.
 *
 * FilePond only stages here. `instantUpload` and `allowProcess` are off, uploading is started by
 * the caller (see `useFileUpload`).
 */
export default function FileUploadDropzone({
  files,
  onFilesChange,
  allowedExtensions,
  onFileRejected,
  allowMultiple = true,
  disabled = false,
  label,
  className,
}: FileUploadDropzoneProps) {
  const handleOnUpdateFiles = (items: FilePondFile[]) => {
    const nextFiles: File[] = items.map((item: FilePondFile) => item.file).filter((file): file is File => file instanceof File);
    const isSameSelection: boolean = nextFiles.length === files.length && nextFiles.every((file: File, index: number) => file === files[index]);
    if (!isSameSelection) {
      onFilesChange(nextFiles);
    }
  };

  const handleBeforeAddFile = (item: FilePondFile): boolean => {
    const isAllowed: boolean = isFileExtensionAllowed(item.filename, allowedExtensions);
    if (!isAllowed) {
      onFileRejected?.(item.filename);
    }
    return isAllowed;
  };

  return (
    <FilePond
      className={ cn('file-upload-dropzone h-56 w-full', className) }
      files={ files }
      onupdatefiles={ handleOnUpdateFiles }
      beforeAddFile={ handleBeforeAddFile }
      // sets the `accept` attribute of the browse input, so the file picker only offers these extensions
      acceptedFileTypes={ allowedExtensions?.map(normalizeFileExtension) }
      allowMultiple={ allowMultiple }
      disabled={ disabled }
      // staging only: nothing is sent until the caller starts the upload
      instantUpload={ false }
      allowProcess={ false }
      allowRevert={ false }
      allowReorder={ false }
      credits={ false }
      styleButtonRemoveItemPosition="right"
      iconRemove={ FILE_UPLOAD_REMOVE_ICON_SVG }
      { ...(label ? { labelIdle: label } : {}) }
    />
  );
}
