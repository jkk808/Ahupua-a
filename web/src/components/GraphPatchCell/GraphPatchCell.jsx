import GraphPatch from 'src/components/GraphPatch/GraphPatch'

export const QUERY = gql`
  query GetDataFromSensorBasedOnTypeQuery($type: String!, $location: String!) {
    graphPatch: sensorsDataByLocation(location: $location, type: $type) {
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
  return [...data.metrics].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    )
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ graphPatch }) => {
  // return <div>{JSON.stringify(sortData(graphPatch))}</div>
  return <GraphPatch metrics={sortData(graphPatch)}></GraphPatch>
}
