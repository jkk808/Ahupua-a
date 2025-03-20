export const schema = gql`
  type Sensor {
    id: Int!
    name: String
    location: String
    latitude: Float!
    longitude: Float!
    metrics: [Metric]
  }

  type Metric {
    id: Int!
    value: Float
    timestamp: DateTime
    type: String
    sensor: Sensor
    sensorID: Int!
  }

  type Query {
    sensors: [Sensor!]! @requireAuth
    sensor(id: Int!): Sensor @requireAuth
  }

  input CreateSensorInput {
    name: String
    location: String
    latitude: Float!
    longitude: Float!
  }

  input UpdateSensorInput {
    name: String
    location: String
    latitude: Float
    longitude: Float
  }

  input CreateMetricInput {
    value: Float!
    type: String!
    sensorID: Int!
  }

  type Mutation {
    createSensor(input: CreateSensorInput!): Sensor! @requireAuth
    updateSensor(id: Int!, input: UpdateSensorInput!): Sensor! @requireAuth
    deleteSensor(id: Int!): Sensor! @requireAuth
    createMetric(input: CreateMetricInput!): Metric! @requireAuth
  }
`
