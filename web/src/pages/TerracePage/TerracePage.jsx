// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TerracePage = () => {
  return (
    <>
      <Metadata title="Terrace" description="Terrace page" />

      <h1>TerracePage</h1>
      <p>
        Find me in <code>./web/src/pages/TerracePage/TerracePage.jsx</code>
      </p>
      {/*
           My default route is named `terrace`, link to me with:
           `<Link to={routes.terrace()}>Terrace</Link>`
        */}
    </>
  )
}

export default TerracePage
