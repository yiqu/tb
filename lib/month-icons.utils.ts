export const getMonthImage = (month: any): string => {
  const selectedMonth = `${month}`.toLocaleLowerCase();
  let imgUrl = 'all';

  switch (selectedMonth) {
    case '1':
      imgUrl = 'jan';
      break;
    case '2':
      imgUrl = 'h-girl';
      break;
    case '3':
      imgUrl = 'mar';
      break;
    case '4':
      imgUrl = 'apr';
      break;
    case '5':
      imgUrl = 'may';
      break;
    case '6':
      imgUrl = 'jun';
      break;
    case '7':
      imgUrl = 'jul';
      break;
    case '8':
      imgUrl = 'aug';
      break;
    case '9':
      imgUrl = 'spt2';
      break;
    case '10':
      imgUrl = 'e-girl';
      break;
    case '11':
      imgUrl = 'nov';
      break;
    case '12':
      imgUrl = 'dec';
      break;
  }

  return `/month-image/${imgUrl}.png`;
};

export const getMonthIcon = (month: any): string => {
  const selectedMonth = `${month}`.toLocaleLowerCase();
  let imgUrl = 'default';

  switch (selectedMonth) {
    case '1':
      imgUrl = 'jan';
      break;
    case '2':
      imgUrl = 'feb';
      break;
    case '3':
      imgUrl = 'mar';
      break;
    case '4':
      imgUrl = 'apr';
      break;
    case '5':
      imgUrl = 'may';
      break;
    case '6':
      imgUrl = 'jun';
      break;
    case '7':
      imgUrl = 'jul';
      break;
    case '8':
      imgUrl = 'aug';
      break;
    case '9':
      imgUrl = 'spt';
      break;
    case '10':
      imgUrl = 'oct';
      break;
    case '11':
      imgUrl = 'nov';
      break;
    case '12':
      imgUrl = 'dec';
      break;
  }

  return `/months/${imgUrl}.png`;
};
