import { render } from '@redwoodjs/testing/web'

import PatchPage from './PatchPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PatchPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PatchPage />)
    }).not.toThrow()
  })
})
