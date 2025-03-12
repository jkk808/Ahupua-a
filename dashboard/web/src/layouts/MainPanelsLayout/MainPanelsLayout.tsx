import { Link, routes } from '@redwoodjs/router'
import SidePanel from 'src/components/Panels/SidePanel/SidePanel'
import TopPanel from 'src/components/Panels/TopPanel/TopPanel'
import React from 'react';

export interface SensorData {
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

// predefined sensor data for testing
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
const MainPanelLayout = ({ children }) => {
  return (
    <>      
      <div className='flex h-screen'>
          <SidePanel />   
        <div className='flex-1 flex flex-col'>
          <TopPanel />        
          <main className='flex-1 ml-64 overflow-auto p-6'>                           
            {children}
          </main>      
        </div>
      </div>
    </>
  )
}

export default MainPanelLayout
