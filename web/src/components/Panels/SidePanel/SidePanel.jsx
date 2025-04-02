import { Link, routes, navigate } from '@redwoodjs/router'
import HealthScoresCell from 'src/components/HealthScoresCell/HealthScoresCell'


const SidePanel = () => {
  return (
    <div className="fixed left-0 h-full w-64 bg-white border-r border-gray-200 p-6">

        <HealthScoresCell></HealthScoresCell>

        <div className="space-y-4 pt-4">
          <div className=''>
            <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
              Recommendations
            </button>
          </div>
          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            All Sensors
          </button>
          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            Export Data
          </button>
          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            Help
          </button>
        </div>

    </div>
  )
}

export default SidePanel