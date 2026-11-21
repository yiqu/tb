import NotificationsSection from '@/components/notifications/NotificationsSection';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import AiModelUploadStatusOverview from '@/components/ai-model-upload/AiModelUploadStatusOverview';
import AiModelUploadActiveIndicator from '@/components/ai-model-upload/AiModelUploadActiveIndicator';
import AiModelUploadClearFinishedButton from '@/components/ai-model-upload/AiModelUploadClearFinishedButton';

export default function TopNavNotificationsButton() {
  return (
    <NotificationsPopover indicator={ <AiModelUploadActiveIndicator /> }>
      <NotificationsSection title="Upload Status" action={ <AiModelUploadClearFinishedButton /> }>
        <AiModelUploadStatusOverview />
      </NotificationsSection>
    </NotificationsPopover>
  );
}
