import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Sensor/SensorsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_SENSOR_MUTATION = gql`
  mutation DeleteSensorMutation($id: Int!) {
    deleteSensor(id: $id) {
      id
    }
  }
`

const SensorsList = ({ sensors }) => {
  const [deleteSensor] = useMutation(DELETE_SENSOR_MUTATION, {
    onCompleted: () => {
      toast.success('Sensor deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete sensor ' + id + '?')) {
      deleteSensor({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id}>
              <td>{truncate(sensor.id)}</td>
              <td>{truncate(sensor.name)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.sensor({ id: sensor.id })}
                    title={'Show sensor ' + sensor.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editSensor({ id: sensor.id })}
                    title={'Edit sensor ' + sensor.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete sensor ' + sensor.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(sensor.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SensorsList
