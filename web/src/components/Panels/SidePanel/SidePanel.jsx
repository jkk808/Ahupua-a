import { Link, routes, navigate } from '@redwoodjs/router'
import HealthScoresCell from 'src/components/HealthScoresCell/HealthScoresCell'
import Patch from 'src/components/Patch/Patch'
import { useState } from 'react'
import PatchButton from 'src/components/PatchButton/PatchButton'
import HealthScore from 'src/components/HealthScore/HealthScore'

const patches = [
  { id: 'patch-1', location: 'top-bed' },
  { id: 'patch-3', location: 'mid-bed' },
  { id: 'patch-4', location: 'bot-bed' },
  // Add as many as you want
]

const SidePanel = () => {
  const [open, setOpen] = useState(false)
  const toggleDropdown = () => setOpen((prev) => !prev)
  return (
    <div className="fixed left-0 h-full w-64 border-r border-gray-200 bg-white p-6">
      {/* holds the links to different pages for water and soil */}
      {/* <HealthScoresCell></HealthScoresCell> */}

      <div className="space-y-4">
        <div className="w-full rounded-lg border border-gray-200 p-2 text-left drop-shadow-sm transition-colors hover:bg-gray-50">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Stream Health
          </h3>
          <HealthScore score={0.9}></HealthScore>
        </div>

        <div className="w-full rounded-lg border border-gray-200 p-2 text-left drop-shadow-sm transition-colors hover:bg-gray-50">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Overall Soil Health
          </h3>
          <HealthScore score={0.6}></HealthScore>
        </div>

        <br></br>

        <Link to={routes.home()}>
          <button
            onClick={toggleDropdown}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center drop-shadow-sm transition-colors hover:bg-gray-50"
          >
            Patches
          </button>
        </Link>

        {open && (
          <div className="mt-2 w-full origin-top-right">
            {patches.map((patch) => (
              <Link
                to={routes.patch({ location: patch.location })}
                className="block rounded border border-gray-200 px-4 py-2 text-sm hover:bg-gray-100"
              >
                {patch.location}
              </Link>
            ))}
          </div>
        )}

        <Link to={routes.huliʻia()}>
          <button className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-3 text-center drop-shadow-sm transition-colors hover:bg-gray-50">
            Kilo
          </button>
        </Link>

        <Link to={routes.map()}>
          <button className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-3 text-center drop-shadow-sm transition-colors hover:bg-gray-50">
            Map
          </button>
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
