import Graph from "../Graph/Graph"

export const QUERY = gql`
  query FindSensorData($id: Int!, $type: String!) {
    data: sensorData(id: $id, type: $type) {
      id
      name
      location
      metrics {
        id
        timestamp
        value
        type        
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ data }) => {
  return <Graph sensorData={data}></Graph>
  // return <div>{JSON.stringify(data)}</div>
}
