import Typography from '@/components/typography/Typography';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { getAvatarNameById, getAvatarImgUrlById } from '@/lib/utils';
import { getSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';
import TiltedCard from '@/components/reactbits/Components/TiltedCard/TiltedCard';
import ChromaCard from '@/components/reactbits/Animations/ChromaCard/chroma-card';

export default async function AccountLeftNavAvatar() {
  const avatarId: string = await getSettingsUpdateAvatarImage();
  const avatarImgUrl: string = getAvatarImgUrlById(avatarId);

  return (
    <ChromaCard
      width={ 190 }
      height={ 190 }
      imageSrc={ avatarImgUrl }
      imageAspectRatio={ 1 }
      zoomLevel={ 0.1 }
      rgbShiftAmount={ 0.03 }
      pixelDisplaceAmount={ 0.2 }
      hoverDuration={ 1.5 }
      rotationIntensity={ 0.05 }
      scaleIntensity={ 0.05 }
      positionIntensity={ 0.2 }
      interactionDuration={ 0.05 }
      cardWidth={ 8 }
      cardHeight={ 8 }
      cameraFov={ 45 }
      cameraZ={ 10 }
    />
  );

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
      overlayContentClassName="-top-[20px] -left-[60px]"
    />
  );
}

function OverLayContent({ avatarId }: { avatarId: string }) {
  return (
    <SparklesText sparklesCount={ 5 }>
      <Typography
        className={ `
          m-[10px] rounded-2xl bg-accent/50 px-2 py-2 font-fun tracking-wider shadow-[0_5px_30px_#06060659]
          dark:shadow-[0_5px_30px_#ccc]
        ` }
        variant="h5"
      >
        { getAvatarNameById(avatarId) }
      </Typography>
    </SparklesText>
  );
}
