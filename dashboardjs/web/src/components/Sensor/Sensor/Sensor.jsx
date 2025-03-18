import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import 'src/lib/formatters'

const DELETE_SENSOR_MUTATION = gql`
  mutation DeleteSensorMutation($id: Int!) {
    deleteSensor(id: $id) {
      id
    }
  }
`

const Sensor = ({ sensor }) => {
  const [deleteSensor] = useMutation(DELETE_SENSOR_MUTATION, {
    onCompleted: () => {
      toast.success('Sensor deleted')
      navigate(routes.sensors())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete sensor ' + id + '?')) {
      deleteSensor({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Sensor {sensor.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{sensor.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{sensor.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editSensor({ id: sensor.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(sensor.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Sensor
