import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import SensorPanel from 'src/components/Panels/SensorPanel/SensorPanel';
import { useState } from 'react';
import { Sensor } from 'types/graphql';
// import SensorCell from 'src/components/Sensor/SensorCell/SensorCell'




const HomePage = () => {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <SensorPanel
        sensorData={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      >
      </SensorPanel>
      Overhead map visualization of Pu'uhonua with sensors placed at appropriate points

      {/* <SensorCell></SensorCell> */}

      <div className='flex flex-col space-y-4'>          

      </div>
      <Link to={routes.about()}>Go to about</Link>
    </>
  )
}

export default HomePage
