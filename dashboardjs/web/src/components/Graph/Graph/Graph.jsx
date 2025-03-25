import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2';


const data1 = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [300, 150, 100],
      label: "Revenue"
    },
  ],
};

// rebuild the data to an object for chartjs format
const format = (sensorData) => {
  const labels = sensorData.metrics.map((entry) => entry.timestamp)

  const data = sensorData.metrics.map((entry) => entry.value)

  const datasets = [
    {
      label: `${sensorData.metrics[0].type}`,
      data: data,
    }
  ]
  return {labels, datasets}
}

const Graph = ({ sensorData }) => {
  const data = format(sensorData)
  const name = sensorData.name
  return (
    <>            
      <h1>{name}</h1>
      <Line data={data} />
    </>
  );
}

export default Graph