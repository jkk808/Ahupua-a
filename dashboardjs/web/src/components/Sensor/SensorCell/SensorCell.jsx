import Sensor from 'src/components/Sensor/Sensor'

export const QUERY = gql`
  query FindSensorById($id: Int!) {
    sensor: sensor(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Sensor not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sensor }) => {
  return <Sensor sensor={sensor} />
}
