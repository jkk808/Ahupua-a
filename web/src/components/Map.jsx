import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@redwoodjs/web'

// Declare L as a global to satisfy TypeScript/ESLint
/* global L */

// Initialize map with Oahu's center coordinates
map = L.map(container, {
  center: [21.4735, -157.965], // Center of Oahu
  zoom: 11.2, // Closer zoom to show Oahu
  zoomControl: true,
  attributionControl: true,
  dragging: true,
  tap: true,
  scrollWheelZoom: true
})

// Create tile layer with specific options for better performance
const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20,
  updateWhenIdle: false,
  updateWhenZooming: true,
  keepBuffer: 2,
  maxNativeZoom: 19,
  reuseTiles: true
}).addTo(map)

// Add event listeners for continuous updates during movement
map.on('move', () => {
  tileLayer.redraw()
})

map.on('movestart', () => {
  container.style.pointerEvents = 'none'
})

map.on('moveend', () => {
  container.style.pointerEvents = 'auto'
  map.invalidateSize()
  tileLayer.redraw()
})

// Force map to recalculate size and position after initialization
setTimeout(function() {
  map.invalidateSize(true)
}, 500)

// Store map reference
mapRef.current = map
console.log('Map initialized and stored in ref:', map)

// Set map as ready immediately after initialization
setIsMapReady(true)
console.log('Map ready state set to true')

// Add event listeners for map movement
map.on('moveend', () => {
  map.invalidateSize()
  const mapContainer = map.getContainer()
  if (mapContainer) {
    mapContainer.style.height = mapContainer.offsetHeight + 'px'
    map.invalidateSize()
  }
})

map.on('dragend', () => {
  map.invalidateSize()
})

// Alternative: Use Carto's tiles

// Create custom icon for user location
const userIcon = {
  iconUrl: './user.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [35, 21],
  iconAnchor: [17.5, 21],
  popupAnchor: [0, -21],
  shadowSize: [0, 0],
  shadowAnchor: [12, 41],
  shadowPopupAnchor: [1, -34],
}

// Create custom icon for sensors
const sensorIcon = {
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  shadowPopupAnchor: [1, -34],
}

const Map = () => {
  const [error, setError] = useState(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [userIconInstance, setUserIconInstance] = useState(null)
  const [sensorIconInstance, setSensorIconInstance] = useState(null)
  const { data, loading, error: queryError } = useQuery(GET_SENSORS)

  // Initialize icons when Leaflet is loaded
  useEffect(() => {
    if (window.L) {
      setUserIconInstance(new L.Icon(userIcon))
      setSensorIconInstance(new L.Icon(sensorIcon))
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!window.L || !userIconInstance || !sensorIconInstance) {
      return // Wait for Leaflet and icons to be ready
    }

    let mounted = true
    let map = null
    let initTimeout = null

    const initMap = () => {
      try {
        if (!mapContainerRef.current) {
          console.log('Container not found, retrying...')
          return
        }

        map = L.map(container, {
          center: [21.4735, -157.965], // Center of Oahu
          zoom: 11.2, // Closer zoom to show Oahu
          zoomControl: true,
          attributionControl: true,
          dragging: true,
          tap: true,
          scrollWheelZoom: true
        })

        // Create tile layer with specific options for better performance
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
          updateWhenIdle: false,
          updateWhenZooming: true,
          keepBuffer: 2,
          maxNativeZoom: 19,
          reuseTiles: true
        }).addTo(map)

        // Add event listeners for continuous updates during movement
        map.on('move', () => {
          tileLayer.redraw()
        })

        map.on('movestart', () => {
          container.style.pointerEvents = 'none'
        })

        map.on('moveend', () => {
          container.style.pointerEvents = 'auto'
          map.invalidateSize()
          tileLayer.redraw()
        })

        // Force map to recalculate size and position after initialization
        setTimeout(function() {
          map.invalidateSize(true)
        }, 500)

        // Store map reference
        mapRef.current = map
        console.log('Map initialized and stored in ref:', map)

        // Set map as ready immediately after initialization
        setIsMapReady(true)
        console.log('Map ready state set to true')

        // Add event listeners for map movement
        map.on('moveend', () => {
          map.invalidateSize()
          const mapContainer = map.getContainer()
          if (mapContainer) {
            mapContainer.style.height = mapContainer.offsetHeight + 'px'
            map.invalidateSize()
          }
        })

        map.on('dragend', () => {
          map.invalidateSize()
        })

        // Alternative: Use Carto's tiles

        // Create custom icon for user location
        const userIcon = {
          iconUrl: './user.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [35, 21],
          iconAnchor: [17.5, 21],
          popupAnchor: [0, -21],
          shadowSize: [0, 0],
          shadowAnchor: [12, 41],
          shadowPopupAnchor: [1, -34],
        }

        // Create custom icon for sensors
        const sensorIcon = {
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -41],
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
          shadowPopupAnchor: [1, -34],
        }
      } catch (e) {
        console.error('Error initializing map:', e)
      }
    }

    initMap()

    return () => {
      mounted = false
      if (initTimeout) {
        clearTimeout(initTimeout)
      }
    }
  }, [userIconInstance, sensorIconInstance])

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }}>
      {/* Map content will be rendered here */}
    </div>
  )
}

export default Map