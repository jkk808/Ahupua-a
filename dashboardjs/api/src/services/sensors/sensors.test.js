import { sensors, sensor, deleteSensor } from './sensors'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('sensors', () => {
  scenario('returns all sensors', async (scenario) => {
    const result = await sensors()

    expect(result.length).toEqual(Object.keys(scenario.sensor).length)
  })

  scenario('returns a single sensor', async (scenario) => {
    const result = await sensor({ id: scenario.sensor.one.id })

    expect(result).toEqual(scenario.sensor.one)
  })

  scenario('deletes a sensor', async (scenario) => {
    const original = await deleteSensor({
      id: scenario.sensor.one.id,
    })
    const result = await sensor({ id: original.id })

    expect(result).toEqual(null)
  })
})
