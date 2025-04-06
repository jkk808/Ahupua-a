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
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import './EditMap.css'
import ahupuaaData from './data/Ahupuaa.json'
import zonesData from './data/Zones.json'
import ResetViewControl from '../ResetViewControl/ResetViewControl'
import { set } from '@redwoodjs/forms'
import L from 'leaflet'

const Info = ({ position, selected }) => {
  // NOTE: This is a hardcoded value for the number of sensors
  const numSenors = selected ? selected.length : 0
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }

  console.log('selected', selected)

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

const EditMap = () => {
  const mapRef = useRef(null)
  const geoJSONRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const center = [21.4389, -158]
  // const center = [21.339669, -157.745865] //coord for the Nation of Hawaii
  const zoom = 10.5

  const zoomToFeature = (e) => {
    const map = mapRef.current
    if (map) {
      console.log('Zooming to ahupuaa')
      map.fitBounds(e.target.getBounds())
    }
  }

  const highlightFeature = (e) => {
    const layer = e.target
    layer.setStyle({
      weight: 5,
      color: '#228B22',
      dashArray: '',
      fillOpacity: 0.4,
    })

    // Updating the selected ahupuaa
    setSelected(layer.feature.properties.ahupuaa)

    // Bring the layer to the front, so that outlines is not hidden
    layer.bringToFront()
  }

  const resetHighlight = (e) => {
    const geoJSON = geoJSONRef.current
    geoJSON.resetStyle(e.target)
    setSelected(null)
  }

  const handleProjectClick = (project) => {
    const map = mapRef.current
    if (map) {
      console.log('Clicked zone type: zone')
      console.log('Clicked zone:', project)
      const bounds = L.geoJSON({
        type: "Feature",
        geometry: project.geometry
      }).getBounds()
      map.fitBounds(bounds)
      map.setZoom(project.properties.zoom)
    }
  }

  // Convert zones to GeoJSON format for rendering
  const zonesGeoJSON = {
    type: "FeatureCollection",
    features: zonesData.zones.map(zone => ({
      type: "Feature",
      geometry: zone.polygon.geometry,
      properties: {
        id: zone.id,
        name: zone.name,
        zoom: zone.zoom
      }
    }))
  }

  // Get all sensors from all zones
  const sensors = zonesData.zones.flatMap(zone =>
    zone.patches.flatMap(patch =>
      patch.sensors.map(sensor => ({
        ...sensor,
        zoneName: zone.name,
        patchName: patch.name
      }))
    )
  )

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      zoomSnap={0.1}
      maxZoom={25}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            rectangle: false
          }}
        />
      </FeatureGroup>
      <ResetViewControl
        center={center}
        zoom={zoom}
      />
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Satellite (Google)" checked>
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s,p&x={x}&y={y}&z={z}"
            maxNativeZoom={40}
            maxZoom={40}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street (Google)">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxNativeZoom={30}
            maxZoom={40}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Ahupuaa" checked>
          <FeatureGroup>
            <GeoJSON
              ref={geoJSONRef}
              data={ahupuaaData}
              style={{
                weight: 2,
                fill: true,
                fillOpacity: 0.1,
                interactive: true,
                zIndex: 1
              }}
              eventHandlers={{
                click: (e) => {
                  console.log('Zooming to ahupuaa:', e.layer.feature.properties.ahupuaa);
                  zoomToFeature(e);
                },
                mouseover: (e) => highlightFeature(e.layer),
                mouseout: (e) => resetHighlight(e.layer)
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Zones">
          <FeatureGroup>
            <GeoJSON
              data={zonesGeoJSON}
              style={{
                weight: 3,
                color: '#4CAF50',
                fillColor: '#4CAF50',
                fillOpacity: 0.2,
                interactive: true,
                zIndex: 2
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent);
                  handleProjectClick(e.layer.feature);
                },
                mouseover: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent);
                  const layer = e.layer;
                  console.log('Hovering over zone:', e.layer.feature.properties.name);
                  console.log('Zone details:', e.layer.feature);
                  layer.setStyle({
                    weight: 5,
                    color: '#4CAF50',
                    fillOpacity: 0.4,
                  });
                  layer.bindPopup(
                    `<h3>${e.layer.feature.properties.name}</h3>
                    <button class="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="window.location.href='/sensor/${e.layer.feature.properties.id}'">
                      View Zone
                    </button>`
                  ).openPopup();
                },
                mouseout: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent);
                  const layer = e.layer;
                  layer.setStyle({
                    weight: 3,
                    color: '#4CAF50',
                    fillOpacity: 0.2,
                  });
                }
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Sensor Stations">
          <LayerGroup>
            {sensors.map((sensor, index) => (
              <Marker
                key={index}
                position={[sensor.latitude, sensor.longitude]}
              >
                <Popup>
                  <div>
                    <h3>{sensor.name}</h3>
                    <p>Zone: {sensor.zoneName}</p>
                    <p>Patch: {sensor.patchName}</p>
                    <p>{sensor.metadata.description}</p>
                    <p>Latest Value: {sensor.data[sensor.data.length - 1].value} {sensor.metadata.unit}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Info position="bottomleft" selected={selected} />
    </MapContainer>
  )
}

export default EditMap