import { render } from '@redwoodjs/testing/web'

import LlmPage from './LlmPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LlmPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LlmPage />)
    }).not.toThrow()
  })
})
