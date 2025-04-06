import { Link, routes, navigate } from '@redwoodjs/router'
import HealthScoresCell from 'src/components/HealthScoresCell/HealthScoresCell'
import Patch from 'src/components/Patch/Patch'
import { useState } from 'react'

const SidePanel = () => {
  const [open, setOpen] = useState(false)
  const toggleDropdown = () => setOpen((prev) => !prev)
  return (
    <div className="fixed left-0 h-full w-64 bg-white border-r border-gray-200 p-6">

      {/* holds the links to different pages for water and soil */}
      {/* <HealthScoresCell></HealthScoresCell> */}

      <div className="space-y-4 pt-4">
        <button
          onClick={toggleDropdown}
          className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
          Patches
        </button>

        {open && (
          <div className="origin-top-right mt-2 w-full">
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
            <Patch></Patch>
          </div>
        )}
        <div className=''>
          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            Recommendations
          </button>
        </div>
        <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
          All Sensors
        </button>
        <Link to={routes.map()}
          className="block border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 mt-6 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Map
        </Link>
        {/* <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            Export Data
          </button> */}
        {/* <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            Help
          </button> */}
      </div>

    </div>
  )
}

export default SidePanel
