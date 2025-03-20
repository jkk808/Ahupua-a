import { db } from 'src/lib/db'

const validateCoordinates = (latitude, longitude) => {
  if (latitude < 0 || latitude > 90) {
    throw new Error('Invalid latitude. Must be between 0 and 90.')
  }
  if (longitude > 0 || longitude < -180) {
    throw new Error('Invalid longitude for Hawaii. Must be between -180 and 0.')
  }
}

export const sensors = () => {
  return db.sensor.findMany()
}

export const sensor = ({ id }) => {
  return db.sensor.findUnique({
    where: { id },
    include: { metrics: true },  // Ensure metrics are included in the query
  })
}

export const createSensor = ({ input }) => {
  validateCoordinates(input.latitude, input.longitude)
  return db.sensor.create({
    data: input,
  })
}

export const updateSensor = ({ id, input }) => {
  if (input.latitude !== undefined || input.longitude !== undefined) {
    const sensor = db.sensor.findUnique({ where: { id } })
    validateCoordinates(
      input.latitude ?? sensor.latitude,
      input.longitude ?? sensor.longitude
    )
  }
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
