import startCase from 'lodash/startCase';

import Typography from '@/components/typography/Typography';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { getSubscriptionLogoUrl } from '@/shared/table/table.utils';
import TiltedCard from '@/components/reactbits/Components/TiltedCard/TiltedCard';

const IMAGE_WIDTH = 180;

export default function SubscriptionDetailsMetadataSubscriptionImage({
  subscriptionName,
  frequency,
}: {
  subscriptionName: string;
  frequency: string;
}) {
  const { light, dark } = getSubscriptionLogoUrl(subscriptionName);

  return (
    <>
      <div data-hide-on-theme="dark">
        <TiltedCard
          imageSrc={ light }
          altText="Avatar"
          captionText="Avatar"
          containerHeight={ `${IMAGE_WIDTH}px` }
          containerWidth={ `${IMAGE_WIDTH}px` }
          imageHeight={ `${IMAGE_WIDTH}px` }
          imageWidth={ `${IMAGE_WIDTH}px` }
          rotateAmplitude={ 28 }
          scaleOnHover={ 1.06 }
          showMobileWarning={ false }
          showTooltip={ false }
          displayOverlayContent={ true }
          overlayContent={ <OverLayContent frequency={ frequency } /> }
          imgClassName="-top-[20px] -left-[60px] select-none"
        />
      </div>
      <div data-hide-on-theme="light">
        <TiltedCard
          imageSrc={ dark }
          altText="Avatar"
          captionText="Avatar"
          containerHeight={ `${IMAGE_WIDTH}px` }
          containerWidth={ `${IMAGE_WIDTH}px` }
          imageHeight={ `${IMAGE_WIDTH}px` }
          imageWidth={ `${IMAGE_WIDTH}px` }
          rotateAmplitude={ 28 }
          scaleOnHover={ 1.06 }
          showMobileWarning={ false }
          showTooltip={ false }
          displayOverlayContent={ true }
          overlayContent={ <OverLayContent frequency={ frequency } /> }
          imgClassName="-top-[20px] -left-[60px] select-none"
        />
      </div>
    </>
  );
}

function OverLayContent({ frequency }: { frequency: string }) {
  return (
    <SparklesText sparklesCount={ 5 } className="select-none">
      <Typography
        className={ `
          logo-text-color m-[10px] rounded-2xl bg-accent px-[0.5rem] py-[0.5rem] font-fun tracking-wider shadow-[0_5px_30px_#06060659]
          select-none
          dark:shadow-[0_5px_30px_#ccc]
        ` }
        variant="h5"
      >
        { startCase(frequency) } sub.
      </Typography>
    </SparklesText>
  );
}
