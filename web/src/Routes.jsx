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
import MainPanelLayout from './layouts/MainPanelsLayout/MainPanelsLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainPanelLayout} title="Sensors" titleTo="sensors" buttonLabel="New Sensor" buttonTo="newSensor">
        <Route path="/water" page={WaterPage} name="water" />
        <Route path="/" page={HomePage} name="home" />
        <Route path="/sensors/new" page={SensorNewSensorPage} name="newSensor" />
        <Route path="/sensors/{id:Int}/edit" page={SensorEditSensorPage} name="editSensor" />
        <Route path="/sensors/{id:Int}" page={SensorSensorPage} name="sensor" />
        <Route path="/sensors" page={SensorSensorsPage} name="sensors" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
