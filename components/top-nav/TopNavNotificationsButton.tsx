import NotificationsSection from '@/components/notifications/NotificationsSection';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import FileUploadStatusOverview from '@/components/file-upload/FileUploadStatusOverview';
import FileUploadActiveIndicator from '@/components/file-upload/FileUploadActiveIndicator';
import FileUploadClearFinishedButton from '@/components/file-upload/FileUploadClearFinishedButton';

export default function TopNavNotificationsButton() {
  return (
    <NotificationsPopover indicator={ <FileUploadActiveIndicator /> }>
      <NotificationsSection title="Upload Status" action={ <FileUploadClearFinishedButton /> }>
        <FileUploadStatusOverview />
      </NotificationsSection>
    </NotificationsPopover>
  );
}
