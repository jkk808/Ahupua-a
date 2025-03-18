// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Sensors" titleTo="sensors" buttonLabel="New Sensor" buttonTo="newSensor">
        <Route path="/sensors/new" page={SensorNewSensorPage} name="newSensor" />
        <Route path="/sensors/{id:Int}/edit" page={SensorEditSensorPage} name="editSensor" />
        <Route path="/sensors/{id:Int}" page={SensorSensorPage} name="sensor" />
        <Route path="/sensors" page={SensorSensorsPage} name="sensors" />
      </Set>
      <Route path="/home" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
