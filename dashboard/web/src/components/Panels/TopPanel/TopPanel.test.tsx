import { render } from '@redwoodjs/testing/web'

import TopPanel from './TopPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TopPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TopPanel />)
    }).not.toThrow()
  })
})
