import type { SensorsQuery, SensorsQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<SensorsQuery, SensorsQueryVariables> =
  gql`
    query SensorsQuery {
      sensors {
        id
      }
    }
  `

export interface Sensor {
  id: string;
  name: string;
  location: string;
  zone: 'upland' | 'midland' | 'coastal';
  metrics: {
    soilType?: string;
    waterLevel?: number;
    temperature?: number;
    soilPower?: number;
  };
  xPosition: number;
  yPosition: number;
}

// predefined sensor data for testing
const mockSensors: Sensor[] = [
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

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ( sensors: Sensor[] ) => {
  return (
    <ul>
      {sensors.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}
