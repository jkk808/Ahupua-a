import { Sensor } from "types/graphql"
import Sensors from "../Sensors/Sensors"
import SensorButtons from "../SensorButtons/SensorButtons";

// export const QUERY = gql`
//   query FindPostById($id: Int!) {
//     posts {
//       id
//       name
//       metrics      
//     }
//   }
// `
// predefined sensor data for testing
const sensorData: Sensor[] = [
  {
    id: "1",
    name: "Upland Sensor 1",
    location: "Upper Forest Zone",
    zone: "upland",
    metrics: {
      soilType: "Rocky Volcanic",
      temperature: 22,
      waterLevel: 85,
    },
    xPosition: 40,
    yPosition: 30,
  },
  {
    id: "2",
    name: "Midland Sensor 1",
    location: "Agricultural Zone",
    zone: "midland",
    metrics: {
      soilType: "Alluvial",
      soilPower: 75,
      waterLevel: 60,
    },
    xPosition: 50,
    yPosition: 50,
  },
  {
    id: "3",
    name: "Coastal Sensor 1",
    location: "Coastal Area",
    zone: "coastal",
    metrics: {
      soilType: "Sandy Loam",
      temperature: 26,
      waterLevel: 40,
    },
    xPosition: 60,
    yPosition: 70,
  },
];

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Sensor not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ is_vis }) => {
  // if (is_vis) {
  //   return <SensorButtons sensors={sensorData} />
  // }
  return <Sensors sensors={sensorData} />
}