import Graph from "../Graph/Graph"

export const QUERY = gql`
  query FindSensorData($type: String!) {
    data: sensorsData(type: $type) {
      name
      location
      metrics {
        timestamp
        value
        type
      }
    }
  }
`

const sortData = (data) => {
  return data.map((sensor) => {
    // need to clone since Apollo makes query data read-only
    const sortedMetrics = [...sensor.metrics].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      ...sensor,
      metrics: sortedMetrics
    }
  })
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ data }) => {
  return <Graph sensorsData={sortData(data)}></Graph>
  // return <div>{JSON.stringify(sortData(data))}</div>
}
