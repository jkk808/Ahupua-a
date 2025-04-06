import HealthScore from "../HealthScore/HealthScore"

const Patch = ({ patch }) => {
  return (
    <>
      <button className='border border-gray-200 drop-shadow-sm w-full h-64 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
        <h1 className="text-xl font-medium text-gray-500 mb-2">
          {patch.name}
        </h1>
        <div className="grid grid-cols-2 gap-4 p-6">
          <div>
            <h2>
              Soil Health
            </h2>
            <HealthScore score={0.6}></HealthScore>
          </div>

          <div>
            <h2>
              Water Health
            </h2>
            <HealthScore score={0.9}></HealthScore>
          </div>
        </div>
      </button>
    </>
  )
}

export default Patch
