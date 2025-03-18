import { Link, routes } from '@redwoodjs/router'

import Sensors from 'src/components/Sensor/Sensors'

export const QUERY = gql`
  query FindSensors {
    sensors {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No sensors yet.{' '}
      <Link to={routes.newSensor()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sensors }) => {
  return <Sensors sensors={sensors} />
}
