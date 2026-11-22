import NotificationsSection from '@/components/notifications/NotificationsSection';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';
import AiModelUploadStatusOverview from '@/components/ai-model-upload/components/AiModelUploadStatusOverview';
import AiModelUploadActiveIndicator from '@/components/ai-model-upload/components/AiModelUploadActiveIndicator';
import AiModelUploadClearFinishedButton from '@/components/ai-model-upload/components/AiModelUploadClearFinishedButton';

export default function TopNavNotificationsButton() {
  return (
    <NotificationsPopover indicator={ <AiModelUploadActiveIndicator /> }>
      <NotificationsSection title="Upload Status" action={ <AiModelUploadClearFinishedButton /> }>
        <AiModelUploadStatusOverview />
      </NotificationsSection>
    </NotificationsPopover>
  );
}
