// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import GraphCell from 'src/components/Graph/GraphCell'

const SensorHealthPage = () => {
  return (
    <>
      <Metadata title="SensorHealth" description="SensorHealth page" />

      <div className='space-y-16'>
        <GraphCell type={'cur'}></GraphCell>
        <GraphCell type={'volt'}></GraphCell>
      </div>
      {/*
           My default route is named `sensorHealth`, link to me with:
           `<Link to={routes.sensorHealth()}>SensorHealth</Link>`
        */}
    </>
  )
}

export default SensorHealthPage
