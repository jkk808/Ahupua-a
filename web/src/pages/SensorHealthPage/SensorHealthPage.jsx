// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const SensorHealthPage = () => {
  return (
    <>
      <Metadata title="SensorHealth" description="SensorHealth page" />

      <h1>SensorHealthPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/SensorHealthPage/SensorHealthPage.jsx</code>
      </p>
      {/*
           My default route is named `sensorHealth`, link to me with:
           `<Link to={routes.sensorHealth()}>SensorHealth</Link>`
        */}
    </>
  )
}

export default SensorHealthPage
