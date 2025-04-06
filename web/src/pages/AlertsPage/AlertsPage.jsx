import { Link, routes } from '@redwoodjs/router'
import { Metadata} from '@redwoodjs/web'
import SensorsCell from 'src/components/Sensor/SensorsCell'
import { TextAreaField } from '@redwoodjs/forms'
import mockAlertData from '../../../../mockDataAlerts.json'

console.log(mockAlertData)

const AlertsPage = () => {
  return (
    <>
      <Metadata title="Alerts" description="Alerts page" />

      <h1>Alerts</h1>
     <div className="rw-segment rw-table-wrapper-responsive">
       <table className="rw-table">
         <thead>
           <tr>
            <th>Date</th>
             <th>Time</th>
             <th>Name</th>
             <th>Type</th>
             <th>Location</th>
             <th>Value</th>
             <th>Unit</th>
             <th>Comments</th>
           </tr>
         </thead>
         <tbody>
           {mockAlertData.map((alert) => (
             <tr key={alert.id}>
               <td>{alert.date}</td>
               <td>{alert.time}</td>
               <td>{alert.name}</td>
               <td>{alert.type}</td>
               <td>{alert.location}</td>
               <td>{alert.value}</td>
               <td>{alert.unit}</td>
               <td>
                  <textarea/>
              </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
    </>
  )
}

export default AlertsPage
