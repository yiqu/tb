import NotificationsSection from '@/components/notifications/NotificationsSection';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import PwsModelUploadStatusOverview from '@/components/pws-model-upload/components/PwsModelUploadStatusOverview';
import PwsModelUploadActiveIndicator from '@/components/pws-model-upload/components/PwsModelUploadActiveIndicator';
import PwsModelUploadClearFinishedButton from '@/components/pws-model-upload/components/PwsModelUploadClearFinishedButton';

export default function TopNavNotificationsButton() {
  return (
    <NotificationsPopover indicator={ <PwsModelUploadActiveIndicator /> }>
      <NotificationsSection title="Upload Status" action={ <PwsModelUploadClearFinishedButton /> }>
        <PwsModelUploadStatusOverview />
      </NotificationsSection>
    </NotificationsPopover>
  );
}
