import { Link, routes, navigate } from '@redwoodjs/router'

const SidePanel = () => {
  return (
    <div className="fixed left-0 h-full w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-semibold mb-6">Ahupuaʻa Health</h1>
          <div className="space-y-4">
            <Link to={routes.water()}>
              <button className='border border-gray-200 drop-shadow-sm w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Water Quality
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">85%</div>
                    <div className="text-sm text-gray-500">EXCELLENT</div>
                  </div>
                  <div className="h-16 w-16">
                    <svg viewBox="0 0 40 40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="4"
                        strokeDasharray={`${(85 * 100) / 100} 100`}
                        transform="rotate(-90 20 20)"
                      />
                    </svg>
                  </div>
                </div>
                </button>              
            </Link>

            <button className='border border-gray-200 drop-shadow-sm w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Stream Health
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">85%</div>
                  <div className="text-sm text-gray-500">EXCELLENT</div>
                </div>
                <div className="h-16 w-16">
                  <svg viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="4"
                      strokeDasharray={`${(85 * 100) / 100} 100`}
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="space-y-4">
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
    </div>
  )
}

export default SidePanel
