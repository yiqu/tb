'use client';

import { Pie, Cell, PieChart } from 'recharts';

export default function SubscriptionDetailsMetadataFooterTotalBillsChart({ count1, count2 }: { count1: number; count2: number }) {
  const isAllReimbursedOrPaid = count2 === 0;

  const data = [
    { name: 'count1', count: count1, fill: isAllReimbursedOrPaid ? 'var(--green-1)' : 'var(--chart-1)' },
    { name: 'count2', count: count2, fill: 'var(--grey-1)' },
  ];

  return (
    <div>
      <PieChart width={ 50 } height={ 50 } style={ { top: '7px' } }>
        <Pie
          data={ data }
          cx={ 20 }
          cy={ 20 }
          innerRadius={ 13 }
          outerRadius={ 20 }
          paddingAngle={ 5 }
          dataKey="count"
          stroke="none"
          startAngle={ 180 }
          endAngle={ 0 }
        >
          { data.map((entry) => (
            <Cell key={ `cell-${entry.name}` } fill={ entry.fill } />
          )) }
        </Pie>
      </PieChart>
    </div>
  );
}
