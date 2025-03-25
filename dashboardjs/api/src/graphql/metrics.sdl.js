export const schema = gql`
  type Metric {
    id: Int!
    value: Float!
    timestamp: DateTime!
    type: String!
    sensor: Sensor
    sensorID: Int!
  }

  type Query {
    metrics: [Metric!]! @requireAuth
    metric(id: Int!): Metric @requireAuth
  }

  input CreateMetricInput {
    value: Float!
    timestamp: DateTime!
    type: String!
    sensorID: Int!
  }

  input UpdateMetricInput {
    value: Float
    timestamp: DateTime
    type: String
    sensorID: Int
  }

  type Mutation {
    createMetric(input: CreateMetricInput!): Metric! @requireAuth
    updateMetric(id: Int!, input: UpdateMetricInput!): Metric! @requireAuth
    deleteMetric(id: Int!): Metric! @requireAuth
  }
`
