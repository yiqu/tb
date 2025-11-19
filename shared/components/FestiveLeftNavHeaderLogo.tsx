import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import NavHeaderLogo from '@/components/side-nav/header/NavHeaderLogo';

export default function FestiveLeftNavHeaderLogo() {
  const [imageUrlLight, imageUrlDark] = getFestiveLogo();
  return <NavHeaderLogo imageUrlLight={ imageUrlLight } imageUrlDark={ imageUrlDark } />;
}

function getFestiveLogo(): [string, string] {
  const currentDateLuxon: DateTime = DateTime.now().setZone(EST_TIME_ZONE);
  const currenMonth = currentDateLuxon.month;
  const currentDay = currentDateLuxon.day;

  let imageUrlLight = '/images/leaf.png';
  let imageUrlDark = '/images/leafnight.png';

  if (currenMonth === 11) {
    if (currentDay >= 1 && currentDay <= 25) {
      imageUrlLight = '/header-logo/falltree.png';
      imageUrlDark = '/header-logo/falltree.png';
    } else if (currentDay >= 26 && currentDay <= 30) {
      imageUrlLight = '/header-logo/turkey.png';
      imageUrlDark = '/header-logo/turkey.png';
    }
  }

  if (currenMonth === 12) {
    if (currentDay >= 1 && currentDay <= 8) {
      imageUrlLight = '/header-logo/wreath.png';
      imageUrlDark = '/header-logo/wreath.png';
    } else if (currentDay >= 9 && currentDay <= 17) {
      imageUrlLight = '/header-logo/christmaslights.png';
      imageUrlDark = '/header-logo/christmaslights.png';
    } else if (currentDay >= 18 && currentDay <= 24) {
      imageUrlLight = '/header-logo/mistletoe.png';
      imageUrlDark = '/header-logo/mistletoe.png';
    } else if (currentDay >= 25 && currentDay <= 31) {
      imageUrlLight = '/header-logo/christmastree.png';
      imageUrlDark = '/header-logo/christmastree.png';
    }
  }

  if (currenMonth === 1) {
    if (currentDay >= 1 && currentDay <= 5) {
      imageUrlLight = '/header-logo/newyear2026.png';
      imageUrlDark = '/header-logo/newyear2026.png';
    } else if (currentDay >= 6 && currentDay <= 15) {
      imageUrlLight = '/header-logo/winter.png';
      imageUrlDark = '/header-logo/winter.png';
    } else if (currentDay >= 16 && currentDay <= 24) {
      imageUrlLight = '/header-logo/snowtree.png';
      imageUrlDark = '/header-logo/snowtree.png';
    } else {
      imageUrlLight = '/header-logo/snowy.png';
      imageUrlDark = '/header-logo/snowy.png';
    }
  }

  return [imageUrlLight, imageUrlDark];
}
