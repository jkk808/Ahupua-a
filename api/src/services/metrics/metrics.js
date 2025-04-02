import { db } from 'src/lib/db'

export const metrics = () => {
  return db.metric.findMany()
}

export const metric = ({ id }) => {
  return db.metric.findUnique({
    where: { id },
  })
}

export const metricsByType = ({ type }) => {
  return db.metric.findMany({
    where: { type },
  })
}


export const createMetric = ({ input }) => {
  return db.metric.create({
    data: input,
  })
}

export const updateMetric = ({ id, input }) => {
  return db.metric.update({
    data: input,
    where: { id },
  })
}

export const deleteMetric = ({ id }) => {
  return db.metric.delete({
    where: { id },
  })
}

export const Metric = {
  sensor: (_obj, { root }) => {
    return db.metric.findUnique({ where: { id: root?.id } }).sensor()
  },
}
