import { render } from '@redwoodjs/testing/web'

import HealthScore from './HealthScore'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('HealthScore', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HealthScore />)
    }).not.toThrow()
  })
})
