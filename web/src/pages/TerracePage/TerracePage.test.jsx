import { render } from '@redwoodjs/testing/web'

import TerracePage from './TerracePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TerracePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TerracePage />)
    }).not.toThrow()
  })
})
