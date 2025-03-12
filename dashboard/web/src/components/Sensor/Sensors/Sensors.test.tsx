import { render } from '@redwoodjs/testing/web'

import Sensors from './Sensors'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Sensors', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Sensors />)
    }).not.toThrow()
  })
})
