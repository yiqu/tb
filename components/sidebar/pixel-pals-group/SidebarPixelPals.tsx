import { getCookieByName } from '@/lib/cookies';
import PixelPals from '@/components/pixel-pals/components/PixelPals';
import { parsePixelPalsHeight } from '@/components/pixel-pals/utils/pixel-pals-height.utils';
import { PIXEL_PALS_HEIGHT_COOKIE_NAME } from '@/components/pixel-pals/constants/pixel-pals.constants';

/**
 * Pixel Pals, above the account button at the bottom of the left nav. The height cookie is read
 * here, so the server renders Pixel Pals at the height it was dragged to. Hidden while the nav is collapsed to icons.
 */
export default async function SidebarPixelPals() {
  const heightCookie = await getCookieByName(PIXEL_PALS_HEIGHT_COOKIE_NAME);

  return (
    <div className="group-data-[collapsible=icon]:hidden">
      <PixelPals initialHeight={ parsePixelPalsHeight(heightCookie?.value) } className="border-sidebar-border" />
    </div>
  );
}
