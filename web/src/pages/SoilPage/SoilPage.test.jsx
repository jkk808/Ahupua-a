import { render } from '@redwoodjs/testing/web'

import SoilPage from './SoilPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SoilPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SoilPage />)
    }).not.toThrow()
  })
})
