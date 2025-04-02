import Graph from "../Graph/Graph"

export const QUERY = gql`
  query FindSensorData($type: String!) {
    data: sensorsData(type: $type) {
      name      
      metrics {
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
  return <Graph sensorsData={data}></Graph>
  // return <div>{JSON.stringify(data)}</div>
}
