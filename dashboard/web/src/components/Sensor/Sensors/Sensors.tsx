import { timeTag, truncate } from 'src/lib/formatters'
// import { QUERY } from '../SensorCell/SensorCell'
import { Link, routes } from '@redwoodjs/router'

const Sensors = ({ sensors }) => {
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Body</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id}>
              <td>{truncate(sensor.id)}</td>
              <td>{truncate(sensor.title)}</td>
              <td>{truncate(sensor.body)}</td>
              <td>{timeTag(sensor.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sensors
