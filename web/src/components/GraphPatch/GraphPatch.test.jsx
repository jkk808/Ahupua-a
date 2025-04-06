import { render } from '@redwoodjs/testing/web'

import GraphPatch from './GraphPatch'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('GraphPatch', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GraphPatch />)
    }).not.toThrow()
  })
})
