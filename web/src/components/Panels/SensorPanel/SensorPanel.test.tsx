import { render } from '@redwoodjs/testing/web'

import SensorPanel from './SensorPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SensorPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SensorPanel />)
    }).not.toThrow()
  })
})
