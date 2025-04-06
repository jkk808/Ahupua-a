// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import GraphCell from 'src/components/Graph/GraphCell'
import HealthScore from 'src/components/HealthScore/HealthScore'

const SensorHealthPage = () => {
  return (
    <>
      <Metadata title="SensorHealth" description="SensorHealth page" />

      <div className='space-y-8'>
        <div className='grid grid-cols-2 gap-64'>
          <GraphCell type={'cur'}></GraphCell>
          <div className='mt-8 space-y-4'>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Top Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Middle Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Bottom Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
        </div>

        <div className='grid grid-cols-2 gap-64'>
          <GraphCell type={'volt'}></GraphCell>
          <div className='mt-8 space-y-4'>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Top Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Middle Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
            <div className='border border-gray-200 drop-shadow-sm w-72 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                  {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                  <h1 className="text-xl font-semibold text-left">Bottom Bed</h1>
                  <div className='text-green-600'>
                      Good
                  </div>
            </div>
          </div>
        </div>
      </div>
      {/*
           My default route is named `sensorHealth`, link to me with:
           `<Link to={routes.sensorHealth()}>SensorHealth</Link>`
        */}
    </>
  )
}

export default SensorHealthPage
