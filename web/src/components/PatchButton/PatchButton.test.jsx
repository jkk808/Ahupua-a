import { render } from '@redwoodjs/testing/web'

import PatchButton from './PatchButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PatchButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PatchButton />)
    }).not.toThrow()
  })
})
