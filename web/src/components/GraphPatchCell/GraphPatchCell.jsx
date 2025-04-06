import GraphPatch from 'src/components/GraphPatch/GraphPatch'

export const QUERY = gql`
  query FindDataFromAPatchQuery($type: String!, $name: String!) {
    graphPatch: sensorsDataByLocation(name: $name, type: $type) {
      name
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
