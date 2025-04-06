import { render } from '@redwoodjs/testing/web'

import SensorHealthPage from './SensorHealthPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SensorHealthPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SensorHealthPage />)
    }).not.toThrow()
  })
})
