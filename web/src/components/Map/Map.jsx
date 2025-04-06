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
  // Rename to avoid conflict with JavaScript Map constructor
  const disabledLayersMapRef = useRef(new window.Map());

  // Define initial state object
  const initialState = {
    selected: null,
    selectedProject: null,
    activeLayer: 'ahupuaa',
    zoom: 10.5,
    center: [21.4389, -158]
  };

  const [selected, setSelected] = useState(initialState.selected)
  const [selectedProject, setSelectedProject] = useState(initialState.selectedProject)
  const [isZooming, setIsZooming] = useState(false);
  const [activeLayer, setActiveLayer] = useState(initialState.activeLayer);
  const center = initialState.center;
  const zoom = initialState.zoom;
  // Add click timer ref
  const clickTimerRef = useRef(null);
  const DOUBLE_CLICK_DELAY = 300; // ms

  // Function to reset to initial state
  const resetToInitialState = () => {
    console.log('RESET: Initiating state reset:', {
      currentSelected: selected,
      currentProject: selectedProject,
      currentLayer: activeLayer,
      isZooming
    });

    // Reset all state variables to match initial state
    setSelectedProject(null);
    setActiveLayer('ahupuaa');
    setIsZooming(false);
    setSelected(null); // Reset selected ahupuaa as well

    // Re-enable all ahupuaa layers through the GeoJSON ref
    if (geoJSONRef.current) {
      console.log('RESET: Re-enabling all ahupuaa polygons');
      geoJSONRef.current.eachLayer((layer) => {
        const featureName = layer.feature?.properties?.ahupuaa;
        console.log('RESET: Re-enabling ahupuaa layer:', {
          name: featureName,
          action: 'enabling all interactions'
        });

        // Re-enable all layers since we're resetting to initial state
        layer.setStyle({
          interactive: true,
          pointerEvents: 'auto'
        });
        if (layer._path) {
          layer._path.classList.remove('pointer-events-none');
        }

        // Re-attach click handler
        layer.off(); // Clear existing handlers
        layer.on({
          click: (e) => handleAhupuaaClick(layer.feature, layer, e)
        });
      });
    }

    // Clear any pending click timers
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    // Clear the disabled layers tracking
    disabledLayersMapRef.current.clear();
    console.log('RESET: Complete - restored to initial state:', {
      selected: null,
      selectedProject: null,
      activeLayer: 'ahupuaa',
      isZooming: false,
      disabledCount: disabledLayersMapRef.current.size
    });

    // Reset map view to initial state
    if (mapRef.current) {
      mapRef.current.setView(initialState.center, initialState.zoom);
    }
  };

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

    console.log('Generated project features:', features);

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
    if (activeLayer !== 'ahupuaa') {
      console.log('BLOCKED: Ahupuaa click - wrong layer:', {
        attempted: activeLayer,
        required: 'ahupuaa'
      });
      return;
    }

    const ahupuaaName = feature.properties.ahupuaa || feature.properties.name;
    console.log('INTERACTION: Processing ahupuaa click:', {
      type: 'ahupuaa_click',
      name: ahupuaaName,
      currentState: {
        selected,
        selectedProject,
        activeLayer,
        isZooming
      }
    });

    // Clear project selection and reset layer state
    if (selectedProject) {
      console.log('STATE: Clearing project selection:', {
        from: selectedProject,
        to: null,
        reason: 'new ahupuaa selection'
      });
      setSelectedProject(null);
      setActiveLayer('ahupuaa');
    }

    const ahupuaaData = zonesData.ahupuaas.find(a => a.name === ahupuaaName);
    const hasProjects = ahupuaaData && ahupuaaData.projects?.length > 0;

    console.log('DATA: Ahupuaa properties:', {
      name: ahupuaaName,
      hasProjects,
      projectCount: ahupuaaData?.projects?.length || 0
    });

    const map = mapRef.current;
    if (map) {
      setIsZooming(true);
      console.log('STATE: Setting zoom state:', {
        from: false,
        to: true,
        reason: 'ahupuaa click'
      });

      // Update selection after starting zoom
      console.log('STATE: Updating ahupuaa selection:', {
        from: selected,
        to: ahupuaaName
      });
      setSelected(ahupuaaName);

      // Get center of the ahupuaa polygon
      const center = layer.getBounds().getCenter();
      console.log('ZOOM: Ahupuaa zoom initiated:', {
        name: ahupuaaName,
        center,
        hasProjects
      });

      // Zoom to the ahupuaa center
      map.setView(center, 14);

      // Switch to projects layer if the ahupuaa has projects
      setTimeout(() => {
        if (hasProjects) {
          console.log('ZOOM: Ahupuaa zoom complete, transitioning to projects:', {
            ahupuaa: ahupuaaName,
            nextLayer: 'projects'
          });
          setActiveLayer('projects');
        } else {
          console.log('ZOOM: Ahupuaa zoom complete, staying in ahupuaa layer:', {
            reason: 'no projects available'
          });
        }
        setIsZooming(false);
      }, 1000);
    }
  };

  const handleProjectClick = (feature, layer, e, bypassZoomCheck = false) => {
    const projectName = feature.properties.name;
    const ahupuaaName = feature.properties.ahupuaa;
    const isReclick = projectName === selectedProject;

    console.log('DEBUG: Project click detected:', {
      clickedProject: projectName,
      currentlySelected: selectedProject,
      isReclick,
      activeLayer,
      isZooming,
      bypassZoomCheck,
      state: {
        selected,
        selectedProject,
        activeLayer,
        isZooming
      }
    });

    if (activeLayer !== 'projects') {
      console.log('BLOCKED: Project click - wrong layer:', {
        attempted: activeLayer,
        required: 'projects'
      });
      return;
    }

    // HACK: Allow bypassing zoom check when we've explicitly completed previous zoom
    if (isZooming && !bypassZoomCheck) {
      console.log('BLOCKED: Project click - zooming in progress');
      return;
    }

    // Only stop propagation on the original DOM event
    if (e.originalEvent) {
      console.log('INTERACTION: Stopping project click propagation');
      L.DomEvent.stopPropagation(e.originalEvent);
      L.DomEvent.preventDefault(e.originalEvent);
    }

    console.log('INTERACTION: Project click processing:', {
      type: 'project_click',
      name: projectName,
      ahupuaa: ahupuaaName,
      isReclick,
      currentState: {
        selected,
        selectedProject,
        activeLayer,
        isZooming
      }
    });

    const map = mapRef.current;
    if (map) {
      // Start zoom sequence
      setIsZooming(true);
      console.log('STATE: Setting zoom state:', {
        from: false,
        to: true,
        reason: 'project click',
        isReclick
      });

      // Set project and maintain ahupuaa selection
      console.log('STATE: Updating selections:', {
        project: {
          from: selectedProject,
          to: projectName,
          isReclick
        },
        ahupuaa: {
          from: selected,
          to: ahupuaaName
        }
      });

      // Always update selections, even on reclick
      setSelectedProject(projectName);
      setSelected(ahupuaaName);

      // Zoom to project bounds
      const bounds = layer.getBounds();
      console.log('ZOOM: Project zoom initiated:', {
        name: projectName,
        bounds: bounds,
        zoomLevel: feature.properties.zoom || 18,
        isReclick
      });

      // Always zoom, even on reclick
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: feature.properties.zoom || 18,
        animate: true,
        duration: 1
      });

      // After zoom completes, switch to plots layer while maintaining selections
      setTimeout(() => {
        console.log('ZOOM: Project zoom complete, transitioning to plots:', {
          project: projectName,
          ahupuaa: ahupuaaName,
          nextLayer: 'plots',
          isReclick
        });
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
                const ahupuaaName = feature.properties.ahupuaa;
                const isSelected = ahupuaaName === selected;
                return {
                weight: 2,
                  color: '#228B22',
                  fillColor: '#228B22',
                fill: true,
                  fillOpacity: activeLayer === 'ahupuaa' ? 0.1 : 0.02,
                  interactive: !isSelected && activeLayer === 'ahupuaa',
                  pointerEvents: !isSelected && activeLayer === 'ahupuaa' ? 'auto' : 'none',
                  pane: 'ahupuaaPane',
                  className: !isSelected && activeLayer === 'ahupuaa' ? '' : 'pointer-events-none'
                };
              }}
              onEachFeature={(feature, layer) => {
                // First, remove any existing event listeners
                layer.off();

                // Always attach click handler
                layer.on({
                  click: (e) => {
                    const ahupuaaName = feature.properties.ahupuaa;
                    console.log('INTERACTION: Ahupuaa polygon clicked:', {
                      type: 'ahupuaa',
                      name: ahupuaaName,
                      activeLayer,
                      isZooming,
                      hasClickTimer: !!clickTimerRef.current
                    });

                    // Always stop propagation for both single and double clicks
                    L.DomEvent.stopPropagation(e.originalEvent);

                    // If we're zooming or this is the selected ahupuaa, ignore the click entirely
                    if (isZooming || ahupuaaName === selected) {
                      console.log('BLOCKED: Ahupuaa interaction blocked:', {
                        name: ahupuaaName,
                        reason: isZooming ? 'zooming in progress' : 'already selected'
                      });
                      return;
                    }

                    // If there's a pending click timer, this is a double click
                    if (clickTimerRef.current) {
                      console.log('INTERACTION: Double click detected on ahupuaa:', {
                        name: ahupuaaName,
                        action: 'allowing map zoom'
                      });
                      clearTimeout(clickTimerRef.current);
                      clickTimerRef.current = null;
                      return;
                    }

                    // Set a timer for potential double click
                    clickTimerRef.current = setTimeout(() => {
                      console.log('INTERACTION: Single click confirmed on ahupuaa:', {
                        name: ahupuaaName,
                        action: 'processing selection'
                      });
                      clickTimerRef.current = null;
                      handleAhupuaaClick(feature, layer, e);
                    }, DOUBLE_CLICK_DELAY);
                  }
                });
              }}
              eventHandlers={{
                add: (e) => {
                  const layer = e.target;
                  console.log('MOUNT: Ahupuaa layer mounted:', {
                    selected,
                    activeLayer
                  });

                  // If there's a selected ahupuaa, make sure its layer is non-interactive
                  if (selected) {
                    layer.eachLayer((l) => {
                      const featureName = l.feature?.properties?.ahupuaa;
                      if (featureName === selected) {
                        console.log('DISABLE: Ahupuaa layer disabled:', {
                          name: featureName,
                          reason: 'selected ahupuaa'
                        });
                        l.setStyle({
                          interactive: false,
                          pointerEvents: 'none'
                        });
                        if (l._path) {
                          l._path.classList.add('pointer-events-none');
                        }
                      } else {
                        console.log('ENABLE: Ahupuaa layer enabled:', {
                          name: featureName,
                          reason: 'not selected'
                        });
                        l.setStyle({
                          interactive: true,
                          pointerEvents: 'auto'
                        });
                        if (l._path) {
                          l._path.classList.remove('pointer-events-none');
                        }
                      }
                    });
                  }
                }
              }}
            />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Projects">
          <GeoJSON
            key={`projects-${selected}-${activeLayer}`}
            data={projectsGeoJSON}
            style={(feature) => {
              const isActive = activeLayer === 'projects';
              return {
                color: '#2196f3',
                weight: 2,
                opacity: 1,
                fillColor: '#2196f3',
                fillOpacity: activeLayer === 'projects' ? 0.4 : 0,
                interactive: true,
                pointerEvents: 'auto',
                pane: 'projectsPane'
              };
            }}
            onEachFeature={(feature, layer) => {
              // Clear existing handlers
              layer.off();

              // Always attach click handler
              layer.on({
                click: (e) => {
                  const projectName = feature.properties.name;
                  console.log('INTERACTION: Project polygon clicked:', {
                    type: 'project',
                    name: projectName,
                    ahupuaa: feature.properties.ahupuaa,
                    activeLayer,
                    isZooming,
                    hasSelectedProject: !!selectedProject,
                    isReclick: projectName === selectedProject
                  });

                  // First check if we're in the right layer
                  if (activeLayer !== 'projects') {
                    console.log('BLOCKED: Project interaction blocked:', {
                      name: projectName,
                      reason: 'wrong layer'
                    });
                    return;
                  }

                  // HACK: If we're completing a previous zoom, bypass the zoom check
                  let bypassZoom = false;
                  if (isZooming) {
                    console.log('STATE: Completing previous zoom');
                    setIsZooming(false);
                    bypassZoom = true;  // Set flag to bypass zoom check
                  }

                  // Always handle the click, with zoom check bypass if needed
                  handleProjectClick(feature, layer, e, bypassZoom);
                }
              });
            }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                console.log('MOUNT: Project layer mounted:', {
                  selected,
                  selectedProject,
                  activeLayer
                });

                // Always enable project layers
                layer.eachLayer((l) => {
                  const projectName = l.feature?.properties?.name;
                  console.log('ENABLE: Project layer enabled:', {
                    name: projectName,
                    reason: 'ensuring interactivity'
                  });
                  l.setStyle({
                    interactive: true,
                    pointerEvents: 'auto'
                  });
                  if (l._path) {
                    l._path.classList.remove('pointer-events-none');
                  }
                });
              }
            }}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Plots">
          <GeoJSON
            key={`plots-${selectedProject}-${activeLayer}`}
            data={plotsGeoJSON}
            style={(feature) => {
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
                    const plotName = feature.properties.name;
                    console.log('INTERACTION: Plot polygon clicked:', {
                      type: 'plot',
                      name: plotName,
                      projectName: feature.properties.projectName,
                      activeLayer,
                      isZooming
                    });

                    if (activeLayer !== 'plots' || isZooming) {
                      console.log('BLOCKED: Plot interaction blocked:', {
                        name: plotName,
                        reason: activeLayer !== 'plots' ? 'wrong layer' : 'zooming in progress'
                      });
                      return;
                    }
                    console.log('ZOOM: Plot zoom initiated:', {
                      name: plotName,
                      bounds: layer.getBounds()
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
                      setTimeout(() => {
                        setIsZooming(false);
                        console.log('ZOOM: Plot zoom complete:', {
                          name: plotName
                        });
                      }, 1000);
                    }
                  }
                });
              }
            }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                console.log('MOUNT: Plot layer mounted:', {
                  selected,
                  selectedProject,
                  activeLayer
                });

                // Re-enable all plot layers
                layer.eachLayer((l) => {
                  const plotName = l.feature?.properties?.name;
                  console.log('ENABLE: Plot layer enabled:', {
                    name: plotName,
                    reason: 'plot layer active'
                  });
                  l.setStyle({
                    interactive: true,
                    pointerEvents: 'auto'
                  });
                  if (l._path) {
                    l._path.classList.remove('pointer-events-none');
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
                    eventHandlers={{
                    click: () => {
                      console.log('INTERACTION: Sensor clicked:', {
                        type: 'sensor',
                        name: sensor.name,
                        project: sensor.projectName,
                        plot: sensor.plotName,
                        activeLayer
                      });
                    }
                  }}
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
