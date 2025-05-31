import {
  Chart as ChartJs,
  Tooltip,
  ArcElement,
} from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import useTranslation from '@shared/hooks/useTranslation';

ChartJs.register(
  Tooltip,
  ArcElement,
);

function DoughnutGraph({ data }: { data: any[] }) {
  const i18n = useTranslation('analyticsPage');
  const options = {
    cutout: '80%',
    radius: '50%',
  };
  const graphData = {
    labels: [
      i18n.label.followers,
      // 'Base Followers',
      i18n.label.nonFollowers,
      // 'Super Fans',
    ],
    datasets: [
      {
        label: i18n.label.viewers,
        data,
        backgroundColor: [
          '#19BED4',
          // '#379393',
          '#007888',
          // '#ADEAF2',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="doughnut-graph">
      <Doughnut options={options} data={graphData} />
    </div>
  );
}

export default DoughnutGraph;
