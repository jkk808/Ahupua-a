import { render } from '@redwoodjs/testing/web'

import SensorButtons from './SensorButtons'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SensorButtons', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SensorButtons />)
    }).not.toThrow()
  })
})
