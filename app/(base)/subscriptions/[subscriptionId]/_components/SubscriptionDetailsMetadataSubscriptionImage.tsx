import startCase from 'lodash/startCase';

import Typography from '@/components/typography/Typography';
import { SparklesText } from '@/components/magicui/sparkles-text';
import TiltedCard from '@/components/reactbits/Components/TiltedCard/TiltedCard';
import { getSubscriptionLogoUrl, getSubscriptionDetailsTiltCardLogoSize } from '@/shared/table/table.utils';

const IMAGE_WIDTH = 250;

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
          imageHeight={ `${getSubscriptionDetailsTiltCardLogoSize(subscriptionName)}px` }
          imageWidth={ `${getSubscriptionDetailsTiltCardLogoSize(subscriptionName)}px` }
          rotateAmplitude={ 28 }
          scaleOnHover={ 1.06 }
          showMobileWarning={ false }
          showTooltip={ false }
          displayOverlayContent={ true }
          overlayContent={ <OverLayContent frequency={ frequency } /> }
          overlayContentClassName="-top-[20px] -left-[60px] select-none"
          imgClassName="object-contain"
        />
      </div>
      <div data-hide-on-theme="light">
        <TiltedCard
          imageSrc={ dark }
          altText="Avatar"
          captionText="Avatar"
          containerHeight={ `${IMAGE_WIDTH}px` }
          containerWidth={ `${IMAGE_WIDTH}px` }
          imageHeight={ `${getSubscriptionDetailsTiltCardLogoSize(subscriptionName)}px` }
          imageWidth={ `${getSubscriptionDetailsTiltCardLogoSize(subscriptionName)}px` }
          rotateAmplitude={ 28 }
          scaleOnHover={ 1.06 }
          showMobileWarning={ false }
          showTooltip={ false }
          displayOverlayContent={ true }
          overlayContent={ <OverLayContent frequency={ frequency } /> }
          overlayContentClassName="-top-[20px] -left-[60px] select-none"
          imgClassName="object-contain"
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
          logo-text-color font-fun m-[10px] rounded-2xl bg-accent px-2 py-2 tracking-wider shadow-[0_5px_30px_#06060659] select-none
          dark:shadow-[0_5px_30px_#ccc]
        ` }
        variant="h5"
      >
        { startCase(frequency) } sub.
      </Typography>
    </SparklesText>
  );
}
