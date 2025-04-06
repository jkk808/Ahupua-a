export const schema = gql`
  type Sensor {
    id: Int!
    name: String
    location: String
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
    sensorsData(type: String!): [Sensor!]! @requireAuth
    sensor(id: Int!): Sensor @requireAuth
    sensorsDataByLocation(name: String!, type: String!): Sensor @requireAuth
  }

  input CreateSensorInput {
    name: String
  }

  input UpdateSensorInput {
    name: String
  }

  type Mutation {
    createSensor(input: CreateSensorInput!): Sensor! @requireAuth
    updateSensor(id: Int!, input: UpdateSensorInput!): Sensor! @requireAuth
    deleteSensor(id: Int!): Sensor! @requireAuth
  }
`
