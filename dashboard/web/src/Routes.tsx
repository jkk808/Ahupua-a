// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

// import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import MainPanelLayout from './layouts/MainPanelsLayout/MainPanelsLayout'


const Routes = () => {
  return (
    <Router>
      <Set wrap={MainPanelLayout}>        
        <Route path="/" page={HomePage} name="home" />      
        <Route path="/about" page={AboutPage} name="about" />        
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
