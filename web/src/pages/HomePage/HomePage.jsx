import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import SensorsCell from 'src/components/Sensor/SensorsCell'
import Patch from 'src/components/Patch/Patch'

const patches = [
  { id: 'patch-1', name: 'top-bed' },
  { id: 'patch-2', name: 'mid-bed' },
  { id: 'patch-4', name: 'bot-bed' },
  // Add as many as you want
]

const scores = [
  { soil: 0.60, water: 0.60},
  { soil: 0.70, water: 0.75},
  { soil: 0.90, water: 0.92},
]

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <div className="grid grid-cols-2 gap-4 p-6">
        <Patch patch={patches[0]} scores={scores[0]}></Patch>
        <Patch patch={patches[1]} scores={scores[1]}></Patch>
        <Patch patch={patches[2]} scores={scores[2]}></Patch>
      </div>
      {/*
           My default route is named `home`, link to me with:
           `<Link to={routes.home()}>Home</Link>`
        */}
    </>
  )
}

export default HomePage
