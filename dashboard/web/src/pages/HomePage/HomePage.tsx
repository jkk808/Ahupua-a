import { Metadata } from '@redwoodjs/web'
import { Success } from 'src/components/SensorsCell/SensorsCell'
import SensorsCell from 'src/components/SensorsCell'

const HomePage = () => {  
  return (
    <>
      <Metadata title="Home" description="Home page" />

      Overhead map visualization of Pu'uhonua with sensors placed at appropriate points      
      <div className='flex flex-col space-y-4'>       
        <SensorsCell></SensorsCell>
      </div>
      {/* <Link to={routes.about()}>Go to about</Link> */}
    </>
  )
}

export default HomePage
