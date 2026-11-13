'use client';

import { useRef, useState, useEffect } from 'react';

import { useFileUploads } from './file-upload.store';
import { isFileUploadActive, getFileUploadSummary, formatFileUploadSummary } from './file-upload.utils';

import type { FileUploadItem } from './file-upload.models';

interface FileUploadDocumentTitleProps {
  /** How long the finished state, e.g. `100% (3/3)`, stays in the title before it is restored. */
  lingerMs?: number;
  /** Placed between the progress and the page's own title. */
  separator?: string;
}

/**
 * Shows the upload progress in the browser tab while files are uploading, in front of the page's
 * own title: `45% (1/3) | Playground`. The percentage is the average over the files and the
 * parentheses hold completed/total. Renders nothing, mount it once anywhere that stays mounted.
 *
 * The files counted are the ones of every batch that was uploading during the current run, so a
 * second batch started while the first is still going joins the same count.
 */
export default function FileUploadDocumentTitle({ lingerMs = 5000, separator = ' | ' }: FileUploadDocumentTitleProps) {
  const uploads = useFileUploads();
  const trackedBatchIdsRef = useRef<Set<string>>(new Set<string>());
  const [progressLabel, setProgressLabel] = useState<string | null>(null);

  useEffect(() => {
    const trackedBatchIds: Set<string> = trackedBatchIdsRef.current;
    const activeUploads: FileUploadItem[] = uploads.filter(isFileUploadActive);
    activeUploads.forEach((upload: FileUploadItem) => trackedBatchIds.add(upload.batchId));

    const trackedUploads: FileUploadItem[] = uploads.filter((upload: FileUploadItem) => trackedBatchIds.has(upload.batchId));
    if (trackedUploads.length === 0) {
      trackedBatchIds.clear();
      setProgressLabel(null);
      return;
    }

    setProgressLabel(formatFileUploadSummary(getFileUploadSummary(trackedUploads)));
    if (activeUploads.length > 0) {
      return;
    }

    // the run is over: leave the final state in the tab for a moment, then give the title back
    const timeoutId = setTimeout(() => {
      trackedBatchIds.clear();
      setProgressLabel(null);
    }, lingerMs);
    return () => clearTimeout(timeoutId);
  }, [uploads, lingerMs]);

  useEffect(() => {
    if (progressLabel === null) {
      return;
    }
    const prefix: string = `${progressLabel}${separator}`;
    let pageTitle: string = document.title;

    const applyTitle = () => {
      // the page changed its own title (e.g. a navigation): remember it and put the progress back in front
      if (!document.title.startsWith(prefix)) {
        // browsers trim the title, so a page with no title of its own reads back as the bare progress
        pageTitle = document.title === prefix.trimEnd() || document.title === progressLabel ? '' : document.title;
      }
      const nextTitle: string = pageTitle === '' ? progressLabel : `${prefix}${pageTitle}`;
      if (document.title !== nextTitle) {
        document.title = nextTitle;
      }
    };

    applyTitle();
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      document.title = pageTitle;
    };
  }, [progressLabel, separator]);

  return null;
}
