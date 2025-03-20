import { db } from 'src/lib/db'

export const createMetric = ({ input }) => {
  return db.metric.create({
    data: input,
  })
}
