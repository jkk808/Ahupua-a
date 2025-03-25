import { render } from '@redwoodjs/testing/web'

import WaterPage from './WaterPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('WaterPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<WaterPage />)
    }).not.toThrow()
  })
})
