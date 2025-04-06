import { render } from '@redwoodjs/testing/web'

import HuliIaPage from './HuliIaPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HuliIaPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HuliIaPage />)
    }).not.toThrow()
  })
})
