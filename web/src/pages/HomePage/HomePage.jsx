import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import SensorsCell from 'src/components/Sensor/SensorsCell'
import Patch from 'src/components/Patch/Patch'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.jsx</code>
      </p>

      <Patch></Patch>
      {/*
           My default route is named `home`, link to me with:
           `<Link to={routes.home()}>Home</Link>`
        */}
    </>
  )
}

export default HomePage
