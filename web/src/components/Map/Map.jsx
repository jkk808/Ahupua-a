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

const Info = ({ position, selected, selectedProject }) => {
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
  const [selectedProject, setSelectedProject] = useState(null)
  const center = [21.4389, -158]
  const zoom = 10.5
  const [isZooming, setIsZooming] = useState(false);
  const [activeLayer, setActiveLayer] = useState('ahupuaa'); // Start with ahupuaa layer active

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
    if (!map.getPane('plotsPane')) {
      map.createPane('plotsPane');
      map.getPane('plotsPane').style.zIndex = 700;
    }
  }

  // Convert projects to GeoJSON format for rendering
  const projectsGeoJSON = useMemo(() => {
    if (!selected || activeLayer !== 'projects') {
      return { type: "FeatureCollection", features: [] };
    }

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) {
      console.log('No matching ahupuaa found for:', selected);
      return { type: "FeatureCollection", features: [] };
    }

    // Check if the ahupuaa has any projects
    if (!selectedAhupuaa.projects?.length) {
      console.log('Selected ahupuaa has no projects:', selected);
      return { type: "FeatureCollection", features: [] };
    }

    const features = selectedAhupuaa.projects
      .filter(project => project.polygon && project.polygon.geometry)
      .map(project => ({
        ...project.polygon,
        properties: {
          ...project.polygon.properties,
          id: project.id,
          name: project.name,
          zoom: project.zoom,
          ahupuaa: selectedAhupuaa.name
        }
      }));

    console.log('Generated project features:', {
      ahupuaa: selected,
      projectCount: features.length,
      features
    });

    return {
      type: "FeatureCollection",
      features
    };
  }, [selected, activeLayer]);

  // Get all plots from projects
  const plotsGeoJSON = useMemo(() => {
    if (!selectedProject) {
      console.log('No project selected, no plots to show');
      return { type: "FeatureCollection", features: [] };
    }

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) {
      console.log('No matching ahupuaa found for plots:', selected);
      return { type: "FeatureCollection", features: [] };
    }

    const selectedProj = selectedAhupuaa.projects.find(p => p.name === selectedProject);
    if (!selectedProj) {
      console.log('No matching project found for plots:', selectedProject);
      return { type: "FeatureCollection", features: [] };
    }

    const features = (selectedProj.plots || [])
      .filter(plot => plot.polygon && plot.polygon.geometry)
      .map(plot => ({
        type: "Feature",
        geometry: plot.polygon.geometry,
        properties: {
          id: plot.id,
          name: plot.name,
          projectId: selectedProj.id,
          projectName: selectedProj.name
        }
      }));

    console.log('Generated plot features:', {
      projectName: selectedProject,
      plotCount: features.length,
      features
    });

    return {
      type: "FeatureCollection",
      features
    };
  }, [selected, selectedProject]);

  // Get all sensors
  const sensors = useMemo(() => {
    if (!selected) return [];

    const selectedAhupuaa = zonesData.ahupuaas.find(a => a.name === selected);
    if (!selectedAhupuaa) return [];

    return selectedAhupuaa.projects.flatMap(project => {
      // Get project-level sensors
      const projectSensors = (project.sensors || []).map(sensor => ({
        ...sensor,
        projectId: project.id,
        projectName: project.name
      }));

      // Get plot-level sensors
      const plotSensors = (project.plots || []).flatMap(plot =>
        (plot.sensors || []).map(sensor => ({
          ...sensor,
          projectId: project.id,
          projectName: project.name,
          plotId: plot.id,
          plotName: plot.name
        }))
      );

      return [...projectSensors, ...plotSensors];
    });
  }, [selected]);

  // Debug effect to log state changes - moved after all useMemo definitions
  useEffect(() => {
    console.log('Layer state changed:', {
      activeLayer,
      selected,
      selectedProject,
      projectsAvailable: projectsGeoJSON.features.length,
      plotsAvailable: plotsGeoJSON.features.length,
      sensorsAvailable: sensors.length,
      isZooming
    });

    // Debug check for unexpected state combinations
    if (activeLayer === 'plots' && !selectedProject) {
      console.warn('Warning: In plots layer but no project selected');
    }
    if (activeLayer === 'projects' && !selected) {
      console.warn('Warning: In projects layer but no ahupuaa selected');
    }
  }, [activeLayer, selected, selectedProject, projectsGeoJSON, plotsGeoJSON, sensors, isZooming]);

  // Effect to handle layer transitions
  useEffect(() => {
    console.log('Layer transition check:', {
      activeLayer,
      isZooming,
      selected,
      selectedProject
    });
  }, [activeLayer, isZooming]);

  const handleAhupuaaClick = (feature, layer, e) => {
    L.DomEvent.stopPropagation(e.originalEvent);

    const ahupuaaName = feature.properties.ahupuaa || feature.properties.name;
    console.log('Starting ahupuaa selection:', {
      name: ahupuaaName,
      currentLayer: activeLayer,
      currentlySelected: selected,
      willResetState: selected !== null
    });

    const ahupuaaData = zonesData.ahupuaas.find(a => a.name === ahupuaaName);
    const hasProjects = ahupuaaData?.projects?.length > 0;

    console.log('Ahupuaa data check:', {
      name: ahupuaaName,
      found: !!ahupuaaData,
      hasProjects,
      projectCount: ahupuaaData?.projects?.length || 0
    });

    const map = mapRef.current;
    if (map) {
      setIsZooming(true);

      // If we're selecting a different ahupuaa, reset state first
      if (selected) {
        console.log('Resetting state for new ahupuaa:', {
          previous: selected,
          new: ahupuaaName
        });
        setSelectedProject(null);
        setSelected(null);
        setActiveLayer('ahupuaa');
      }

      // Get center of the ahupuaa polygon
      const center = layer.getBounds().getCenter();
      console.log('Zooming to new ahupuaa:', {
        name: ahupuaaName,
        center,
        hasProjects,
        willShowProjects: hasProjects
      });

      // Zoom to the ahupuaa center
      map.setView(center, 14);

      // After zoom completes, set the new selection and layer
      setTimeout(() => {
        console.log('Zoom complete, updating state:', {
          name: ahupuaaName,
          willSetActiveLayer: hasProjects,
          newLayer: hasProjects ? 'projects' : 'ahupuaa'
        });
        setSelected(ahupuaaName);
        // Only switch to projects layer if the ahupuaa has projects
        if (hasProjects) {
          setActiveLayer('projects');
        }
        setIsZooming(false);
      }, 1000);
    }
  };

  const handleProjectClick = (feature, layer, e) => {
    if (activeLayer !== 'projects') {
      console.log('Ignoring project click - wrong layer:', activeLayer);
      return;
    }

    if (isZooming) {
      console.log('Ignoring project click - already zooming');
      return;
    }

    L.DomEvent.stopPropagation(e);
    console.log('Zoom operation - Project click:', {
      type: 'project_click',
      name: feature.properties.name,
      destination: layer.getBounds().getCenter(),
      zoomLevel: feature.properties.zoom || 18
    });

    const map = mapRef.current;
    if (map) {
      // Start zoom sequence
      setIsZooming(true);

      // Get center and zoom level
      const center = layer.getBounds().getCenter();
      const zoomLevel = feature.properties.zoom || 18;

      // Set project and start zoom
      setSelectedProject(feature.properties.name);
      map.setView(center, zoomLevel, {
        animate: true,
        duration: 1
      });

      // After zoom completes, switch to plots layer
      setTimeout(() => {
        setActiveLayer('plots');
        setIsZooming(false);
      }, 1000);
    }
  };

  // Effect to monitor zoom state
  useEffect(() => {
    console.log('Zoom state changed:', {
      isZooming,
      activeLayer,
      selectedProject,
      selected
    });
  }, [isZooming]);

  // Effect to monitor project selection
  useEffect(() => {
    if (selectedProject) {
      console.log('Project selection changed:', {
        project: selectedProject,
        activeLayer,
        isZooming
      });
    }
  }, [selectedProject]);

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
            style={(feature) => {
              // Allow interaction with any ahupuaa when in ahupuaa layer
              const isActive = !isZooming;
              return {
                weight: 2,
                color: '#228B22',
                fillColor: '#228B22',
                fill: true,
                fillOpacity: activeLayer === 'ahupuaa' ? 0.1 : 0.02,
                interactive: isActive,
                pointerEvents: isActive ? 'auto' : 'none',
                pane: 'ahupuaaPane',
                className: isActive ? '' : 'pointer-events-none'
              };
            }}
            onEachFeature={(feature, layer) => {
              // First, remove any existing event listeners
              layer.off();

              // Add click handler for all ahupuaa
              if (!isZooming) {
                layer.on({
                  click: (e) => {
                    console.log('Ahupuaa interaction attempt:', {
                      type: 'click',
                      name: feature.properties.ahupuaa,
                      activeLayer,
                      isZooming,
                      currentlySelected: selected,
                      willResetState: selected !== null
                    });

                    if (isZooming) {
                      console.log('Blocking ahupuaa interaction:', {
                        reason: 'zooming in progress',
                        name: feature.properties.ahupuaa
                      });
                      return;
                    }

                    handleAhupuaaClick(feature, layer, e);
                  }
                });
              }
            }}
            eventHandlers={{
              add: (e) => {
                console.log('Ahupuaa layer mount state:', {
                  selected,
                  activeLayer,
                  isInteractive: !isZooming
                });
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Projects">
          <GeoJSON
            key={`projects-${selected}-${activeLayer}`}
            data={projectsGeoJSON}
            style={() => {
              const isActive = activeLayer === 'projects' && !isZooming && !selectedProject;
              return {
                color: '#2196f3',
                weight: 2,
                opacity: 1,
                fillColor: '#2196f3',
                fillOpacity: activeLayer === 'projects' ? 0.4 : 0,
                interactive: isActive,
                pointerEvents: isActive ? 'auto' : 'none',
                pane: 'projectsPane',
                className: isActive ? '' : 'pointer-events-none'
              };
            }}
            onEachFeature={(feature, layer) => {
              layer.off();
              if (activeLayer === 'projects' && !selectedProject) {
                layer.on({
                  click: (e) => {
                    console.log('Project interaction - Click attempt:', {
                      type: 'click',
                      name: feature.properties.name,
                      activeLayer,
                      isZooming,
                      hasSelectedProject: !!selectedProject
                    });

                    if (activeLayer !== 'projects' || isZooming || selectedProject) {
                      console.log('Ignoring project click:', {
                        reason: activeLayer !== 'projects' ? 'wrong layer' :
                               isZooming ? 'zooming in progress' :
                               'already selected a project'
                      });
                      return;
                    }
                    handleProjectClick(feature, layer, e);
                  }
                });
              }
            }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                if (selectedProject) {
                  layer.eachLayer((l) => {
                    l.off();
                    l._path?.classList.add('pointer-events-none');
                  });
                }
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Plots">
          <GeoJSON
            key={`plots-${selectedProject}-${activeLayer}`}
            data={plotsGeoJSON}
            style={() => {
              const isActive = activeLayer === 'plots' && !isZooming;
              return {
                weight: 2,
                color: '#FF4081',
                fillColor: '#FF4081',
                fillOpacity: activeLayer === 'plots' ? 0.4 : 0,
                interactive: isActive,
                pointerEvents: isActive ? 'auto' : 'none',
                pane: 'plotsPane',
                className: isActive ? '' : 'pointer-events-none'
              };
            }}
            onEachFeature={(feature, layer) => {
              layer.off();
              if (activeLayer === 'plots' && !isZooming) {
                layer.on({
                  click: (e) => {
                    console.log('Plot interaction - Click attempt:', {
                      type: 'click',
                      name: feature.properties.name,
                      projectName: feature.properties.projectName,
                      activeLayer,
                      isZooming
                    });

                    if (activeLayer !== 'plots' || isZooming) {
                      console.log('Ignoring plot click:', {
                        reason: activeLayer !== 'plots' ? 'wrong layer' : 'zooming in progress'
                      });
                      return;
                    }
                    console.log('Plot clicked:', {
                      name: feature.properties.name,
                      bounds: layer.getBounds(),
                      center: layer.getBounds().getCenter()
                    });
                    const map = mapRef.current;
                    if (map) {
                      setIsZooming(true);
                      const bounds = layer.getBounds();
                      map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 20,
                        duration: 1
                      });
                      setTimeout(() => setIsZooming(false), 1000);
                    }
                  }
                });
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Sensor Stations">
          <LayerGroup>
            {sensors
              .filter(sensor => {
                if (activeLayer === 'plots') {
                  return sensor.projectName === selectedProject;
                }
                return activeLayer !== 'ahupuaa';
              })
              .map((sensor, index) => (
                <Marker
                  key={index}
                  position={[sensor.latitude, sensor.longitude]}
                >
                  <Popup>
                    <div>
                      <h3>{sensor.name}</h3>
                      <p>Project: {sensor.projectName}</p>
                      <p>Patch: {sensor.plotName}</p>
                      <p>{sensor.metadata.description}</p>
                      <p>Latest Value: {sensor.data[sensor.data.length - 1].value} {sensor.metadata.unit}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Info position="bottomleft" selected={selected} selectedProject={selectedProject} />
    </MapContainer>
  )
}

export default Map
