import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata title="About" description="About page" />

      <h1>About Page</h1>
      <Link to={routes.home()}>Return Home</Link>
    </>
  )
}

export default AboutPage
