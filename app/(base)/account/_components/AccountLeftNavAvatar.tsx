/* eslint-disable readable-tailwind/multiline */
import Typography from '@/components/typography/Typography';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { getAvatarNameById, getAvatarImgUrlById } from '@/lib/utils';
import { getSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';
import TiltedCard from '@/components/reactbits/Components/TiltedCard/TiltedCard';

export default async function AccountLeftNavAvatar() {
  const avatarId: string = await getSettingsUpdateAvatarImage();
  const avatarImgUrl: string = getAvatarImgUrlById(avatarId);

  return (
    <TiltedCard
      imageSrc={ avatarImgUrl }
      altText="Avatar"
      captionText="Avatar"
      containerHeight="190px"
      containerWidth="190px"
      imageHeight="190px"
      imageWidth="190px"
      rotateAmplitude={ 28 }
      scaleOnHover={ 1.06 }
      showMobileWarning={ false }
      showTooltip={ false }
      displayOverlayContent={ true }
      overlayContent={ <OverLayContent avatarId={ avatarId } /> }
      imgClassName="-top-[20px] -left-[60px]"
    />
  );
}

function OverLayContent({ avatarId }: { avatarId: string }) {
  return (
    <SparklesText sparklesCount={ 5 }>
      <Typography
        className={ `logo-text-color m-[10px] rounded-2xl bg-accent px-[0.5rem] py-[0.5rem] font-cherry-bomb-one tracking-wider shadow-[0_5px_30px_#06060659] dark:shadow-[0_5px_30px_#ccc]` }
        variant="h5"
      >
        { getAvatarNameById(avatarId) }
      </Typography>
    </SparklesText>
  );
}
