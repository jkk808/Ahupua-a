import { Link, routes } from '@redwoodjs/router'

const MainPanelLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>Tesst</h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainPanelLayout
