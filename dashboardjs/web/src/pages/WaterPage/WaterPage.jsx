// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import GraphCell from 'src/components/Graph/GraphCell'

const WaterPage = () => {
  return (
    <>
      <Metadata title="Water" description="Water page" />

      <h1>Water Quality Sensors</h1>      
      
      <div className='flex justify-center gap-{20px}'>        
        <GraphCell type={"tds"}></GraphCell>
        <GraphCell type={"ntu"}></GraphCell>
      </div>

    </>
  )
}

export default WaterPage
