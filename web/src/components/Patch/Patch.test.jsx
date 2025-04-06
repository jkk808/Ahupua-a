import { render } from '@redwoodjs/testing/web'

import Patch from './Patch'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Patch', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Patch />)
    }).not.toThrow()
  })
})
