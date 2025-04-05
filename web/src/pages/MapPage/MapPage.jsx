import { Suspense, lazy } from 'react';
import Map from 'src/components/Map/Map';

const MapPage = () => {
  return (
    <div className='@container'>
      <Suspense fallback={<div>Loading map...</div>}>
        <Map />
      </Suspense>
    </div>
  )
}

export default MapPage
