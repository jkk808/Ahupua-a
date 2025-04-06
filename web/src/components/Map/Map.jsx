import { useEffect, useState, useRef, useMemo } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import {
  MapContainer,
  TileLayer,
  Popup,
  LayersControl,
  Marker,
  LayerGroup,
  FeatureGroup,
  GeoJSON,
  CircleMarker,
} from 'react-leaflet'
import { LatLng } from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import './Map.css'
import ahupuaaData from './data/Ahupuaa.json'
import zonesData from './data/Projects.json'
import ResetViewControl from '../ResetViewControl/ResetViewControl'
import { set } from '@redwoodjs/forms'
import { use } from 'react'
import './SmoothWheelZoom.js'

const Info = ({ position, selected }) => {
  // NOTE: This is a hardcoded value for the number of sensors
  const numSenors = selected ? selected.length : 0
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">
        <div className="info">
          <h4>Ahupuaa Summary</h4>
          <div className="info-content">
            {selected ? (
              <div>
                <p>Name: {selected}</p>
                <p>Number of Sensor: {numSenors}</p>
              </div>
            ) : (
              <h3>Click on an Ahupuaa to show more information</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Map = () => {
  const mapRef = useRef(null)
  const geoJSONRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const project = useRef(null)
  const ahupuaa = useRef(null)

  const center = [21.4389, -158]
  // const center = [21.339669, -157.745865] //coord for the Nation of Hawaii
  const zoom = useRef(10.5)

  useEffect(() => {
    const map = mapRef.current
    if (map) {
      map.on('zoom', () => {
        if (zoom.current > map.getZoom()) {
          // Check if the selected ahupuaa is still in view

          if (ahupuaa.current) {
            const bounds = ahupuaa.current.getBounds()
            const mapBounds = map.getBounds()
            if (!mapBounds.intersects(bounds)) {
              // The ahupuaa is not in view
              ahupuaa.current = null
              project.current = null
            }
            else {
              // The ahupuaa is in view

              // Calculate the area of the ahupuaa and the map
              // ahupuaa points
              const x1 = bounds._southWest.lng
              const y1 = bounds._southWest.lat
              const x2 = bounds._northEast.lng
              const y2 = bounds._northEast.lat

              // map points
              const x3 = mapBounds._southWest.lng
              const y3 = mapBounds._southWest.lat
              const x4 = mapBounds._northEast.lng
              const y4 = mapBounds._northEast.lat

              const intersectArea = (Math.min(x2, x4) - Math.max(x1, x3)) * (Math.min(y2, y4) - Math.max(y1, y3))
              const mapArea = (x4 - x3) * (y4 - y3)

              const percentInView = (intersectArea / mapArea) * 100

              if (percentInView < 40) {
                ahupuaa.current = null
                project.current = null
              }
            }
          }
        }

        zoom.current = map.getZoom()
      })
    }
  }, [mapRef.current])

  const zoomToFeature = (e) => {
    const map = mapRef.current
    if (map) {
      const layer = e.target
      if (project.current == null && ahupuaa.current != layer) {
        map.fitBounds(e.target.getBounds())
      }
      layer.setStyle({
        weight: 2,
        fill: true,
        fillOpacity: 0,
        color: '#3185f9',
      })

      ahupuaa.current = layer
    }
  }

  const highlightFeature = (e) => {
    const layer = e.target
    if (project.current === null) {
      layer.setStyle({
        weight: 2,
        color: '#228B22',
        fill: true,
        fillOpacity: 0.3,
      })
    }

    // Upding the selected ahupuaa
    setHovered(layer.feature.properties.ahupuaa)

    // Bring the layer to the front, so that outlines is not hidden
    layer.bringToFront()
  }

  const resetHighlight = (e) => {
    const layer = e.target

    layer.setStyle({
      weight: 2,
      fill: true,
      fillOpacity: 0,
      color: '#3185f9',
    })

    setHovered(null)
  }

  const handleMarkerClick = (zone) => {
    const map = mapRef.current
    if (map) {
      const coord = [zone.latitude, zone.longitude]
      map.setView(coord, zone.zoom)
      project.current = zone.name
    }
  }

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom.current}
      zoomSnap={0.01}
      maxZoom={22}
      scrollWheelZoom={false}
      smoothWheelZoom={true}
      smoothSensitivity={1}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
          }}
        />
      </FeatureGroup>
      <ResetViewControl center={center} zoom={zoom.current} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Satellite (Google)" checked>
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s,p&x={x}&y={y}&z={z}"
            maxNativeZoom={22}
            maxZoom={22}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street (Google)">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxNativeZoom={22}
            maxZoom={22}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Ahupuaa" checked>
          <FeatureGroup>
            <GeoJSON
              ref={geoJSONRef}
              data={ahupuaaData}
              onEachFeature={(feature, layer) => {
                layer.setStyle({
                  weight: 2,
                  fill: true,
                  fillOpacity: 0,
                  color: '#3185f9',
                })
                layer.on({
                  click: zoomToFeature,
                  mouseover: highlightFeature,
                  mouseout: resetHighlight,
                })
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Sensor Stations">
          <LayerGroup>
            {/* Based on the focused ahupuaa, shows the sensor stations associated with it*/}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Zones">
          <LayerGroup>
            {zonesData.projects.map((project, index) => (
              <Marker
                key={index}
                color="green"
                position={[project.latitude, project.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(project),
                  mouseover: (e) => e.target.openPopup(),
                }}
              >
                <Popup>
                  <h3>{project.name}</h3>
                  <Link routes={routes.sensor({ id: project.id })}>
                    <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center drop-shadow-sm transition-colors hover:bg-gray-50">
                      View Sensor
                    </button>
                  </Link>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Info position="bottomleft" selected={hovered} />
    </MapContainer>
  )
}

export default Map
