import { render } from '@redwoodjs/testing/web'

import SidePanel from './SidePanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SidePanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SidePanel />)
    }).not.toThrow()
  })
})
