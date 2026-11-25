import { getCookieByName } from '@/lib/cookies';
import PetAnimationZoo from '@/components/pet-animation-zoo/components/PetAnimationZoo';
import { parsePetZooHeight } from '@/components/pet-animation-zoo/utils/pet-zoo-height.utils';
import { PET_ZOO_HEIGHT_COOKIE_NAME } from '@/components/pet-animation-zoo/constants/pet-zoo.constants';

/**
 * The pet animation zoo above the account button at the bottom of the left nav. The height cookie is read
 * here, so the server renders the zoo at the height it was dragged to. Hidden while the nav is collapsed to icons.
 */
export default async function SidebarPetAnimationZoo() {
  const heightCookie = await getCookieByName(PET_ZOO_HEIGHT_COOKIE_NAME);

  return (
    <div className="group-data-[collapsible=icon]:hidden">
      <PetAnimationZoo initialHeight={ parsePetZooHeight(heightCookie?.value) } />
    </div>
  );
}
