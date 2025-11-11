'use client';

import { use, useState } from 'react';

import { CurrentMonthDateData } from '@/models/bills/bills.model';
import Typography, { TypographyProps } from '@/components/typography/Typography';

type Props = {
  dateDataPromise: Promise<CurrentMonthDateData>;
} & TypographyProps;

export default function CurrentMonthText({ dateDataPromise, ...rest }: Props) {
  const dateData: CurrentMonthDateData = use(dateDataPromise);
  const [titleClicked, setTitleClicked] = useState(false);

  const handleOnTitleClick = () => {
    setTitleClicked((prev) => {
      return !prev;
    });
  };

  return (
    <>
      <Typography { ...rest } onClick={ handleOnTitleClick }>
        { dateData.monthName }
      </Typography>
      { titleClicked ?
        <Typography>
          { dateData.startDate } -{ '>' } { dateData.endDate }
        </Typography>
      : null }
    </>
  );
}
