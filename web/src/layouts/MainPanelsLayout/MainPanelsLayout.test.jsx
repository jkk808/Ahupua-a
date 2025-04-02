import { render } from '@redwoodjs/testing/web'

import MainPanelsLayout from './MainPanelsLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MainPanelsLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MainPanelsLayout />)
    }).not.toThrow()
  })
})
