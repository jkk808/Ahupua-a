import HealthScore from "../HealthScore/HealthScore"
import { Link, routes, navigate } from '@redwoodjs/router'


export const QUERY = gql`
  query FindLatestMetric {
    metricsMostRecent {
      type
      value
    }
  }
`


const filterDataByType = ( data, type ) => {
  const filtered_data = []

  data.map((metric) =>  {

    if (type == 'water') {
      if (metric.type == 'ntu' || metric.type == 'tds') {
        filtered_data.push(metric)
      }
    }
    else if (type == 'soil') {
      if (metric.type == 'soil_moisture') {
        filtered_data.push(metric)
      }
    }
    else if (type == 'weather') {
      filtered_data.push(metric)
    }

  })
  console.log(filtered_data)
  return filtered_data
}

const determineScore = ( filtered_vals , type ) => {
  const score = 0.0

  switch (type) {
    case 'water':
      // determine weights of how water health is scored based on research
      // for now just will return a predefined number
      return 0.85
    default:
      score
  }

}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ metricsMostRecent }) => {
  const waterScore = determineScore(filterDataByType(metricsMostRecent, 'water'), 'water')
  // const [soilData] = filterDataByType(metricsMostRecent, 'soil')
  // const [ahupuaaData] = filterDataByType(metricsMostRecent, 'ahupuaa')
  return (
    <>
      <div className="space-y-4">
          <div>
            <Link to={routes.home()}>
              <button className='border border-gray-200 drop-shadow-sm w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                {/* <HealthScore score={ahupuaaScore}></HealthScore> */}
                <h1 className="text-xl font-semibold mb-6 text-center">Ahupuaʻa Health</h1>
              </button>
            </Link>
          </div>

          <div>
            <Link to={routes.water()}>
              <button className='border border-gray-200 drop-shadow-sm w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors'>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                Water Quality
                </h3>
                <HealthScore score={waterScore}></HealthScore>
              </button>
            </Link>
          </div>
      </div>
    </>
  )
}