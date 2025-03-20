import { Suspense, lazy } from 'react'
import './MapPage.css'

const Map = lazy(() => import('src/components/Map/Map'))

const MapPage = () => {
  return (
    <div className="map-container">
      <Suspense fallback={<div>Loading map...</div>}>
        <Map />
      </Suspense>
    </div>
  )
}

export default MapPage
