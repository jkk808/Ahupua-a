import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata title="About" description="About page" />

      <p>
        test about page
      </p>
      <Link to={routes.home()}>Return Home</Link>
    </>
  )
}

export default AboutPage
