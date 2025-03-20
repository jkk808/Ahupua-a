import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import SensorForm from 'src/components/Sensor/SensorForm'

const CREATE_SENSOR_MUTATION = gql`
  mutation CreateSensorMutation($input: CreateSensorInput!) {
    createSensor(input: $input) {
      id
      name
      location
      latitude
      longitude
      metrics {
        id
        value
        type
        timestamp
      }
    }
  }
`

const NewSensor = () => {
  const [createSensor, { loading, error }] = useMutation(
    CREATE_SENSOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sensor created')
        navigate(routes.sensors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    // Convert latitude and longitude to numbers
    const formattedInput = {
      ...input,
      latitude: parseFloat(input.latitude),
      longitude: parseFloat(input.longitude),
    }
    createSensor({ variables: { input: formattedInput } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Sensor</h2>
      </header>
      <div className="rw-segment-main">
        <SensorForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewSensor
