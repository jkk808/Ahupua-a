import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SensorForm from 'src/components/Sensor/SensorForm'

export const QUERY = gql`
  query EditSensorById($id: Int!) {
    sensor: sensor(id: $id) {
      id
      name
    }
  }
`

const UPDATE_SENSOR_MUTATION = gql`
  mutation UpdateSensorMutation($id: Int!, $input: UpdateSensorInput!) {
    updateSensor(id: $id, input: $input) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sensor }) => {
  const [updateSensor, { loading, error }] = useMutation(
    UPDATE_SENSOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sensor updated')
        navigate(routes.sensors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateSensor({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Sensor {sensor?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <SensorForm
          sensor={sensor}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
