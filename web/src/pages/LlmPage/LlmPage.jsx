// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const LlmPage = () => {
  return (
    <>
      <Metadata title="Llm" description="Llm page" />

      <h1>LlmPage</h1>
      <p>
        Find me in <code>./web/src/pages/LlmPage/LlmPage.jsx</code>
      </p>

      <div></div>
      {/*
           My default route is named `llm`, link to me with:
           `<Link to={routes.llm()}>Llm</Link>`
        */}
    </>
  )
}

export default LlmPage
