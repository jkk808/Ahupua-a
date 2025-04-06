import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import SensorsCell from 'src/components/Sensor/SensorsCell'

const AlertsPage = () => {
  return (
    <>
      <Metadata title="Alerts" description="Alerts page" />

      <h1>Alerts</h1>
     <div className="rw-segment rw-table-wrapper-responsive">
       <table className="rw-table">
         <thead>
           <tr>
             <th>Id</th>
             <th>Name</th>
             <th>Type</th>
             <th>Location</th>
             <th>Metric</th>
             <th>Time</th>
             <th>Comments</th>
             <th>&nbsp;</th>
           </tr>
         </thead>
         <tbody>
           {/* {sensors.map((sensor) => (
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
           ))} */}
         </tbody>
       </table>
     </div>
    </>
  )
}

export default AlertsPage
