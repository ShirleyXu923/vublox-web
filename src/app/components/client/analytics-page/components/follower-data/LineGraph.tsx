import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
} from 'chart.js';
import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';

import 'chartjs-adapter-moment';
import { shortNumberFormat } from '@shared/helpers';

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
);

function LineGraph({ data, type }: { data: any[]; type: 'number' | 'percentage' }) {
  const graphData = {
    datasets: [
      {
        label: '',
        data,
        borderColor: '#19BED4',
        color: '#9AAEC7',
      },
    ],
  };
  const options: any = {
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            quarter: 'MMM YYYY',
          },
          tooltipFormat: 'ddd, MMM DD, YYYY',
          unit: 'day',
        },
        ticks: {
          backdropPadding: 20,
          color: '#9AAEC7',
          font: {
            size: 14,
            weight: 400,
          },
          callback: (t: any, index: number) => {
            let label = [ moment(t).format('D') ];
            if (moment(t).get('D') === 1 || index === 0) {
              label = [
                ...label,
                moment(t).format('MMM'),
              ];
            }
            return label;
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
          color: 'transparent',
        },
      },
      y: {
        ticks: {
          color: '#9AAEC7',
          font: {
            size: 14,
            weight: 400,
          },
          callback: (t: any) => (type === 'number' ? shortNumberFormat(t) : `${t}%`),
          precision: 0,
        },
        grid: {
          color: '#9AAEC7',
        },
        border: {
          display: false,
        },
      },
    },
    ticks: {
      source: 'data',
    },
  };

  return (
    <div className="mt-4 px-2 py-4 line-graph">
      <Line options={options} data={graphData} />
    </div>
  );
}

export default LineGraph;
