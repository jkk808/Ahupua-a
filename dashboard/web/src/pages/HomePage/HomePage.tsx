import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

interface SensorData {
  id: string;
  name: string;
  location: string;
  zone: 'upland' | 'midland' | 'coastal';
  metrics: {
    soilType?: string;
    waterLevel?: number;
    temperature?: number;
    soilPower?: number;
  };
  xPosition: number;
  yPosition: number;
}
const sensorData: SensorData[] = [
  {
    id: "1",
    name: "Upland Sensor 1",
    location: "Upper Forest Zone",
    zone: "upland",
    metrics: {
      soilType: "Rocky Volcanic",
      temperature: 22,
      waterLevel: 85,
    },
    xPosition: 40,
    yPosition: 30,
  },
  {
    id: "2",
    name: "Midland Sensor 1",
    location: "Agricultural Zone",
    zone: "midland",
    metrics: {
      soilType: "Alluvial",
      soilPower: 75,
      waterLevel: 60,
    },
    xPosition: 50,
    yPosition: 50,
  },
  {
    id: "3",
    name: "Coastal Sensor 1",
    location: "Coastal Area",
    zone: "coastal",
    metrics: {
      soilType: "Sandy Loam",
      temperature: 26,
      waterLevel: 40,
    },
    xPosition: 60,
    yPosition: 70,
  },
];

const HomePage = ({
  sensors,
  onSensorClick
}) => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      Overhead map visualization of Pu'uhonua with sensors placed at appropriate points

      <div className='flex flex-col space-y-4'>
        <button className='border border-gray-200 drop-shadow-sm w-fit text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>Top Bed Water Sensor </button>
        <button className='border border-gray-200 drop-shadow-sm w-fit text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>Middle Bed Water Sensor</button>
        <button className='border border-gray-200 drop-shadow-sm w-fit text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>Bottom Bed Water Sensor</button>
        <button className='border border-gray-200 drop-shadow-sm w-fit text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>Stream USGS Sensor</button>
      </div>
    </>
  )
}

export default HomePage
