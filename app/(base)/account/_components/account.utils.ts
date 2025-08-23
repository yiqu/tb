export function getAchievementImgUrl(achievementId: string, level: number) {
  let imgUrl = '';
  switch (achievementId) {
    case 'general': {
      imgUrl = '/achievements/backpack.png';
      if (level === 1) {
        imgUrl = '/achievements/backpack.png';
      } else if (level === 2) {
        imgUrl = '/achievements/backpack.png';
      } else if (level === 3) {
        imgUrl = '/achievements/backpack.png';
      }
      break;
    }
    case 'admin': {
      imgUrl = '/achievements/keys.png';
      if (level === 1) {
        imgUrl = '/achievements/keys.png';
      } else if (level === 2) {
        imgUrl = '/achievements/keys.png';
      } else if (level === 3) {
        imgUrl = '/achievements/keys.png';
      }
      break;
    }
    case 'searcher': {
      imgUrl = '/achievements/magglass.png';
      if (level === 1) {
        imgUrl = '/achievements/magglass.png';
      } else if (level === 2) {
        imgUrl = '/achievements/magglass.png';
      } else if (level === 3) {
        imgUrl = '/achievements/magglass.png';
      }
      break;
    }
    case 'learner': {
      imgUrl = '/achievements/books.png';
      if (level === 1) {
        imgUrl = '/achievements/books.png';
      } else if (level === 2) {
        imgUrl = '/achievements/books.png';
      } else if (level === 3) {
        imgUrl = '/achievements/books.png';
      }
      break;
    }
    case 'explorer': {
      imgUrl = '/achievements/flashlight.png';
      if (level === 1) {
        imgUrl = '/achievements/flashlight.png';
      } else if (level === 2) {
        imgUrl = '/achievements/flashlight.png';
      } else if (level === 3) {
        imgUrl = '/achievements/flashlight.png';
      }
      break;
    }
  }

  return imgUrl;
}

export type AccountTabUrl = '/privacy' | '/personal-info' | '/settings' | '/security' | '';

export type AccountTabListItem = {
  id: string;
  displayText: string;
  url: AccountTabUrl;
};
