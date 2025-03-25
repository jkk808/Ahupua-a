// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const WaterPage = () => {
  return (
    <>
      <Metadata title="Water" description="Water page" />

      <h1>WaterPage</h1>
      <p>
        Find me in <code>./web/src/pages/WaterPage/WaterPage.jsx</code>
      </p>
      {/*
           My default route is named `water`, link to me with:
           `<Link to={routes.water()}>Water</Link>`
        */}
    </>
  )
}

export default WaterPage
