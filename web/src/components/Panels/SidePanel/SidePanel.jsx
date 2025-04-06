import { Link, routes, navigate } from '@redwoodjs/router'
import HealthScoresCell from 'src/components/HealthScoresCell/HealthScoresCell'
import Patch from 'src/components/Patch/Patch'
import { useState } from 'react'
import PatchButton from 'src/components/PatchButton/PatchButton'

const patches = [
  { id: 'patch-1', name: 'top-bed' },
  { id: 'patch-2', name: 'top-middle-bed' },
  { id: 'patch-3', name: 'middle-bottom-bed' },
  { id: 'patch-4', name: 'bottom-bed' },
  // Add as many as you want
]

const SidePanel = () => {
  const [open, setOpen] = useState(false)
  const toggleDropdown = () => setOpen((prev) => !prev)
  return (
    <div className="fixed left-0 h-full w-64 bg-white border-r border-gray-200 p-6">

      {/* holds the links to different pages for water and soil */}
      {/* <HealthScoresCell></HealthScoresCell> */}

        <div className="space-y-4 pt-4">
          <Link to={routes.home()}>
            <button
            onClick={toggleDropdown}
            className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                Patches
            </button>
          </Link>

          {open && (
            <div className="origin-top-right mt-2 w-full">
              {patches.map((patch) => (
                <Link
                  to={routes.patch({ name: patch.name })}
                  className="block px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 text-sm"
                >
                  {patch.name}
                </Link>
              ))}
            </div>
          )}

          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            All Sensors
          </button>
          <button className="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            <Link to={routes.map()}>
            Map
            </Link>
          </button>
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
