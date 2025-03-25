// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import GraphCell from 'src/components/Graph/GraphCell'
const WaterPage = () => {
  return (
    <>
      <Metadata title="Water" description="Water page" />

      <h1>WaterPage</h1>
      <p>
        Find me in <code>./web/src/pages/WaterPage/WaterPage.jsx</code>
      </p>
      <GraphCell id={1} type={"temp"}/>
      <GraphCell id={2} type={"temp"}/>
    </>
  )
}

export default WaterPage
