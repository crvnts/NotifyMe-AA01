import Typography from 'antd/es/typography/Typography';
import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale, // y axis
  Tooltip,
  Legend
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const TrafficDensity = () => {

  const data = {
    labels: ['Sun','Mon','Tue'],
    datasets: [
      {
        label: '369',
        data: [3,6,9],
        backgroundColor: 'aqua',
        borderColor: 'black',
        borderWidth: 1,
      }
    ]
  }

  const options = {

  }

  return (
    <div>
      <h1>yallah bar chart</h1>
      <Bar
        data = {data}
        options = {options}
      ></Bar>
    </div>

  )
}

export default TrafficDensity;
