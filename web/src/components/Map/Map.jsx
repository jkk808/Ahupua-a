import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@redwoodjs/web'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Circle, LayerGroup, FeatureGroup, Rectangle, useMap, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import ahupuaaData from './data/Ahupuaa.json'

const Map = () => {
  const mapRef = useRef(null);
  const center = [21.4389, -158];

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={10.5}
      zoomSnap={0.1}
      style={{ height: '100vh', width: '100%' }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Satellite (Google)" checked>
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s,p&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street (Google)">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Ahupuaa" checked>
          <FeatureGroup>
            <GeoJSON
              data={ahupuaaData}
              style={{
                weight: 2,
                fill: true,
                fillOpacity: 0.1
              }}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(
                  `<div>
                    <h3>${feature.properties.ahupuaa}</h3>
                  </div>`
                );
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Sensor Stations">
          <LayerGroup>
            {/* Add logic here to generate station markers */}
            <Circle
              center={center}
              pathOptions={{ fillColor: 'blue' }}
              radius={400}
              fill={true}
              fillOpacity={1}
              stroke={false}
            />
          </LayerGroup>
        </LayersControl.Overlay>

      </LayersControl>
    </MapContainer>
  )
}

export default Map
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// // Fix for default marker icons in leaflet
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: new URL(
//     'leaflet/dist/images/marker-icon-2x.png',
//     import.meta.url
//   ).href,
//   iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
//   shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)
//     .href,
// })

// // Create custom icon for user location
// const userIcon = new L.Icon({
//   iconUrl: './user.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [35, 21],
//   iconAnchor: [17.5, 21],
//   popupAnchor: [0, -21],
//   shadowSize: [0, 0],
//   shadowAnchor: [12, 41],
//   shadowPopupAnchor: [1, -34],
// })

// // Create custom icon for sensors
// const sensorIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -41],
//   shadowSize: [41, 41],
//   shadowAnchor: [12, 41],
//   shadowPopupAnchor: [1, -34],
// })

// const GET_SENSORS = gql`
//   query GetSensors {
//     sensors {
//       id
//       name
//       location
//       latitude
//       longitude
//       metrics {
//         id
//         value
//         type
//         timestamp
//       }
//     }
//   }
// `

// const Map = () => {
//   const [error, setError] = useState(null)
//   const [isMapReady, setIsMapReady] = useState(false)
//   const mapRef = useRef(null)
//   const markerRef = useRef(null)
//   const mapContainerRef = useRef(null)
//   const { data, loading, error: queryError } = useQuery(GET_SENSORS)

//   // Initialize map
//   useEffect(() => {
//     let mounted = true
//     let map = null
//     let initTimeout = null

//     const initMap = () => {
//       try {
//         if (!mapContainerRef.current) {
//           console.log('Container not found, retrying...')
//           return
//         }

//         // Ensure the container is in the DOM and has dimensions
//         if (!document.body.contains(mapContainerRef.current)) {
//           console.log('Container not in DOM, retrying...')
//           return
//         }

//         const container = mapContainerRef.current
//         if (!container.offsetWidth || !container.offsetHeight) {
//           console.log('Container has no dimensions, retrying...')
//           return
//         }

//         console.log('Initializing map with container:', container)

//         // Initialize map with Oahu's center coordinates
//         map = L.map(container).setView([21.4735, -157.965], 11.2)

//         // Use Carto's tiles for a cleaner look
//         L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           subdomains: 'abcd',
//           maxZoom: 20
//         }).addTo(map)

//         // Store map reference
//         mapRef.current = map
//         console.log('Map initialized and stored in ref:', map)

//         // Set map as ready immediately after initialization
//         setIsMapReady(true)
//         console.log('Map ready state set to true')
//       } catch (err) {
//         console.error('Map initialization error:', err)
//         setError('Failed to initialize map')
//       }
//     }

//     // Initialize map after a short delay
//     initTimeout = setTimeout(initMap, 100)

//     return () => {
//       mounted = false
//       if (initTimeout) {
//         clearTimeout(initTimeout)
//       }
//       if (map) {
//         map.remove()
//       }
//     }
//   }, []) // Only run once on mount

//   // Get user location immediately
//   useEffect(() => {
//     if (!mapRef.current || !isMapReady) {
//       console.log('Map not ready for user location:', {
//         mapRef: !!mapRef.current,
//         isMapReady
//       })
//       return
//     }

//     const map = mapRef.current
//     console.log('Adding user location to map')

//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           if (!mapRef.current) {
//             console.log('Map reference lost while getting location')
//             return
//           }

//           const { latitude, longitude } = position.coords
//           console.log('User location received:', latitude, longitude)

//           // Remove existing user marker if any
//           if (markerRef.current) {
//             map.removeLayer(markerRef.current)
//           }

//           // Add marker at user's location with custom icon
//           markerRef.current = L.marker([latitude, longitude], {
//             icon: userIcon,
//           })
//             .bindPopup('Your current location')
//             .addTo(map)

//           console.log('User location marker added successfully')
//         },
//         (error) => {
//           console.error('Location error:', error)
//           setError(
//             'Unable to get your location. Please enable location services.'
//           )
//         }
//       )
//     } else {
//       setError('Geolocation is not supported by your browser')
//     }
//   }, [mapRef.current, isMapReady]) // Run when map is initialized and ready

//   // Add sensor markers when data is available and map is ready
//   useEffect(() => {
//     console.log('Sensor data received:', data?.sensors)
//     console.log('Map ready status:', isMapReady)
//     console.log('Map reference:', mapRef.current)

//     if (!mapRef.current || !data?.sensors || !isMapReady) {
//       console.log('Map, data, or ready status not available:', {
//         mapRef: !!mapRef.current,
//         sensors: !!data?.sensors,
//         isMapReady
//       })
//       return
//     }

//     const map = mapRef.current
//     console.log('Adding markers to map:', map)

//     // Force a map resize before adding markers
//     map.invalidateSize()

//     // Clear existing markers if any
//     map.eachLayer((layer) => {
//       if (layer instanceof L.Marker && layer !== markerRef.current) { // Don't remove user marker
//         console.log('Removing existing marker:', layer)
//         map.removeLayer(layer)
//       }
//     })

//     // Add markers immediately without delay
//     data.sensors.forEach((sensor) => {
//       console.log('Processing sensor:', {
//         name: sensor.name,
//         location: sensor.location,
//         lat: sensor.latitude,
//         lng: sensor.longitude,
//         metrics: sensor.metrics
//       })

//       // Validate coordinates
//       if (!sensor.latitude || !sensor.longitude) {
//         console.error('Invalid coordinates for sensor:', sensor.name)
//         return
//       }

//       const content = `
//         <div style="padding: 10px;">
//           <h3>${sensor.name || 'Unnamed Sensor'}</h3>
//           <p>Location: ${sensor.location || 'No location specified'}</p>
//           ${sensor.metrics && sensor.metrics.length > 0
//             ? sensor.metrics.map(metric => `
//                 <p>${metric.type}: ${metric.value}</p>
//               `).join('')
//             : '<p>No metrics available</p>'
//           }
//           <button onclick="window.open('https://www.google.com/maps?q=${sensor.latitude},${sensor.longitude}', '_blank')">
//             View on Google Maps
//           </button>
//         </div>
//       `

//       try {
//         console.log('Creating marker at coordinates:', [sensor.latitude, sensor.longitude])
//         const marker = L.marker([sensor.latitude, sensor.longitude], {
//           icon: sensorIcon
//         })
//           .bindPopup(content, {
//             maxWidth: 300,
//             className: 'custom-popup',
//           })
//           .addTo(map)

//         console.log('Successfully added marker for sensor:', sensor.name)
//         console.log('Marker position:', marker.getLatLng())
//         console.log('Marker visible:', marker.getElement()?.style.display !== 'none')
//       } catch (error) {
//         console.error('Error adding marker for sensor:', sensor.name, error)
//       }
//     })
//   }, [data, isMapReady])

//   // Log any query errors but don't block the map
//   useEffect(() => {
//     if (queryError) {
//       console.error('GraphQL query error:', queryError)
//       // Don't set error state, just log it
//     }
//   }, [queryError])

//   if (loading) {
//     return <div className="map-wrapper">Loading map data...</div>
//   }

//   return (
//     <div className="map-wrapper" style={{ width: '100%' }}>
//       <div
//         ref={mapContainerRef}
//         className="map-container"
//         style={{
//           width: '100%',
//           touchAction: 'none',
//         }}
//       />
//       {error && (
//         <div className="map-error">
//           {error}
//         </div>
//       )}
//     </div>
//   )
// }

// // Add this CSS to ensure the map container has proper dimensions
// const styles = `
//   .map-wrapper {
//     position: relative;
//     width: 100%;
//   }
//   .map-container {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     z-index: 1;
//   }
//   .map-error {
//     position: absolute;
//     top: 10px;
//     left: 10px;
//     z-index: 2;
//     background: white;
//     padding: 10px;
//     border-radius: 4px;
//     box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//   }
// `

// // Add the styles to the document
// const styleSheet = document.createElement("style")
// styleSheet.innerText = styles
// document.head.appendChild(styleSheet)

// export default Map
