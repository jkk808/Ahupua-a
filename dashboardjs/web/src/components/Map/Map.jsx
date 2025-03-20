import { useEffect, useState, useRef } from 'react'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    'leaflet/dist/images/marker-icon-2x.png',
    import.meta.url
  ).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)
    .href,
})

// Create custom icon for user location
const userIcon = new L.Icon({
  iconUrl: './user.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [35, 21],
  iconAnchor: [17.5, 21],
  popupAnchor: [0, -21],
  shadowSize: [0, 0],
  shadowAnchor: [12, 41],
  shadowPopupAnchor: [1, -34],
})

// Sample data for Oahu locations

// TODO: Replace with data from backend(GraphQL)
const sampleLocations = [
  {
    position: [21.3069, -157.8583], // Waikiki Beach
    title: 'Waikiki Loʻi',
    content: `
      <div style="padding: 10px;">
        <h3>Waikiki Loʻi</h3>
        <p>Ocygen Level: 80.. Status: Good</p>
        <button onclick="window.open('https://www.gohawaii.com/islands/oahu/regions/honolulu/waikiki', '_blank')">
          Learn More
        </button>
      </div>
    `,
  },
  {
    position: [21.3724, -157.7106], // Kailua Beach
    title: 'Maunawili',
    content: `
      <div style="padding: 10px;">
        <h3>Maunawili</h3>
        <p>Maunawili is celebrated in story and chant for its association with Akua (gods), Aliʻi (chiefs), cultural heroes, and important historical figures, including Queen Liliʻuokalani. Ancient and historic sites throughout Maunawili include heiau (temple or sacred site), sacred stones, petroglyphs, Hawaiian burials, alanui (path or trail), house sites, grinding stones, irrigated and dryland agricultural terraces, large ʻauwai (irrigation ditches) related to extensive loʻi (taro patches), and 19th and early 20th century structures related to agriculture and food production.</p>
        <button onclick="window.open('https://www.huimaunawilikawainui.com/about-maunawili', '_blank')">
          Learn More
        </button>
      </div>
    `,
  },
]

const Map = () => {
  const [error, setError] = useState(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapContainerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    let map = null

    const initMap = () => {
      try {
        if (!mapContainerRef.current) {
          console.log('Container not found, retrying...')
          return
        }

        // Initialize map with Oahu's center coordinates
        map = L.map(mapContainerRef.current, {
          center: [21.4735, -157.965], // Center of Oahu
          zoom: 10, // Closer zoom to show Oahu
          zoomControl: true,
          attributionControl: true,
        })
        mapRef.current = map

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Get user location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!mounted) return

              const { latitude, longitude } = position.coords
              console.log('User location:', latitude, longitude)

              // Add marker at user's location with custom icon
              markerRef.current = L.marker([latitude, longitude], {
                icon: userIcon,
              })
                .bindPopup('Your current location')
                .addTo(map)
            },
            (error) => {
              if (!mounted) return
              console.error('Location error:', error)
              setError(
                'Unable to get your location. Please enable location services.'
              )
            }
          )
        } else {
          setError('Geolocation is not supported by your browser')
        }

        // Add predefined location markers
        sampleLocations.forEach((location) => {
          L.marker(location.position)
            .bindPopup(location.content, {
              maxWidth: 300,
              className: 'custom-popup',
            })
            .addTo(map)
        })
      } catch (err) {
        console.error('Map initialization error:', err)
        setError('Failed to initialize map')
      }
    }

    // Initialize map
    initMap()

    // Cleanup
    return () => {
      mounted = false
      if (map) {
        map.remove()
      }
    }
  }, [])

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    />
  )
}

export default Map
