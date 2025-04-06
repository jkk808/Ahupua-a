import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2';

function formatTitle(dataType) {
  switch (dataType) {
    case 'ntu':
      return "Turbidity"
    case 'w_ph':
      return "Water pH"
    case 's_ph':
      return "Soil pH"
    case 's_moi':
      return "Soil Moisture"
    case 'cur':
      return "Current"
    case 'volt':
      return "Voltage"
    default:
      return "Unknown"
  }
}

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

const Graph = ({ sensorsData }) => {
  // const data = format(sensorsData)
  const title = formatTitle(sensorsData[0].metrics[0].type)

  const chartData = {
    datasets: sensorsData.map((sensor, index) => ({
      label: sensor.location, // Sensor name as dataset label
      data: sensor.metrics.map((metric) => ({
        x: formatTime(metric.timestamp), // Chart.js auto-parses this timestamp
        y: metric.value,
      })),
      borderColor: ["green", "blue", "orange"][index], // Assign colors dynamically
      backgroundColor: ["rgba(0, 128, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 165, 0, 0.5)"][index],
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  }

  return (
    <>
    <div className='w-[600px] h-[300px]'>
      <Line data={chartData} options={chartOptions}/>
    </div>
    </>
  );
}

export default Graph