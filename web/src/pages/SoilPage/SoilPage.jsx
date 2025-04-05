// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import GraphCell from 'src/components/Graph/GraphCell'

const SoilPage = () => {
  return (
    <>
      <Metadata title="Soil" description="Soil page" />

      <h1>SoilPage</h1>
      <p>
        Find me in <code>./web/src/pages/SoilPage/SoilPage.jsx</code>
      </p>
      <GraphCell type='s_ph'></GraphCell>

    </>
  )
}

export default SoilPage
