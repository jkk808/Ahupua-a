import React from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Doughnut } from "react-chartjs-2";


const determineGrade = (score) => {
  if (score >= 0.9) return "EXCELLENT";
  if (score >= 0.7) return "GOOD";
  if (score >= 0.5) return "FAIR";
  if (score >= 0.3) return "POOR";
}

const HealthScore = ({ score }) => {
  const grade = determineGrade(score)
  const chartData = {
    datasets: [{
      label: '',
      data: [score, 1 - score],
      backgroundColor: ['rgb(20, 174, 61)', 'rgb(211, 211, 211)'],
    }]
  }
  const chartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    hover: { mode: null },
    events: [],
  }
  return (
    <>
    <div className="flex items-center justify-between">
      <div>        
        <div className="text-3xl font-bold">{(score * 100)}%</div>
        <div className="text-sm text-gray-500">{grade}</div>
      </div>
      <div className="h-16 w-16">
        <Doughnut data={chartData} options={chartOptions}/>        
      </div>
    </div>
    </>
  )
}

export default HealthScore
