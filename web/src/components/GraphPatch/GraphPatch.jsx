import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2';

function formatTime(timestamp) {
   return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });
}

function formatTitle(dataType) {
  switch (dataType) {
    case 'ntu':
      return "Turbidity"
    case 'tds':
      return "Total Dissolved Solids"
    case 's_ph':
      return "Soil pH"
    case 's_moi':
      return "Soil Moisture"
    case 'level':
      return "Water Level"
    default:
      return "Unknown"
  }
}

const Graph = ({ metrics }) => {
  const title = formatTitle(metrics[0].type)

  const chartData = {
    labels: metrics.map((m) => formatTime(new Date(m.timestamp))),
    datasets: [
      {
        data: metrics.map((m) => m.value),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.3)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  return (
    <>
    <div className='w-[800px] h-[400px]'>
      <Line data={chartData} options={chartOptions}/>
    </div>
    </>
  );
}

export default Graph