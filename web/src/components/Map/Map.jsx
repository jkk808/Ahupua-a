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
import L, { LatLng } from 'leaflet'
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import './Map.css'
import ahupuaaData from './data/Ahupuaa.json'
import zonesData from './data/Projects.json'
import ResetViewControl from '../ResetViewControl/ResetViewControl'
import { set } from '@redwoodjs/forms'

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

const Map = () => {
  const mapRef = useRef(null)
  const geoJSONRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const center = [21.4389, -158]
  const zoom = 10.5
  const [isZooming, setIsZooming] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  // Create custom panes when the map is ready
  const onMapLoad = (map) => {
    if (!map.getPane('projectsPane')) {
      map.createPane('projectsPane');
      map.getPane('projectsPane').style.zIndex = 650;
    }
    if (!map.getPane('ahupuaaPane')) {
      map.createPane('ahupuaaPane');
      map.getPane('ahupuaaPane').style.zIndex = 400;
    }
  }

  // Convert projects to GeoJSON format for rendering
  const projectsGeoJSON = useMemo(() => ({
    type: "FeatureCollection",
    features: zonesData.projects.map(project => ({
      type: "Feature",
      geometry: project.polygon.geometry,
      properties: {
        id: project.id,
        name: project.name,
        zoom: project.zoom
      }
    }))
  }), []);

  // Get all sensors from all projects
  const sensors = useMemo(() =>
    zonesData.projects.flatMap(project =>
      project.patches.flatMap(patch =>
        patch.sensors.map(sensor => ({
          ...sensor,
          projectName: project.name,
          patchName: patch.name
        }))
      )
    ), []
  );

  const zoomToFeature = (e) => {
    const map = mapRef.current
    if (map) {
      console.log('Zooming to ahupuaa:', e.layer.feature.properties.ahupuaa)
      map.fitBounds(e.layer.getBounds())
    }
  }

  const highlightFeature = (layer) => {
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

  const resetHighlight = (layer) => {
    const geoJSON = geoJSONRef.current
    geoJSON.resetStyle(layer)
    setSelected(null)
  }

  const handleProjectClick = (project, e) => {
    if (e) {
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();
      L.DomEvent.stopPropagation(e);
      L.DomEvent.stop(e);
    }

    const map = mapRef.current;
    if (map) {
      console.log('Clicked project:', project);
      setIsZooming(true);
      setActiveLayer('projects');

      const bounds = L.geoJSON({
        type: "Feature",
        geometry: project.geometry
      }).getBounds();

      map.fitBounds(bounds);
      map.setZoom(project.properties.zoom);

      // Reset zooming state after animation
      setTimeout(() => {
        setIsZooming(false);
      }, 1000);
    }
  }

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      zoomSnap={0.1}
      maxZoom={22}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
      whenReady={({ target }) => onMapLoad(target)}
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
          <GeoJSON
            ref={geoJSONRef}
            data={ahupuaaData}
            style={{
              weight: 2,
              color: '#228B22',
              fillColor: '#228B22',
              fill: true,
              fillOpacity: 0.1,
              interactive: !isZooming && activeLayer !== 'projects'
            }}
            pane="ahupuaaPane"
            onEachFeature={(feature, layer) => {
              layer.on({
                click: (e) => {
                  if (isZooming || activeLayer === 'projects') {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  L.DomEvent.stopPropagation(e.originalEvent);
                  console.log('Clicked ahupuaa:', feature.properties.ahupuaa);
                  const map = mapRef.current;
                  if (map) {
                    setIsZooming(true);
                    setActiveLayer('ahupuaa');
                    map.fitBounds(layer.getBounds());
                    setTimeout(() => {
                      setIsZooming(false);
                    }, 1000);
                  }
                  setSelected(feature.properties.ahupuaa);
                },
                mouseover: (e) => {
                  if (isZooming || activeLayer === 'projects') {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  L.DomEvent.stopPropagation(e.originalEvent);
                  console.log('Hovering over ahupuaa:', feature.properties.ahupuaa);
                  layer.setStyle({
                    weight: 5,
                    color: '#228B22',
                    fillOpacity: 0.4,
                  });
                  layer.bindPopup(
                    `<h3>${feature.properties.ahupuaa}</h3>`
                  );
                  setSelected(feature.properties.ahupuaa);
                },
                mouseout: (e) => {
                  if (isZooming || activeLayer === 'projects') {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  L.DomEvent.stopPropagation(e.originalEvent);
                  layer.setStyle({
                    weight: 2,
                    color: '#228B22',
                    fillOpacity: 0.1,
                  });
                  setSelected(null);
                }
              });
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Projects">
          <GeoJSON
            data={projectsGeoJSON}
            style={{
              weight: 3,
              color: '#4CAF50',
              fillColor: '#4CAF50',
              fillOpacity: 0.2,
              interactive: !isZooming
            }}
            pane="projectsPane"
            onEachFeature={(feature, layer) => {
              layer.on({
                click: (e) => {
                  if (isZooming) {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  e.originalEvent.stopPropagation();
                  e.originalEvent.preventDefault();
                  L.DomEvent.stopPropagation(e);
                  L.DomEvent.stop(e);
                  handleProjectClick(feature, e);
                  return false;
                },
                mouseover: (e) => {
                  if (isZooming) {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  L.DomEvent.stopPropagation(e.originalEvent);
                  console.log('Hovering over project:', feature.properties.name);
                  console.log('Project details:', feature);
                  layer.setStyle({
                    weight: 5,
                    color: '#4CAF50',
                    fillOpacity: 0.4,
                  });
                  layer.bindPopup(
                    `<h3>${feature.properties.name}</h3>
                    <button class="border border-gray-200 drop-shadow-sm w-full text-center px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors" onclick="window.location.href='/sensor/${feature.properties.id}'">
                      View Project
                    </button>`
                  );
                },
                mouseout: (e) => {
                  if (isZooming) {
                    L.DomEvent.stop(e);
                    return false;
                  }
                  L.DomEvent.stopPropagation(e.originalEvent);
                  layer.setStyle({
                    weight: 3,
                    color: '#4CAF50',
                    fillOpacity: 0.2,
                  });
                }
              });
            }}
          />
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
                    <p>Project: {sensor.projectName}</p>
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

export default Map
