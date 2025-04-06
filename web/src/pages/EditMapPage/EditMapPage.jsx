import { Suspense, lazy } from 'react';
import EditMap from 'src/components/EditMap/EditMap';

const EditMapPage = () => {
  return (
    <div className='@container h-full'>
      <Suspense fallback={<div>Loading map...</div>}>
        <EditMap />
      </Suspense>
    </div>
  )
}

export default EditMapPage
