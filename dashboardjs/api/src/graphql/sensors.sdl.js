export const schema = gql`
  type Sensor {
    id: Int!
    name: String
  }

  type Query {
    sensors: [Sensor!]! @requireAuth
    sensor(id: Int!): Sensor @requireAuth
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
