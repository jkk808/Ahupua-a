import { render } from '@redwoodjs/testing/web'

import Graph from './Graph'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Graph', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Graph />)
    }).not.toThrow()
  })
})
