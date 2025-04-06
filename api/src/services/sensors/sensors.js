import { db } from 'src/lib/db'

export const sensors = () => {
  return db.sensor.findMany()
}

export const sensor = ({ id }) => {
  return db.sensor.findUnique({
    where: { id },
    include: { metrics: true },  // Ensure metrics are included in the query
  })
}

export const sensorsData =({ type }) => {
  return db.sensor.findMany({
    where: {
      metrics: {
        some: { type }, // Ensures only sensors with matching metrics are returned
      },
    },
    include: {
      metrics: {
        where: { type },
      },
    },
  });
};

export const sensorsDataByLocation = ({ name, type }) => {
  return db.sensor.findFirst({
    where: {
      name,
      metrics: {
        some: { type }
      }
     },
     include: {
      metrics: {
        where: { type },
      },
     },
  })
}

export const createSensor = ({ input }) => {
  return db.sensor.create({
    data: input,
  })
}

export const updateSensor = ({ id, input }) => {
  return db.sensor.update({
    data: input,
    where: { id },
  })
}

export const deleteSensor = ({ id }) => {
  return db.sensor.delete({
    where: { id },
  })
}
