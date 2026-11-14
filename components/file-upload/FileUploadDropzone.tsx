'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import { FilePond } from 'react-filepond';

import { cn } from '@/lib/utils';

import type { FilePondFile } from 'filepond';

import 'filepond/dist/filepond.min.css';
import './file-upload.css';
import { FILE_UPLOAD_REMOVE_ICON_SVG } from './file-upload.constants';
import { isFileExtensionAllowed, normalizeFileExtension } from './file-upload.utils';

interface FileUploadDropzoneProps {
  /**
   * The staged files, kept by the caller so the selection can outlive this component (e.g. a dialog
   * closing). They are handed to FilePond when it mounts, after that FilePond owns the list and
   * reports every change through `onFilesChange`. Emptying it from outside clears the drop zone.
   */
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pondRef = useRef<FilePond>(null);
  // FilePond calls back outside of React's render cycle, the callbacks read the current props through this ref
  const latestRef = useRef({ files, onFilesChange, allowedExtensions, onFileRejected });
  useLayoutEffect(() => {
    latestRef.current = { files, onFilesChange, allowedExtensions, onFileRejected };
  });

  /** FilePond has no core option for it, so the `accept` attribute of its browse input is set by hand. */
  const syncAcceptAttribute = () => {
    const browseInput: HTMLInputElement | null | undefined = wrapperRef.current?.querySelector<HTMLInputElement>('input.filepond--browser');
    const extensions: string[] = (latestRef.current.allowedExtensions ?? []).map(normalizeFileExtension).filter(Boolean);
    if (!browseInput) {
      return;
    }
    if (extensions.length > 0) {
      browseInput.setAttribute('accept', extensions.join(','));
    } else {
      browseInput.removeAttribute('accept');
    }
  };

  /** Reports the selection once a file finished loading or was removed, read straight from FilePond. */
  const reportFiles = () => {
    const current: File[] = latestRef.current.files;
    const nextFiles: File[] = (pondRef.current?.getFiles() ?? [])
      .filter((item: FilePondFile) => isFileExtensionAllowed(item.filename, latestRef.current.allowedExtensions))
      .map((item: FilePondFile) => item.file)
      .filter((file): file is File => file instanceof File);
    const isSameSelection: boolean = nextFiles.length === current.length && nextFiles.every((file: File, index: number) => file === current[index]);
    if (!isSameSelection) {
      latestRef.current.onFilesChange(nextFiles);
    }
    // FilePond replaces its browse input after a selection
    syncAcceptAttribute();
  };

  const handleOnInit = () => {
    syncAcceptAttribute();
    // restore the selection that was staged before this component was last unmounted
    if (latestRef.current.files.length > 0) {
      pondRef.current?.addFiles(latestRef.current.files);
    }
  };

  useEffect(() => {
    // the caller emptied the selection (e.g. the upload started): clear what FilePond still shows
    if (files.length === 0 && (pondRef.current?.getFiles().length ?? 0) > 0) {
      pondRef.current?.removeFiles();
    }
  }, [files]);

  const handleBeforeAddFile = (item: FilePondFile): boolean => {
    const isAllowed: boolean = isFileExtensionAllowed(item.filename, latestRef.current.allowedExtensions);
    if (!isAllowed) {
      latestRef.current.onFileRejected?.(item.filename);
    }
    return isAllowed;
  };

  return (
    <div ref={ wrapperRef } className={ cn('file-upload-dropzone h-56 w-full', className) }>
    <FilePond
      ref={ pondRef }
      oninit={ handleOnInit }
      onaddfile={ reportFiles }
      onremovefile={ reportFiles }
      beforeAddFile={ handleBeforeAddFile }
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
    </div>
  );
}
